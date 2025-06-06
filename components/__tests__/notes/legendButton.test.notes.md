# LegendButton コンポーネントテスト仕様書

## 1. コンポーネントのマウントテスト

### 1.1 基本レンダリング
- コンポーネントが正常にマウントされることを確認
- 必要なpropsが正しく渡された時、エラーなくレンダリングされることを確認

### 1.2 構造テスト
- ルート要素のdiv要素が存在することを確認
- img要素が存在することを確認
- span要素に都道府県名が表示されることを確認

## 3. イベントテスト

### 3.1 クリックイベント
- クリック時にclickイベントが発火することを確認
- イベントペイロードに正しい情報が含まれることを確認
  - id: 都道府県ID
  - isClicked: クリック状態（boolean）

### 3.2 複数回クリック
- 1回目のクリックで選択状態になることを確認
- 2回目のクリックで非選択状態に戻ることを確認
- クリックごとにイベントが正しく発火することを確認

## 4. 状態管理テスト

### 4.1 選択状態の管理
- 初期状態で非選択状態（isClicked = false）であることを確認
- クリック後に選択状態（isClicked = true）に変更されることを確認
- 再クリックで非選択状態に戻ることを確認

### 4.2 背景色の管理
- 初期状態で背景色がデフォルト（rgb(229, 231, 235)）であることを確認
- クリック後に背景色が都道府県カラーに変更されることを確認
- 再クリックでデフォルト色に戻ることを確認

## 5. スタイルテスト

### 5.1 基本スタイル
- コンポーネントのサイズが正しいことを確認（w-[67px] h-[67px]）
- 画像のサイズが正しいことを確認（w-[45px] h-[40px]）
- 角丸スタイルが適用されていることを確認（rounded-xl）

### 5.2 インタラクションスタイル
- ホバー時の透明度変更が適用されることを確認（hover:opacity-70）
- カーソルスタイルが正しいことを確認（cursor-pointer）
- テキスト選択が無効化されていることを確認（select-none）

## 6. アクセシビリティテスト

### 6.1 画像のアクセシビリティ
- img要素にalt属性が正しく設定されていることを確認
- alt属性に都道府県名が設定されていることを確認

### 6.2 インタラクション
- キーボード操作でフォーカスできることを確認
- キーボードでクリックイベントを発火できることを確認

## テスト実装の優先順位

1. 基本機能テスト（1.1, 1.2）
2. クリックイベントテスト（3.1）
3. 状態管理テスト（4.1, 4.2）
4. スタイルテスト（5.1）
5. アクセシビリティテスト（6.1）


## テストデータ

### サンプルProps
```typescript
{
  id: 13,
  name: "東京都"
}
```

### 期待される背景色
- 非選択時: rgb(229, 231, 235)
- 選択時: #BA55D3（東京都の場合）