# Nagomi Hub — データモデル

## ER図

```
auth.users (Supabase管理)
  │ 1:1
  ▼
profiles ──────────┬──────────┬──────────┬──────────┐
  │ 1:1            │ 1:N      │ 1:N      │ 1:N      │
  ▼                ▼          ▼          ▼          │
user_settings  pomodoro_   user_      user_        │
               sessions    achievements spirits     │
                              │                     │
                              │ N:1                 │ N:1
                              ▼                     ▼
                           achievements           spirits
                           (マスター)             (マスター)
```

## テーブル定義

### profiles

| カラム       | 型                       | 説明         |
| ------------ | ------------------------ | ------------ |
| id           | UUID (PK, FK→auth.users) | ユーザーID   |
| display_name | TEXT                     | 表示名       |
| avatar_url   | TEXT                     | アバターURL  |
| level        | INTEGER (default: 1)     | 現在のレベル |
| total_xp     | INTEGER (default: 0)     | 累計XP       |
| created_at   | TIMESTAMPTZ              | 作成日時     |
| updated_at   | TIMESTAMPTZ              | 更新日時     |

### user_settings

| カラム                              | 型                           | 説明                     |
| ----------------------------------- | ---------------------------- | ------------------------ |
| id                                  | UUID (PK)                    |                          |
| user_id                             | UUID (FK→profiles, UNIQUE)   | ユーザーID               |
| theme                               | TEXT (default: 'light')      | テーマ名                 |
| bgm_volume                          | INTEGER (0-100, default: 60) | BGM音量                  |
| master_volume                       | INTEGER (0-100, default: 70) | マスター音量             |
| ambient_rain                        | INTEGER (0-100, default: 50) | 雨音の音量               |
| ambient_forest                      | INTEGER (0-100, default: 30) | 森の音量                 |
| ambient_ocean                       | INTEGER (0-100, default: 40) | 海の音量                 |
| ambient_fire                        | INTEGER (0-100, default: 35) | 焚き火の音量             |
| pomodoro_work_minutes               | INTEGER (default: 25)        | 作業時間                 |
| pomodoro_break_minutes              | INTEGER (default: 5)         | 休憩時間                 |
| pomodoro_long_break_minutes         | INTEGER (default: 15)        | 長休憩                   |
| pomodoro_sessions_before_long_break | INTEGER (default: 4)         | 長休憩までのセッション数 |
| created_at / updated_at             | TIMESTAMPTZ                  |                          |

### pomodoro_sessions

| カラム            | 型                                         | 説明                   |
| ----------------- | ------------------------------------------ | ---------------------- |
| id                | UUID (PK)                                  |                        |
| user_id           | UUID (FK→profiles)                         | ユーザーID             |
| session_type      | ENUM ('work', 'short_break', 'long_break') | セッション種別         |
| status            | ENUM ('active', 'completed', 'cancelled')  | ステータス             |
| duration_minutes  | INTEGER (default: 25)                      | 設定時間               |
| started_at        | TIMESTAMPTZ                                | 開始時刻               |
| ended_at          | TIMESTAMPTZ                                | 終了時刻               |
| server_started_at | TIMESTAMPTZ                                | サーバー記録の開始時刻 |
| xp_earned         | INTEGER (default: 0)                       | 獲得XP                 |
| created_at        | TIMESTAMPTZ                                |                        |

### achievements (マスターデータ)

| カラム          | 型        | 説明           |
| --------------- | --------- | -------------- |
| id              | TEXT (PK) | 実績ID         |
| title           | TEXT      | タイトル       |
| description     | TEXT      | 説明           |
| icon            | TEXT      | 絵文字アイコン |
| category        | TEXT      | カテゴリ       |
| condition_type  | TEXT      | 達成条件の種類 |
| condition_value | INTEGER   | 達成条件の値   |
| xp_reward       | INTEGER   | XP報酬         |

### user_achievements

| カラム                          | 型                       | 説明             |
| ------------------------------- | ------------------------ | ---------------- |
| id                              | UUID (PK)                |                  |
| user_id                         | UUID (FK→profiles)       | ユーザーID       |
| achievement_id                  | TEXT (FK→achievements)   | 実績ID           |
| progress                        | INTEGER (default: 0)     | 現在の進捗       |
| unlocked                        | BOOLEAN (default: false) | アンロック済みか |
| unlocked_at                     | TIMESTAMPTZ              | アンロック日時   |
| UNIQUE(user_id, achievement_id) |                          |                  |

### spirits (マスターデータ — M3用)

| カラム           | 型                                               | 説明              |
| ---------------- | ------------------------------------------------ | ----------------- |
| id               | TEXT (PK)                                        | 精霊ID            |
| name             | TEXT                                             | 名前              |
| description      | TEXT                                             | 説明              |
| rarity           | TEXT ('common', 'uncommon', 'rare', 'legendary') | レアリティ        |
| sprite_url       | TEXT                                             | スプライト画像URL |
| appear_condition | JSONB                                            | 出現条件          |

### user_spirits (M3用)

| カラム                     | 型                       | 説明       |
| -------------------------- | ------------------------ | ---------- |
| id                         | UUID (PK)                |            |
| user_id                    | UUID (FK→profiles)       | ユーザーID |
| spirit_id                  | TEXT (FK→spirits)        | 精霊ID     |
| obtained_at                | TIMESTAMPTZ              | 取得日時   |
| is_favorite                | BOOLEAN (default: false) | お気に入り |
| UNIQUE(user_id, spirit_id) |                          |            |

## RLSポリシー

全テーブルでRLS有効。基本ルール:

- **profiles / user_settings / pomodoro_sessions / user_achievements / user_spirits**: 自分のデータのみ SELECT / INSERT / UPDATE 可能 (`auth.uid() = user_id`)
- **achievements / spirits (マスターデータ)**: 全ユーザー SELECT 可能
