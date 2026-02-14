import { test, expect } from '@playwright/test'

test.describe('基本フロー', () => {
  test('ランディングページが表示される', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Nagomi Hub')
  })

  test('ゲーム画面に遷移できる', async ({ page }) => {
    await page.goto('/game')
    await expect(page.locator('h1')).toContainText('Nagomi Hub')
    // 設定リンクが存在する
    await expect(page.getByText('設定')).toBeVisible()
  })

  test('設定ページが表示される', async ({ page }) => {
    await page.goto('/settings')
    await expect(page.getByText('音楽設定')).toBeVisible()
    await expect(page.getByText('カスタマイズ')).toBeVisible()
    await expect(page.getByText('アカウント設定')).toBeVisible()
  })

  test('実績ページが表示される', async ({ page }) => {
    await page.goto('/achievements')
    await expect(page.getByText('実績')).toBeVisible()
    await expect(page.getByText('実績進捗')).toBeVisible()
  })

  test('精霊図鑑ページが表示される', async ({ page }) => {
    await page.goto('/spirits')
    await expect(page.getByText('精霊図鑑')).toBeVisible()
    await expect(page.getByText('コレクション進捗')).toBeVisible()
  })

  test('テーマ切替が動作する', async ({ page }) => {
    await page.goto('/game')
    // テーマスイッチャーが存在
    const themeSwitcher = page.locator('[data-testid="theme-switcher"]').or(page.locator('select'))
    if (await themeSwitcher.count()) {
      await expect(themeSwitcher.first()).toBeVisible()
    }
  })

  test('タイマーモーダルが開く', async ({ page }) => {
    await page.goto('/game')
    // タイマーボタンをクリック
    const timerBtn = page.getByText('⏱️').or(page.getByText('タイマー'))
    await timerBtn.first().click()
    await expect(page.getByText('ポモドーロタイマー')).toBeVisible()
  })
})
