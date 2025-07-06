# CLAUDE.md

このファイルは、このリポジトリのコードを扱う際のClaude Code (claude.ai/code)向けのガイダンスを提供します。

## 一般的なコマンド

### 開発
- `npm run dev` - Turbopackを使用した開発サーバーの起動
- `npm run build` - 本番用バンドルのビルド
- `npm run start` - 本番サーバーの起動
- `npm run lint` - ESLintの実行

### ビルドとデプロイ
- TypeScriptコンパイルが通ることを確認するため、変更をコミットする前に必ず`npm run build`を実行してください
- アプリは`vercel.json`でVercelデプロイ用に設定されています

## アーキテクチャの概要

これはApp Routerを使用したNext.js 15アプリケーションで、キーワード検索に基づいてYouTube Shortプレイリストを作成します。

### 主要コンポーネント構造
- **フロントエンド**: yamada-uiコンポーネントを使用したシングルページアプリケーション（`src/app/page.tsx`）
- **APIレイヤー**: YouTube Data API v3とのインターフェースを提供する`/api/search`エンドポイント
- **状態管理**: ローカル状態（検索結果、現在の動画、読み込み状態）用のReactフック

### コアアーキテクチャパターン

#### YouTube API統合
- `src/app/api/search/route.ts`のAPIルートがYouTube Data API v3リクエストを処理
- 短時間動画（`videoDuration=short`）を特定して検索
- id、タイトル、サムネイル、URLを含む構造化された動画データを返す

#### UIコンポーネント構造
- 一貫したスタイリングとレスポンシブデザインのためにyamada-uiを使用
- テーマコンテキスト用の`UIProvider`でメインレイアウトをラップ
- 動画プレイヤーはプレイリストナビゲーション付きの埋め込みYouTube iframeを使用
- サムネイルグリッドで直接動画選択が可能

#### データフロー
1. ユーザーがキーワードを入力 → `searchVideos()`関数
2. フロントエンドが`/api/search?q={keyword}`を呼び出し
3. APIルートがYouTube Data API v3から取得
4. 結果がローカル状態に保存され、プレイリストとして表示
5. ユーザーは前へ/次へボタンやサムネイル選択で動画をナビゲート

## 環境設定

### 必要な環境変数
- `YOUTUBE_API_KEY` - YouTube Data API v3キー（動画検索に必要）

### ローカル開発セットアップ
1. YouTube APIキーを含む`.env.local`を作成
2. 依存関係をインストール: `npm install`
3. 開発サーバーを起動: `npm run dev`

### デプロイ（Vercel）
- 環境変数`YOUTUBE_API_KEY`をVercelダッシュボードで設定する必要があります
- VercelのNext.js自動検出とデプロイを使用

## UIフレームワークの注意事項

### yamada-uiの使用
- 標準的なコンポーネントライブラリの代わりに使用するプライマリUIライブラリ
- レイアウトコンポーネントには`spacing`の代わりに`gap`プロパティを使用
- `UIProvider`が`layout.tsx`でアプリ全体をラップ
- 一般的なコンポーネント: `VStack`、`HStack`、`Box`、`Container`、`Card`、`Button`、`Input`

### スタイリングアプローチ
- yamada-uiはレスポンシブブレークポイントを持つデザインシステムを提供
- レスポンシブグリッドには`columns={{ base: 1, md: 2, lg: 3 }}`パターンを使用
- Tailwind CSSは設定されていますが、主にグローバルスタイルに使用

## API設計

### YouTube検索エンドポイント
- **ルート**: `GET /api/search`
- **クエリパラメータ**: `q`（検索キーワード、必須）
- **レスポンス**: `{ videos: Array<{ id, title, thumbnail, url }> }`
- **エラーハンドリング**: APIキーの欠如、無効なクエリ、API障害に対する構造化されたエラーレスポンスを返す

### 動画データ構造
```typescript
interface VideoData {
  id: string;        // YouTube動画ID
  title: string;     // 動画タイトル
  thumbnail: string; // 中サイズサムネイルURL
  url: string;       // 完全なYouTube URL
}
```

## 開発の注意事項

### TypeScript設定
- 適切なインターフェース定義による厳密な型付けを有効化
- Next.jsルールでESLintを設定
- サムネイル画像用の`@next/next/no-img-element`を無効化するカスタムESLintルール

### 状態管理パターン
- `useState`フックを使用したローカルReact状態
- 主要な状態: `videos`、`currentVideoIndex`、`loading`、`error`、`keyword`
- このスコープでは外部状態管理ライブラリは不要
