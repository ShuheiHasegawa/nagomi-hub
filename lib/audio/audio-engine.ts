/**
 * AudioEngine — Web Audio API ベースの音声エンジン (シングルトン)
 *
 * 構成:
 *   BufferSource → GainNode(個別) → GainNode(マスター) → Destination
 *
 * チャネル: BGM×1 + 環境音×4 (rain, forest, ocean, fire)
 */

export type ChannelId = 'bgm' | 'rain' | 'forest' | 'ocean' | 'fire'

interface Channel {
  source: AudioBufferSourceNode | null
  gainNode: GainNode
  buffer: AudioBuffer | null
  volume: number // 0-1
  isPlaying: boolean
  loop: boolean
}

class AudioEngine {
  private static instance: AudioEngine | null = null
  private context: AudioContext | null = null
  private masterGain: GainNode | null = null
  private channels: Map<ChannelId, Channel> = new Map()
  private masterVolume = 0.7
  private bufferCache: Map<string, AudioBuffer> = new Map()
  private initialized = false

  private constructor() {}

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine()
    }
    return AudioEngine.instance
  }

  /**
   * ユーザージェスチャー内で呼び出すこと（Autoplay Policy対応）
   */
  async initialize(): Promise<void> {
    if (this.initialized && this.context) return

    this.context = new AudioContext()
    this.masterGain = this.context.createGain()
    this.masterGain.gain.value = this.masterVolume
    this.masterGain.connect(this.context.destination)

    // チャネル初期化
    const channelIds: ChannelId[] = ['bgm', 'rain', 'forest', 'ocean', 'fire']
    for (const id of channelIds) {
      const gainNode = this.context.createGain()
      gainNode.connect(this.masterGain)
      this.channels.set(id, {
        source: null,
        gainNode,
        buffer: null,
        volume: id === 'bgm' ? 0.6 : 0.3,
        isPlaying: false,
        loop: true,
      })
    }

    // suspended 状態なら resume
    if (this.context.state === 'suspended') {
      await this.context.resume()
    }

    this.initialized = true
  }

  isInitialized(): boolean {
    return this.initialized
  }

  getContextState(): AudioContextState | null {
    return this.context?.state ?? null
  }

  /**
   * 音声ファイルをフェッチしてデコード（キャッシュ付き）
   */
  async loadAudio(url: string): Promise<AudioBuffer> {
    if (this.bufferCache.has(url)) {
      return this.bufferCache.get(url)!
    }
    if (!this.context) throw new Error('AudioEngine not initialized')

    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer)
    this.bufferCache.set(url, audioBuffer)
    return audioBuffer
  }

  /**
   * チャネルに音声をロードして再生
   */
  async play(channelId: ChannelId, url: string): Promise<void> {
    if (!this.context || !this.masterGain) return

    const channel = this.channels.get(channelId)
    if (!channel) return

    // 既存ソースを停止
    this.stopChannel(channelId)

    const buffer = await this.loadAudio(url)
    channel.buffer = buffer

    const source = this.context.createBufferSource()
    source.buffer = buffer
    source.loop = channel.loop
    source.connect(channel.gainNode)
    channel.gainNode.gain.value = channel.volume

    source.onended = () => {
      if (channel.source === source) {
        channel.isPlaying = false
        channel.source = null
      }
    }

    source.start(0)
    channel.source = source
    channel.isPlaying = true
  }

  /**
   * クロスフェード付きでチャネルの音声を切り替え
   */
  async crossfadeTo(channelId: ChannelId, url: string, duration = 2): Promise<void> {
    if (!this.context || !this.masterGain) return

    const channel = this.channels.get(channelId)
    if (!channel) return

    const buffer = await this.loadAudio(url)

    if (channel.isPlaying && channel.source) {
      // フェードアウト
      const oldGain = channel.gainNode
      oldGain.gain.linearRampToValueAtTime(0, this.context.currentTime + duration)

      // 新しいGainNode でフェードイン
      const newGain = this.context.createGain()
      newGain.gain.value = 0
      newGain.connect(this.masterGain)

      const source = this.context.createBufferSource()
      source.buffer = buffer
      source.loop = channel.loop
      source.connect(newGain)
      source.start(0)

      newGain.gain.linearRampToValueAtTime(channel.volume, this.context.currentTime + duration)

      // 古いソースをクリーンアップ
      setTimeout(() => {
        try {
          channel.source?.stop()
        } catch {
          // already stopped
        }
        oldGain.disconnect()
      }, duration * 1000)

      // チャネルを更新
      channel.source = source
      channel.gainNode = newGain
      channel.buffer = buffer

      source.onended = () => {
        if (channel.source === source) {
          channel.isPlaying = false
          channel.source = null
        }
      }
    } else {
      await this.play(channelId, url)
    }
  }

  /**
   * チャネルを停止
   */
  stopChannel(channelId: ChannelId): void {
    const channel = this.channels.get(channelId)
    if (!channel) return

    try {
      channel.source?.stop()
    } catch {
      // already stopped
    }
    channel.source = null
    channel.isPlaying = false
  }

  /**
   * 全チャネル停止
   */
  stopAll(): void {
    for (const id of this.channels.keys()) {
      this.stopChannel(id)
    }
  }

  /**
   * 個別チャネル音量設定 (0-100)
   */
  setChannelVolume(channelId: ChannelId, volume: number): void {
    const channel = this.channels.get(channelId)
    if (!channel || !this.context) return

    const normalizedVolume = Math.max(0, Math.min(1, volume / 100))
    channel.volume = normalizedVolume
    channel.gainNode.gain.linearRampToValueAtTime(normalizedVolume, this.context.currentTime + 0.05)
  }

  /**
   * マスター音量設定 (0-100)
   */
  setMasterVolume(volume: number): void {
    if (!this.masterGain || !this.context) return

    this.masterVolume = Math.max(0, Math.min(1, volume / 100))
    this.masterGain.gain.linearRampToValueAtTime(this.masterVolume, this.context.currentTime + 0.05)
  }

  getMasterVolume(): number {
    return Math.round(this.masterVolume * 100)
  }

  getChannelVolume(channelId: ChannelId): number {
    const channel = this.channels.get(channelId)
    return channel ? Math.round(channel.volume * 100) : 0
  }

  isChannelPlaying(channelId: ChannelId): boolean {
    return this.channels.get(channelId)?.isPlaying ?? false
  }

  /**
   * AudioContext の suspend / resume（バックグラウンド対応）
   */
  async suspend(): Promise<void> {
    if (this.context?.state === 'running') {
      await this.context.suspend()
    }
  }

  async resume(): Promise<void> {
    if (this.context?.state === 'suspended') {
      await this.context.resume()
    }
  }

  /**
   * リソース解放
   */
  dispose(): void {
    this.stopAll()
    this.bufferCache.clear()
    this.channels.clear()
    if (this.context) {
      this.context.close()
      this.context = null
    }
    this.masterGain = null
    this.initialized = false
    AudioEngine.instance = null
  }
}

export default AudioEngine
