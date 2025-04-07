# 都道府県人口グラフビューワー

都道府県ごとの人口推移データをグラフやテーブルで可視化するWebアプリケーションです。

## 機能

- 都道府県の選択（単一/複数）
- 人口推移のグラフ表示
- データのテーブル表示
- レスポンシブ対応（デスクトップ/モバイル）
- エラーハンドリング

## 技術スタック

- [Nuxt.js](https://nuxt.com/) 3.16.1 - Vue.jsフレームワーク
- [Vue.js](https://vuejs.org/) 3.5.13 - UIフレームワーク
- [Pinia](https://pinia.vuejs.org/) - 状態管理
- [Highcharts](https://www.highcharts.com/) - グラフ表示
- [TailwindCSS](https://tailwindcss.com/) - スタイリング

## 必要要件

- Node.js 18以上
- pnpm 10以上

## セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動（localhost:3000）
pnpm dev

# プロダクションビルド
pnpm build

```

## 環境変数

`.env.example`を`.env`にコピーして、必要な環境変数を設定してください。

## テスト

```bash
# ユニットテストの実行
pnpm test

# カバレッジレポートの生成
pnpm test:coverage
```

## プロジェクト構造

```
├── assets/          # 静的アセット（CSS、画像）
├── components/      # Vueコンポーネント
├── pages/          # ページコンポーネント
├── plugins/        # Nuxtプラグイン
├── server/         # サーバーサイドコード
├── stores/         # Piniaストア
├── types/          # TypeScript型定義
└── utils/          # ユーティリティ関数
```

## 主要コンポーネント

- `appHeader.vue` - アプリケーションヘッダー
- `prefChart.vue` - 人口推移グラフ
- `prefTable.vue` - データテーブル
- `prefSideBar.vue` - 都道府県選択サイドバー
- `legendButton.vue` - グラフ凡例ボタン

## テスト構成

- Vitest - ユニットテスト
- Playwright - E2Eテスト
  - 初期表示テスト
  - 都道府県選択テスト
  - データ表示テスト
  - レスポンシブ対応テスト
  - エラーハンドリングテスト
  - パフォーマンステスト
