import { test, expect } from '@playwright/test'

test.describe('レスポンシブ対応テスト', () => {
  // モバイル表示のテストはviewportを700px以下に設定
  test.use({
    viewport: { width: 375, height: 667 }
  })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // ヘッダーが表示されるまで待機
    await page.waitForSelector('.header', { state: 'visible', timeout: 60000 })

    // サイドバーが表示されるまで待機
    await page.waitForSelector('.side-bar', { state: 'visible', timeout: 60000 })

    // サイドバーの項目が表示されるまで待機
    await page.waitForSelector('.side-bar .item:first-child', { state: 'visible', timeout: 60000 })

    // グラフが表示されるまで待機
    await page.waitForSelector('.chart', { state: 'visible', timeout: 60000 })
  })

  test('モバイル表示レイアウトテスト', async ({ page }) => {
    // コンテンツが縦並びになっていることを確認
    const content = page.locator('.content')
    await expect(content).toHaveCSS('flex-direction', 'column')

    // チャートエリアのマージンを確認
    const chart = page.locator('.chart')
    await expect(chart).toHaveCSS('margin', '10px 10px 0px')

    // 各要素が表示されていることを確認
    await expect(page.locator('.header')).toBeVisible()
    await expect(page.locator('.chart'), 'グラフエリアが表示されていません').toBeVisible({ timeout: 60000 })
    await expect(page.locator('.side-bar'), 'サイドバーが表示されていません').toBeVisible({ timeout: 60000 })
  })

  test('モバイル表示での都道府県選択テスト', async ({ page }) => {
    // 東京都を選択
    await page.locator('.side-bar .item').filter({ hasText: '東京都' }).click()
    
    // グラフに東京都のデータが表示されることを確認
    await expect(page.locator('.chart'), '東京都のデータが表示されていません').toContainText('東京都', { timeout: 60000 })
    
    // サイドバーに東京都のデータが表示されることを確認
    await expect(page.locator('.side-bar')).toContainText('東京都', { timeout: 60000 })
    // 大阪府を追加選択
    await page.locator('[id^="prefecture-"]').filter({ hasText: '大阪府' }).click({ force: true })
    
    // グラフに両都道府県のデータが表示されることを確認
    await expect(page.locator('.chart')).toContainText('東京都')
    await expect(page.locator('.chart')).toContainText('大阪府')
  })

  test('モバイル表示でのグラフ表示テスト', async ({ page }) => {
    // 東京都を選択
    await page.locator('.side-bar .item').filter({ hasText: '東京都' }).click()
    
    // グラフが適切なサイズで表示されることを確認
    const chart = page.locator('.chart')
    const chartBox = await chart.boundingBox()
    
    // グラフの幅がビューポートの幅に適していることを確認
    expect(chartBox?.width).toBeLessThanOrEqual(375)
    expect(chartBox?.width).toBeGreaterThan(0)
  })

  test('モバイル表示でのテーブル表示テスト', async ({ page }) => {
    // 東京都を選択
    await page.locator('.side-bar .item').filter({ hasText: '東京都' }).click()
    
    // テーブルが適切なサイズで表示されることを確認
    const table = page.locator('.side-bar')
    const tableBox = await table.boundingBox()
    
    // テーブルの幅がビューポートの幅に適していることを確認
    expect(tableBox?.width).toBeLessThanOrEqual(375)
    expect(tableBox?.width).toBeGreaterThan(0)
  })
})