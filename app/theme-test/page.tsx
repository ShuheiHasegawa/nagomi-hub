'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import ThemeSwitcher from '@/components/ui/ThemeSwitcher'

export default function ThemeTestPage() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [cssVars, setCssVars] = useState<Record<string, string>>({})

  useEffect(() => {
    setMounted(true)
    updateCssVars()
  }, [theme])

  const updateCssVars = () => {
    if (typeof window === 'undefined') return

    const html = document.documentElement
    const computedStyle = getComputedStyle(html)

    const vars: Record<string, string> = {
      'base-100': computedStyle.getPropertyValue('--color-base-100').trim(),
      'base-200': computedStyle.getPropertyValue('--color-base-200').trim(),
      'base-300': computedStyle.getPropertyValue('--color-base-300').trim(),
      'base-content': computedStyle.getPropertyValue('--color-base-content').trim(),
      primary: computedStyle.getPropertyValue('--color-primary').trim(),
      secondary: computedStyle.getPropertyValue('--color-secondary').trim(),
      accent: computedStyle.getPropertyValue('--color-accent').trim(),
    }

    setCssVars(vars)
  }

  useEffect(() => {
    const observer = new MutationObserver(() => {
      updateCssVars()
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-base-content">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100 p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-base-content mb-2">テーマテストページ</h1>
            <p className="text-base-content/70">テーマを変更して背景色の変化を確認できます</p>
          </div>
          <div className="flex gap-4 items-center">
            <ThemeSwitcher />
            <Link
              href="/game"
              className="px-4 py-2 glass rounded-full text-sm font-medium text-base-content hover:bg-base-200/30 transition-colors"
            >
              ゲームに戻る
            </Link>
          </div>
        </div>

        {/* 現在のテーマ情報 */}
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-base-content mb-4">
            現在のテーマ: <span className="text-primary">{theme || '未設定'}</span>
          </h2>
          <div className="text-sm text-base-content/70">
            <p>
              HTML要素のdata-theme属性:{' '}
              <code className="bg-base-200 px-2 py-1 rounded">
                {document.documentElement.getAttribute('data-theme') || 'なし'}
              </code>
            </p>
          </div>
        </div>

        {/* 背景色プレビュー */}
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-base-content mb-4">背景色プレビュー</h2>
          <div className="space-y-4">
            <div className="bg-base-100 p-6 rounded-lg border-2 border-base-300">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-base-content">base-100 (背景色)</span>
                <code className="text-xs bg-base-200 px-2 py-1 rounded text-base-content">
                  {cssVars['base-100'] || '未取得'}
                </code>
              </div>
              <div className="text-sm text-base-content/70">このページのメイン背景色です</div>
            </div>

            <div className="bg-base-200 p-6 rounded-lg border-2 border-base-300">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-base-content">base-200</span>
                <code className="text-xs bg-base-100 px-2 py-1 rounded text-base-content">
                  {cssVars['base-200'] || '未取得'}
                </code>
              </div>
            </div>

            <div className="bg-base-300 p-6 rounded-lg border-2 border-base-300">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-base-content">base-300</span>
                <code className="text-xs bg-base-100 px-2 py-1 rounded text-base-content">
                  {cssVars['base-300'] || '未取得'}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* テーマカラーパレット */}
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-base-content mb-4">テーマカラーパレット</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-primary p-6 rounded-lg">
              <div className="text-primary-content font-semibold mb-2">Primary</div>
              <code className="text-xs bg-primary/20 px-2 py-1 rounded text-primary-content">
                {cssVars['primary'] || '未取得'}
              </code>
            </div>

            <div className="bg-secondary p-6 rounded-lg">
              <div className="text-secondary-content font-semibold mb-2">Secondary</div>
              <code className="text-xs bg-secondary/20 px-2 py-1 rounded text-secondary-content">
                {cssVars['secondary'] || '未取得'}
              </code>
            </div>

            <div className="bg-accent p-6 rounded-lg">
              <div className="text-accent-content font-semibold mb-2">Accent</div>
              <code className="text-xs bg-accent/20 px-2 py-1 rounded text-accent-content">
                {cssVars['accent'] || '未取得'}
              </code>
            </div>

            <div className="bg-base-content p-6 rounded-lg">
              <div className="text-base-100 font-semibold mb-2">Base Content</div>
              <code className="text-xs bg-base-content/20 px-2 py-1 rounded text-base-100">
                {cssVars['base-content'] || '未取得'}
              </code>
            </div>
          </div>
        </div>

        {/* テキストカラーサンプル */}
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-base-content mb-4">テキストカラーサンプル</h2>
          <div className="space-y-2">
            <p className="text-base-content text-lg">これは base-content のテキストです</p>
            <p className="text-primary text-lg">これは primary のテキストです</p>
            <p className="text-secondary text-lg">これは secondary のテキストです</p>
            <p className="text-accent text-lg">これは accent のテキストです</p>
          </div>
        </div>

        {/* インストラクション */}
        <div className="glass p-6 rounded-2xl border-2 border-primary/30">
          <h2 className="text-2xl font-bold text-base-content mb-4">使い方</h2>
          <ol className="list-decimal list-inside space-y-2 text-base-content/80">
            <li>右上のテーマスイッチャーアイコンをクリック</li>
            <li>テーマ一覧から任意のテーマを選択</li>
            <li>背景色やカラーパレットが変化することを確認</li>
            <li>各テーマで背景色が正しく変わるか確認してください</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
