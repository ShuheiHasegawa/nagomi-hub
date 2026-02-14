'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ReactNode, useEffect } from 'react'

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  useEffect(() => {
    // DaisyUIのテーマが正しく適用されるように確認
    const html = document.documentElement
    const checkTheme = () => {
      const theme = html.getAttribute('data-theme')
      if (theme) {
        console.log('Current theme:', theme)
        // CSS変数を確認
        const computedStyle = getComputedStyle(html)
        const base100 = computedStyle.getPropertyValue('--color-base-100')
        const b1 = computedStyle.getPropertyValue('--b1')
        const bgColor = computedStyle.backgroundColor
        const primary = computedStyle.getPropertyValue('--p')
        const secondary = computedStyle.getPropertyValue('--s')
        const colorPrimary = computedStyle.getPropertyValue('--color-primary')
        const colorSecondary = computedStyle.getPropertyValue('--color-secondary')
        console.log('--color-base-100:', base100)
        console.log('--b1:', b1)
        console.log('html backgroundColor:', bgColor)
        console.log('--p:', primary)
        console.log('--s:', secondary)
        console.log('--color-primary:', colorPrimary)
        console.log('--color-secondary:', colorSecondary)

        // .bg-base-100クラスが適用されている要素を確認
        const bgElements = document.querySelectorAll('.bg-base-100')
        console.log('Elements with .bg-base-100:', bgElements.length)
        if (bgElements.length > 0) {
          const firstBg = getComputedStyle(bgElements[0])
          console.log('First .bg-base-100 backgroundColor:', firstBg.backgroundColor)
        }
      }
    }

    const observer = new MutationObserver(checkTheme)

    observer.observe(html, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    // 初回チェック
    checkTheme()

    return () => observer.disconnect()
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
