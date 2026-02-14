/**
 * ポモドーロタイマー Web Worker
 *
 * メインスレッドの Tab Throttling の影響を受けず、
 * バックグラウンドでも安定した1秒間隔のtickを送信する。
 */

interface TimerStartMessage {
  type: 'start'
  durationSeconds: number
  startedAt: number // Date.now()
}

interface TimerStopMessage {
  type: 'stop'
}

interface TimerPauseMessage {
  type: 'pause'
}

interface TimerResumeMessage {
  type: 'resume'
}

type WorkerMessage = TimerStartMessage | TimerStopMessage | TimerPauseMessage | TimerResumeMessage

let intervalId: ReturnType<typeof setInterval> | null = null
let startedAt = 0
let durationSeconds = 0
let elapsedBeforePause = 0
let isPaused = false

function cleanup() {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}

function tick() {
  if (isPaused) return

  const now = Date.now()
  const elapsed = elapsedBeforePause + Math.floor((now - startedAt) / 1000)
  const remaining = Math.max(0, durationSeconds - elapsed)

  self.postMessage({
    type: 'tick',
    remaining,
    elapsed,
    total: durationSeconds,
  })

  if (remaining <= 0) {
    cleanup()
    self.postMessage({ type: 'complete' })
  }
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const msg = e.data

  switch (msg.type) {
    case 'start':
      cleanup()
      durationSeconds = msg.durationSeconds
      startedAt = msg.startedAt
      elapsedBeforePause = 0
      isPaused = false
      tick()
      intervalId = setInterval(tick, 1000)
      break

    case 'stop':
      cleanup()
      isPaused = false
      elapsedBeforePause = 0
      self.postMessage({ type: 'stopped' })
      break

    case 'pause': {
      isPaused = true
      const now = Date.now()
      elapsedBeforePause += Math.floor((now - startedAt) / 1000)
      self.postMessage({ type: 'paused', elapsed: elapsedBeforePause })
      break
    }

    case 'resume':
      isPaused = false
      startedAt = Date.now()
      self.postMessage({ type: 'resumed' })
      break
  }
}
