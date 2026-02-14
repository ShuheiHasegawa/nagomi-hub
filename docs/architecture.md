# Nagomi Hub — システムアーキテクチャ

## 概要

Steam『Spirit City: Lofi Sessions』風の没入型作業用BGM & タスク管理Webサービス。

## 技術スタック

| レイヤー       | 技術                                                       |
| -------------- | ---------------------------------------------------------- |
| フロントエンド | Next.js 15 (App Router) / TypeScript / Tailwind CSS        |
| アニメーション | Framer Motion / Canvas 2D / React Three Fiber (遅延ロード) |
| 音声           | Web Audio API (AudioContext + GainNode構成)                |
| タイマー       | Web Worker + サーバーサイドタイムスタンプ                  |
| 認証           | Supabase Auth (Email + OAuth Google/GitHub)                |
| データベース   | Supabase (PostgreSQL)                                      |
| ホスティング   | Vercel                                                     |
| CI/CD          | GitHub Actions                                             |

## アーキテクチャ図

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Next.js  │  │Web Worker│  │ Web Audio API │  │
│  │ App      │◄─┤ (Timer)  │  │ (BGM+環境音)  │  │
│  │ Router   │  └──────────┘  └───────────────┘  │
│  │          │                                    │
│  │ ┌──────────────────────────────────────────┐  │
│  │ │ React Components                         │  │
│  │ │ ├─ Game (Timer, Character, Sound)       │  │
│  │ │ ├─ Settings (Music, Customize, Account) │  │
│  │ │ ├─ Achievements                         │  │
│  │ │ ├─ Effects (Canvas2D, ThemeBackground)  │  │
│  │ │ └─ Providers (Theme, Auth)              │  │
│  │ └──────────────────────────────────────────┘  │
│  └──────────┬───────────────────────────────────┘│
│             │ Supabase Client (SSR + Browser)    │
└─────────────┼───────────────────────────────────┘
              │ HTTPS
┌─────────────▼───────────────────────────────────┐
│            Supabase                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │   Auth   │  │ Database │  │   Storage     │   │
│  │ (Email/  │  │ (Postgres│  │ (音声/画像    │   │
│  │  OAuth)  │  │  + RLS)  │  │  アセット)    │   │
│  └──────────┘  └──────────┘  └──────────────┘   │
└──────────────────────────────────────────────────┘
```

## ディレクトリ構成

```
nagomi-hub/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # ルートレイアウト (Theme + Auth Provider)
│   ├── page.tsx            # ランディング
│   ├── game/               # メインゲーム画面
│   ├── settings/           # 設定画面
│   ├── achievements/       # 実績画面
│   └── auth/               # 認証 (login, signup, callback)
├── components/
│   ├── game/               # ゲーム系コンポーネント
│   ├── effects/            # ビジュアルエフェクト
│   ├── settings/           # 設定系コンポーネント
│   ├── achievements/       # 実績系コンポーネント
│   ├── providers/          # コンテキストプロバイダー
│   └── ui/                 # 共通UIコンポーネント
├── lib/
│   ├── supabase/           # Supabaseクライアント (client, server, middleware, auth)
│   └── themes.ts           # テーマ定義
├── supabase/
│   ├── config.toml         # Supabase設定
│   └── migrations/         # DBマイグレーション
├── docs/                   # 設計ドキュメント
└── .github/workflows/      # CI/CD
```

## 認証フロー

```
[User] → /auth/login or /auth/signup
  ↓ Email/Password or OAuth
[Supabase Auth] → JWT発行
  ↓
[middleware.ts] → セッション管理 (Cookie)
  ↓
[AuthProvider] → React Context で認証状態共有
  ↓
[RLS] → DBアクセスはユーザーごとに制限
```

## 音声アーキテクチャ (M1で実装)

```
AudioContext (Singleton)
  ├── BGM Channel
  │   └── BufferSource → GainNode(個別) ─┐
  ├── Rain Channel                        │
  │   └── BufferSource → GainNode(個別) ─┤
  ├── Forest Channel                      ├→ GainNode(Master) → Destination
  │   └── BufferSource → GainNode(個別) ─┤
  ├── Ocean Channel                       │
  │   └── BufferSource → GainNode(個別) ─┤
  └── Fire Channel                        │
      └── BufferSource → GainNode(個別) ─┘
```

## タイマーアーキテクチャ (M1で実装)

```
[Web Worker]                    [Main Thread]
  │ setInterval(1s)                 │
  │ ──── postMessage(tick) ──────►  │ UI更新
  │                                 │
  │                            [Supabase]
  │                                 │ セッション記録
  │                                 │ (開始時刻/終了時刻)
  │ ◄── postMessage(sync) ────  │
  │ サーバー時刻と補正              │
```
