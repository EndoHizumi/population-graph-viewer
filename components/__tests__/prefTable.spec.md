# PrefTable コンポーネントテスト仕様書

## コンポーネントの概要
PrefTableは都道府県の人口データをテーブル形式で表示するコンポーネントです。都道府県ごとに列を作成し、年ごとの人口データを行として表示します。また、データ読み込み中やデータ未選択時の状態も適切に表示します。

## テスト項目

### 1. コンポーネントの初期表示

#### 1.1 未選択時の表示
- [ ] 都道府県が選択されていない場合、「都道府県を選択してください」というメッセージが表示されること
- [ ] メッセージが中央揃えで表示されること
- [ ] テーブルが表示されていないこと

#### 1.2 ローディング時の表示
- [ ] ローディング中はテーブルが表示されていないこと

### 2. テーブル機能

#### 2.1 テーブルヘッダー
- [ ] 1列目のヘッダーに「年号」と表示されること
- [ ] 選択された都道府県名が正しい順序で表示されること
- [ ] 都道府県名が都道府県コードから正しく取得されること
- [ ] ヘッダーのスタイル（境界線、中央揃えなど）が適切に適用されること

#### 2.2 テーブルボディ
- [ ] 年号が正しい順序で表示されること
- [ ] 各都道府県の人口データが正しいセルに表示されること
- [ ] 数値が右揃えで表示されること
- [ ] セルのスタイル（境界線など）が適切に適用されること

### 3. データ更新

#### 3.1 都道府県選択時の更新
- [ ] 新しい都道府県が選択された時、テーブルに新しい列が追加されること
- [ ] 都道府県の選択順序が保持されること
- [ ] データが正しい列に表示されること

#### 3.2 都道府県解除時の更新
- [ ] 都道府県が解除された時、対応する列が削除されること
- [ ] 残りの列のデータが正しく表示されること
- [ ] すべての都道府県が解除された時、未選択時のメッセージが表示されること

### 4. タブ切り替え

#### 4.1 人口区分タブの切り替え
- [ ] currentTabの値に応じて正しい人口区分のデータが表示されること
- [ ] タブ切り替え時にテーブルのデータが更新されること
- [ ] データの更新がスムーズに行われること

## テスト環境

### 必要なモック
- [ ] usePrefectureStore
  - selectedPrefectures
  - prefecturesList
  - yearList
  - populationData
  - isLoading
  - currentTab

### テストデータ
- [ ] 複数都道府県の人口データ
- [ ] 都道府県コードと名称のマッピング
- [ ] 各人口区分（総人口、年少人口、生産年齢人口、老年人口）のデータ
- [ ] 年号のリスト

## 特記事項
- データの表示形式（数値のフォーマット）の一貫性を確認すること
- レスポンシブ対応の確認（テーブルの横スクロールなど）
- パフォーマンスの確認（大量のデータ表示時の挙動）