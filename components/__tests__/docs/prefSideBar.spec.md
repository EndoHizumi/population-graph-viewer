# PrefSideBar コンポーネントテスト仕様書

## 概要
都道府県選択用サイドバーコンポーネントのテスト仕様書です。

## テスト環境
- テストフレームワーク: Vitest
- コンポーネントテスト: Vue Test Utils
- ストアモック: @pinia/testing
- DOM環境: happy-dom

## テストケース

### 1. コンポーネントの初期表示

#### 1.1 基本レイアウト
- サイドバーのルート要素が存在すること
- サイドバーに適切なクラスが適用されていること
  - `side-bar`クラス
  - `mt-2`クラス
- client-onlyコンポーネントが存在すること

#### 1.2 都道府県リストの表示
- 都道府県リストが正しく表示されること
- 各都道府県に対してlegend-buttonが正しく生成されること
- legend-buttonに適切なpropsが渡されていること
  - id: prefCode
  - name: prefName

#### 1.3 ローディング状態
- フォールバックテンプレートが存在すること
- ローディング時に「データを読み込み中...」が表示されること

### 2. 都道府県選択機能

#### 2.1 都道府県の選択
- legend-buttonクリック時にonClickハンドラが呼ばれること
- 未選択の都道府県を選択した場合、selectedPrefecturesに追加されること
- クリックイベントで正しいパラメータ（id, isClicked）が渡されること

#### 2.2 都道府県の選択解除
- 選択済みの都道府県をクリックした場合、selectedPrefecturesから削除されること
- 選択解除後のselectedPrefecturesの状態が正しいこと

#### 2.3 複数選択
- 複数の都道府県を選択できること
- 選択順序が保持されること

### 3. レスポンシブ対応

#### 3.1 デスクトップ表示
- サイドバーが縦方向にスクロール可能であること
- 最小幅（min-width: 100px）が適用されていること
- 最大高さ（calc(100vh - 40px)）が適用されていること

#### 3.2 モバイル表示（700px以下）
- サイドバーの幅が自動調整されること
- 高さが適切に計算されること（calc(50vh - 20px)）
- コンテンツが横方向にフレックス配置されること
- アイテムが適切にラップされること

## モックデータ

```typescript
const mockPrefecturesList = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' },
  { prefCode: 3, prefName: '岩手県' }
]
```

## テスト実装のポイント

1. コンポーネントのマウント
```typescript
const createComponent = (initialState = {}) => {
  return mount(PrefSideBar, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            prefecture: {
              selectedPrefectures: [],
              prefecturesList: mockPrefecturesList,
              ...initialState
            }
          }
        })
      ]
    }
  })
}
```

2. レスポンシブテスト
- window.innerWidthを変更してテスト
- CSSクラスの適用を確認

3. イベントハンドリング
- legend-buttonからのクリックイベントをモック
- Piniaストアの状態変更を確認

4. 非同期処理
- nextTickを使用して状態変更後のDOMを確認
- ローディング状態のテスト

## 注意事項

1. テストの独立性
- 各テストケース前にストア状態をリセット
- テスト間で状態が漏れないよう注意

2. レスポンシブテスト
- ウィンドウサイズの変更後は適切なクリーンアップが必要

3. client-onlyコンポーネント
- SSR考慮したテストが必要
- フォールバックコンテンツのテストを含める