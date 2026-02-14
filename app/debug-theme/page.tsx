'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import ThemeSwitcher from '@/components/ui/ThemeSwitcher'

export default function DebugThemePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    setMounted(true)
    updateDebugInfo()
  }, [theme])

  const updateDebugInfo = () => {
    if (typeof window === 'undefined') return

    const html = document.documentElement
    const computedStyle = getComputedStyle(html)

    // data-theme属性を確認
    const dataTheme = html.getAttribute('data-theme')

    // CSS変数を確認
    const cssVars: Record<string, string> = {}
    const varNames = [
      '--color-base-100',
      '--color-base-200',
      '--color-base-300',
      '--color-base-content',
      '--color-primary',
      '--color-secondary',
      '--color-accent',
    ]

    varNames.forEach((varName) => {
      cssVars[varName] = computedStyle.getPropertyValue(varName).trim()
    })

    // HTML要素の背景色を確認
    const htmlBgColor = computedStyle.backgroundColor

    // body要素の背景色を確認
    const body = document.body
    const bodyStyle = getComputedStyle(body)
    const bodyBgColor = bodyStyle.backgroundColor

    setDebugInfo({
      dataTheme,
      cssVars,
      htmlBgColor,
      bodyBgColor,
      htmlClasses: html.className,
      bodyClasses: body.className,
    })
  }

  useEffect(() => {
    const observer = new MutationObserver(() => {
      updateDebugInfo()
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">読み込み中...</div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-base-content">DaisyUI デバッグページ</h1>
          <ThemeSwitcher />
        </div>

        {/* 現在のテーマ情報 */}
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-base-content mb-4">テーマ情報</h2>
          <div className="space-y-2 text-base-content">
            <p>
              <strong>next-themes theme:</strong> {theme || '未設定'}
            </p>
            <p>
              <strong>HTML data-theme属性:</strong>{' '}
              <code className="bg-base-200 px-2 py-1 rounded">{debugInfo.dataTheme || 'なし'}</code>
            </p>
          </div>
        </div>

        {/* CSS変数の値 */}
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-base-content mb-4">CSS変数の値</h2>
          <div className="space-y-2 font-mono text-sm">
            {Object.entries(debugInfo.cssVars || {}).map(([key, value]) => (
              <div key={key} className="flex gap-4">
                <span className="text-base-content/70 w-48">{key}:</span>
                <span className="text-primary">{String(value) || '(空)'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 背景色の実際の値 */}
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-base-content mb-4">実際の背景色</h2>
          <div className="space-y-2">
            <div className="flex gap-4 items-center">
              <span className="text-base-content w-32">HTML要素:</span>
              <div
                className="w-32 h-16 border-2 border-base-content rounded"
                style={{ backgroundColor: debugInfo.htmlBgColor }}
              />
              <code className="text-sm text-base-content/70">{debugInfo.htmlBgColor}</code>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-base-content w-32">Body要素:</span>
              <div
                className="w-32 h-16 border-2 border-base-content rounded"
                style={{ backgroundColor: debugInfo.bodyBgColor }}
              />
              <code className="text-sm text-base-content/70">{debugInfo.bodyBgColor}</code>
            </div>
          </div>
        </div>

        {/* 背景色プレビュー */}
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-base-content mb-4">背景色プレビュー</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-base-100 p-6 rounded-lg border-2 border-base-300">
              <div className="font-semibold text-base-content mb-2">base-100</div>
              <code className="text-xs text-base-content/70">
                {debugInfo.cssVars?.['--color-base-100'] || '未取得'}
              </code>
            </div>
            <div className="bg-base-200 p-6 rounded-lg border-2 border-base-300">
              <div className="font-semibold text-base-content mb-2">base-200</div>
              <code className="text-xs text-base-content/70">
                {debugInfo.cssVars?.['--color-base-200'] || '未取得'}
              </code>
            </div>
            <div className="bg-base-300 p-6 rounded-lg border-2 border-base-300">
              <div className="font-semibold text-base-content mb-2">base-300</div>
              <code className="text-xs text-base-content/70">
                {debugInfo.cssVars?.['--color-base-300'] || '未取得'}
              </code>
            </div>
          </div>
        </div>

        {/* 手動でテーマを設定 */}
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-base-content mb-4">手動でテーマを設定</h2>
          <div className="flex gap-2 flex-wrap">
            {[
              'light',
              'dark',
              'cupcake',
              'bumblebee',
              'emerald',
              'forest',
              'ocean',
              'komorebi',
            ].map((themeName) => (
              <button
                key={themeName}
                onClick={() => {
                  setTheme(themeName)
                  setTimeout(updateDebugInfo, 100)
                }}
                className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/80 transition-colors"
              >
                {themeName}
              </button>
            ))}
          </div>
        </div>

        {/* 生のHTML属性を確認 */}
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-base-content mb-4">HTML要素の属性</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <strong className="text-base-content">HTML class:</strong>{' '}
              <code className="text-primary">{debugInfo.htmlClasses || '(なし)'}</code>
            </div>
            <div>
              <strong className="text-base-content">Body class:</strong>{' '}
              <code className="text-primary">{debugInfo.bodyClasses || '(なし)'}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
