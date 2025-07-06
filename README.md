# YouTube Short Playlists

キーワードに基づいてYouTube Shortのプレイリストを作成・再生できるWebアプリケーションです。

## 機能

- キーワード検索によるYouTube Shortの検索
- プレイリスト作成・再生機能
- 動画の切り替え機能（前へ/次へ）
- レスポンシブデザイン（yamada-ui使用）

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. YouTube Data API v3のAPIキーを取得:
   - [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
   - YouTube Data API v3を有効化
   - APIキーを作成

3. 環境変数の設定:
`.env.local`ファイルを作成し、以下を追加:
```
YOUTUBE_API_KEY=your_youtube_api_key_here
```

4. 開発サーバーの起動:
```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)でアクセス可能です。

## 技術スタック

- Next.js 15 (App Router)
- TypeScript
- yamada-ui
- YouTube Data API v3

## Vercelデプロイ

1. [Vercel](https://vercel.com)にプロジェクトをインポート
2. 環境変数 `YOUTUBE_API_KEY` を設定
3. デプロイ実行

## 使い方

1. キーワード入力フィールドに検索したいキーワードを入力
2. 「検索」ボタンをクリック
3. 検索結果の動画が表示され、プレイリストが作成される
4. 動画プレイヤーで再生し、「前へ」「次へ」ボタンで動画を切り替え
5. プレイリスト一覧から直接動画をクリックして選択可能
