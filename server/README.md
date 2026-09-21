# push server

「ふりかえり伴走」アプリの毎日リマインダー通知(Web Push)を配信するための、小さな常駐サーバーです。
スマホでアプリを開いていなくても、設定した時刻に「ふりかえりの時間です」という通知を届けます。

## 仕組み

- ブラウザの [Push API](https://developer.mozilla.org/ja/docs/Web/API/Push_API) を使い、フロントエンドが取得した購読情報(`PushSubscription`)をこのサーバーに登録します
- `node-cron` が毎分起動し、設定時刻と一致した購読者にだけ [web-push](https://github.com/web-push-libs/web-push) で通知を送信します
- データは `db.json`(JSONファイル)に保存する、個人利用向けの最小構成です。認証やマルチユーザー対応はありません

## セットアップ

```bash
npm install
npm run generate-vapid-keys   # VAPID鍵ペアを生成
cp .env.example .env          # 生成された鍵とALLOWED_ORIGINを.envに設定
npm start
```

`.env` に設定する項目:

| 変数 | 説明 |
| --- | --- |
| `PORT` | サーバーのポート(既定: 3001) |
| `ALLOWED_ORIGIN` | フロントエンドをデプロイしたオリジン(CORS許可) |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | `npm run generate-vapid-keys` で生成 |
| `VAPID_SUBJECT` | `mailto:you@example.com` 形式の連絡先 |

`VITE_VAPID_PUBLIC_KEY`(フロントエンド用)には同じ公開鍵を設定してください。

## デプロイについて

このサーバーは `node-cron` で常時ポーリングするため、**常駐プロセスとして動くホスティング**が必要です(Vercel/Netlifyのようなサーバーレス関数は毎分起動する仕組みを別途用意しない限り不向きです)。

- Railway / Render / Fly.io の無料〜低価格プラン
- 自前のVPS + `pm2` や `systemd`

いずれも `npm install && npm start` で起動でき、環境変数に上記の値を設定するだけで動きます。

## API

| メソッド | パス | 説明 |
| --- | --- | --- |
| GET | `/api/health` | ヘルスチェック |
| GET | `/api/vapid-public-key` | フロントエンドが購読時に使う公開鍵を取得 |
| GET | `/api/settings` | 現在のリマインダー時刻・タイムゾーン・購読数を取得 |
| PUT | `/api/settings` | リマインダー時刻・タイムゾーンを更新 |
| POST | `/api/subscribe` | `PushSubscription` を登録(端末ごと) |
| DELETE | `/api/subscribe` | `endpoint` を指定して購読解除 |

## 制約・注意点

- **iOS Safari**: iOS 16.4以降のみWeb Pushに対応し、かつ**アプリをホーム画面に追加(PWAとしてインストール)した状態でないと通知を受け取れません**。Safariのタブを開いているだけでは動作しません
- サーバーが停止している間は通知が送られません。24時間稼働するホスティング先を選んでください
- 複数端末(スマホ+PCなど)で購読すると、それぞれの端末に同じ時刻で通知が届きます(現状はリマインダー時刻は全端末共通の設定です)
