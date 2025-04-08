import { test, expect } from '@playwright/test'

test.describe('基本機能テスト', () => {
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

  test('初期表示テスト', async ({ page }) => {
    // ヘッダーの確認
    await expect(page.locator('.header')).toBeVisible()
    
    // サイドバーの確認
    const prefectureList = page.locator('.side-bar')
    await expect(prefectureList).toBeVisible()
    
    // グラフエリアの確認
    await expect(page.locator('.chart')).toBeVisible()
    
    // 47都道府県が表示されていることを確認
    const prefectureCount = await page.locator('.side-bar .item').count()
    expect(prefectureCount).toBe(47)
  })

  test('都道府県選択テスト', async ({ page }) => {
    // 東京都を選択
    await page.locator('[id^="prefecture-"]').filter({ hasText: '東京都' }).click()
    
    // グラフに東京都のデータが表示されることを確認
    await expect(page.locator('.chart')).toContainText('東京都')
    
    // サイドバーに東京都のデータが表示されることを確認
    await expect(page.locator('.side-bar')).toContainText('東京都')

    // 大阪府を追加選択
    await page.locator('[id^="prefecture-"]').filter({ hasText: '大阪府' }).click({ force: true })
    // グラフに両都道府県のデータが表示されることを確認
    await expect(page.locator('.chart')).toContainText('東京都')
    await expect(page.locator('.chart')).toContainText('大阪府')
  })

  test('データ表示切り替えテスト', async ({ page }) => {
    // 東京都を選択
    await page.locator('.side-bar .item').filter({ hasText: '東京都' }).click()
    
    // タブの名前一覧（予想）
    const tabs = ['総人口', '年少人口', '生産年齢人口', '老年人口']

    for (let index = 0; index < tabs.length-1; index++) {
      // タブ切り替え前のデータを保存
      const pastData = await page.locator('tbody tr:first-child td:nth-child(2)').textContent()
      
      // 次のタブへ
      await page.locator('.embla__button--next').click()
      await page.waitForTimeout(500) // データ読み込み待ち
      
      // タブ切り替え後のデータを取得
      const postData = await page.locator('tbody tr:first-child td:nth-child(2)').textContent()
      
      // データが変わっていることを確認
      expect(postData).not.toEqual(pastData)
      
    }
  })
})