# Nagomi Hub

リラックス放置ゲーム『Spirit City: Lofi Sessions』風の放置系癒やしゲームをWeb1ページで実現するサービス。

## 技術スタック

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** - アニメーション
- **Google Fonts** (Quicksand, Noto Sans JP)

## 機能

### 実装済み（モック画面）

- ✅ メインゲーム画面
  - キャラクター表示（呼吸アニメーション）
  - ポモドーロタイマー
  - 進捗バー（XP、レベル、統計）
  - 環境音コントロール
- ✅ 設定画面
  - 音楽設定（BGM音量、プレイリスト）
  - カスタマイズ（背景、キャラクター、テーマカラー）
  - アカウント設定
- ✅ 実績画面
  - 実績一覧表示
  - 進捗表示
  - 解除状態の可視化
- ✅ 認証画面
  - ログイン
  - サインアップ
  - ソーシャルログイン（UIのみ）

## デザインコンセプト

**Organic/Natural × Soft/Pastel**

- 自然の癒やしをテーマにした柔らかい色彩
- グラスモーフィズムUI
- 滑らかなアニメーション
- レスポンシブデザイン

## 開発

### セットアップ

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

### ビルド

```bash
npm run build
```

### 本番起動

```bash
npm start
```

## プロジェクト構成

```
nagomi-hub/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証関連ページ
│   │   ├── login/        # ログイン
│   │   └── signup/       # サインアップ
│   ├── game/             # ゲームメインページ
│   ├── settings/         # 設定画面
│   ├── achievements/     # 実績画面
│   ├── layout.tsx        # ルートレイアウト
│   ├── page.tsx          # ホームページ
│   └── globals.css       # グローバルスタイル
├── components/
│   ├── game/             # ゲーム固有コンポーネント
│   │   ├── Character.tsx
│   │   ├── Timer.tsx
│   │   ├── ProgressBar.tsx
│   │   └── AmbientSound.tsx
│   ├── settings/         # 設定コンポーネント
│   │   ├── MusicSettings.tsx
│   │   ├── CustomizationSettings.tsx
│   │   └── AccountSettings.tsx
│   └── achievements/     # 実績コンポーネント
│       └── AchievementCard.tsx
└── public/              # 静的ファイル
```

## 次のステップ

- [ ] Supabase統合（認証、データベース）
- [ ] 実際の音楽/BGM再生機能
- [ ] キャラクターアニメーションの実装
- [ ] 進捗管理システムの実装
- [ ] 実績システムの実装

## ライセンス

MIT
