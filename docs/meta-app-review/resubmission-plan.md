# DECA Ad Meta App Review 再提出プラン（4権限）

App ID: 1536677700794916 ｜ 作成 2026-09-29
参照元: 「DECA Ad Meta App Review 進捗記録」「Meta App review 提出用」（Google Drive）

> 動画ファイル本体（.mp4）はDrive上で見つからなかったため、進捗記録の構成表・判定記述をもとに評価している。
> 「要目視確認」とした項目は、実ファイルを再生して確認すること。

---

## 1. 結論

- 対象は `pages_show_list` / `pages_read_engagement` / `ads_read` / `ads_management` の4権限。
- 既存3本のうち、提出に使える可能性があるのは `ads_combined_review.mp4`（ads_read用）の1本だけ。これも下記の不備を直してから出す。
- 残り2本（`ads_read_review.mp4` / `pages_show_list_review.mp4`）はどの権限にもそのままでは出せない。
- 撮影は**1回のマスター収録 → 権限別に3本へ切り出し**が最も効率的。ただし各ブロッカーの解消が前提。

---

## 2. 既存3本 × 4権限の適合マトリクス

凡例: ◎ そのまま使える / ○ 修正すれば使える / △ 一部素材としてのみ使える / × 使えない

| 動画 | pages_show_list | pages_read_engagement | ads_read | ads_management |
| :- | :-: | :-: | :-: | :-: |
| ads_combined_review.mp4（2:30） | × | × | ○ | △（冒頭OAuthのみ） |
| ads_read_review.mp4（1:38） | × | × | △（素材のみ） | × |
| pages_show_list_review.mp4（0:53） | △（OAuth部分のみ） | △（OAuth部分のみ） | × | × |

### 2-1. ads_combined_review.mp4 → ads_read 用（要修正）

**使える部分**
- OAuthログイン → 権限許可 → Sync Job作成 → Ad Set取得 → Ads Managerで照合、という end-to-end がそろっている。Meta要件1〜3は満たす。

**残っている不備**

| # | 不備 | 重要度 | 対応 |
| :- | :- | :-: | :- |
| A1 | Facebookの同意画面が日本語（0:33–0:38）。字幕で翻訳しているが、要件4の「英語UI」を正面から満たしていない | 高 | Facebookの表示言語を English (US) にしてOAuth部分（0:00–0:52）を撮り直す。所要30分程度 |
| A2 | 申請文面とSync Jobの実態が矛盾する可能性。ads_readの文面では「選んだAd Setが audience data を受け取る」と書く一方、ads_managementの文面では「Ad Setは編集しない」と書いている。AudienceをAd Setに適用するにはAd Setのtargetingを更新する必要があり、両立しない | 高 | 開発チームに「Ad Set選択後、DECA Adは実際に何をするか」を確認し、文面を実装に合わせる（2-4参照） |
| A3 | 録画は9/16の作業時と思われ、Publishしたジョブが `Inactive`、別ジョブが `System Error` のまま。画面に映っていれば「機能が動かない」という証拠になる | 中 | 0:52以降でSync Job一覧のStatus列が映っていないか要目視確認。映っていればカット、または撮り直し |
| A4 | 実クライアント（ABCライフィズ）の広告アカウント名・Ad Set名が映っている | 中 | 社内テスト用の広告アカウントで撮り直すのが理想。難しければ、クライアント名が特定できる箇所にぼかしを入れる |
| A5 | 冒頭に対象権限名のタイトルカードがない | 低 | 冒頭2〜3秒に `Permission: ads_read` を表示 |
| A6 | 文面には3つの利用シーン（Sync Job作成／ステータス監視／Publish前検証）があるが、動画は「作成時のAd Set選択」しか示していない | 低 | 文面を「Ad Set選択」の1シーンに絞る。3つ残すなら残り2シーンも映す |
| A7 | Ad SetのID・status が画面に出ているか不明（文面では id, name, status を取得と記載） | 低 | 要目視確認。名前だけなら文面の fields を `id, name` に合わせる |

### 2-2. ads_read_review.mp4 → 単体では使えない

- ログインと権限許可の場面がなく、要件1・2を満たさない。
- 中身は ads_combined_review.mp4 の0:52以降と同じなので、素材としても不要。**廃棄してよい**。

### 2-3. pages_show_list_review.mp4 → 使えない（Page系2権限の撮り直し必須）

| # | 不備 | 対応 |
| :- | :- | :- |
| P1 | 字幕は「管理下のFacebook Pageを表示する」と説明しているが、画面に映るのは広告アカウントの一覧で、Page名は一度も出ない。4/2の却下理由（Screencast Not Aligned）そのもの | Page一覧が表示される状態を作ってから撮り直す |
| P2 | 同意画面でPage系権限を求めている表示が映っているか不明。ads_combinedの同意画面は ads_management + ads_read の2項目だけ | DECA AdのOAuthリクエスト（scope、またはFacebook Login for Businessのconfiguration）に `pages_show_list,pages_read_engagement` が入っているか開発チームに確認 |
| P3 | Pageを選ぶ画面（"Choose the Pages you want DECA Ad to access"）がない。ポートフォリオを外した状態で撮ったため、この画面を通らなかった可能性が高い | ブロッカー②を解消した上で、Page選択画面を通るOAuthを撮る |
| P4 | pages_read_engagement 固有の用途が映っていない（2-4参照） | Page一覧とは別に、Page詳細情報を表示する場面を用意する |

**流用できるのは冒頭の「Connections → Add Connection → Meta Ads選択」の操作手順だけ**で、これは撮り直しの台本に組み込めば足りる。

### 2-4. 申請文面側の論点（動画より先に確認が必要）

1. **pages_read_engagement の用途が pages_show_list と重複している**
   - `GET /me/accounts`（id, name）は pages_show_list だけで取得できる。文面の「/me/accounts を呼ぶために pages_read_engagement が必要」は不正確で、審査員から「不要な権限」と見られるリスクがある。
   - ads_management の依存関係で外せないなら、pages_read_engagement で読むデータを画面に出す必要がある。案: 選択したPageの詳細を `GET /{page-id}?fields=name,picture,category,link` で取得し、「広告主体として使うPageの確認カード」として表示する（どの fields に pages_read_engagement が必要か、開発側で Graph API Explorer を使って確認すること）。
   - DECA Ad に該当画面がなければ、撮影の前に実装が必要。
2. **Ad Set選択の意味（A2）**
   - Ad SetにAudienceを適用しているなら、Ad Setのtargetingを更新しているので、ads_management の文面から「Ad Setは編集しない」を削り、「選択したAd Setのaudience設定のみ更新する」と正直に書く。
   - 適用していないなら、Ad Setを選ぶ意味を説明できない。ads_readの用途が「無効」と判断された前回の却下を繰り返すおそれがある。
3. **DECA Ad本体の機能と文面のずれ**
   - 機能ガイド（2026/08）では、Meta Ads を含むパフォーマンスダッシュボード・レポート・日予算の自動配分がDECA Adの中核機能になっている。一方、申請文面は「パフォーマンス指標は取得しない」「予算は変更しない」としている。
   - もしこれらの機能がこのApp IDのトークンでMeta APIを呼んでいるなら、文面が実態と合っておらず、審査員がログインして画面を見れば発覚する。**どのApp IDで動いているかを開発チームに確認**する。同じApp IDなら、用途を狭く書くのをやめて実態どおりに申請する方が通りやすい（ダッシュボード用途のads_readは正規のユースケース）。
4. **サーバー間処理の明記（要件5）**
   - 差分同期（日次・週次）とオプトアウト処理（毎日10:00 JST）はユーザー操作なしにサーバー側で動く。どのトークン（Facebook Loginで得た長期ユーザートークン／System Userトークン）を使うかを開発チームに確認し、ads_management の文面とReviewer instructionsに1文で明記する。

---

## 3. ブロッカー別の追加仮説と確認手順

進捗記録で潰し済みの仮説に加えて、次の確認を推奨する。

### ブロッカー①：`GET /me/accounts` が空

**追加仮説: 権限は付いているが、どのPageにもアクセスを許可していない**
Facebook Login for Business ではPageごとに許可を選ぶ（granular permission）。`/me/permissions` で granted と出ても、Page選択画面でPageを選んでいなければ `/me/accounts` は空になる。ブロッカー②で「Page許可選択画面に進めない」ことと整合する。

確認手順:
1. Graph API Explorer の Application が「DECA Ad（1536677700794916）」になっているか確認（既定の "Graph API Explorer" アプリになっていないか）
2. 取得したトークンで `GET /debug_token?input_token={token}` を実行
3. `granular_scopes` の `pages_show_list` に `target_ids` があるか確認
   - `target_ids` が空、または項目がない → Pageが選ばれていない。Facebook「設定 → ビジネス統合 → DECA Ad → 編集」でPageを選び直すか、統合を削除してOAuthをやり直す
   - `target_ids` にPage IDがあるのに空 → 進捗記録の「Partial access」仮説の検証へ（小池さんへのFull control依頼を継続）

### ブロッカー②：ポートフォリオ紐付け時にOAuthが進まない

進捗記録の③案（紐付けを外して再接続 → 直後に `/me/accounts`）に、上の `debug_token` 確認を加える。
順番: 紐付け解除 → 再接続 → DECA AdでOAuth（Page選択画面が出るか） → `debug_token` → `/me/accounts`。

### ブロッカー③：Custom Audience が生成されない

開発チームのSystem Error調査で、次の点を最初に確認する。
- **広告アカウントのCustom Audience利用規約に同意済みか**（`https://business.facebook.com/ads/manage/customaudiences/tos/?act={ad_account_id}`）。未同意だと `POST /{ad_account_id}/customaudiences` はエラーになる。
- OAuthしたユーザーが、その広告アカウントで広告を管理できる権限を持っているか。
- 9/16のジョブは Last Sync が「－（未実行）」なので、APIエラーより前に、Publish後のジョブ起動自体が失敗している可能性がある。ジョブのキュー・スケジューラのログを確認する。
- テストには社内のテスト広告アカウントを使う（実クライアントのアカウントにテスト用Audienceを作らない）。

---

## 4. ネクストアクション（優先順）

| # | アクション | 担当 | 依存 | 完了条件 |
| :-: | :- | :- | :- | :- |
| 1 | 2-4の論点1〜4を開発チームに確認（Ad Set選択の実処理、Page詳細画面の有無、ダッシュボードのApp ID、サーバー側トークン） | 吉楽 → 開発 | なし | 回答がそろい、文面の修正方針が決まる |
| 2 | ads_read の文面を#1の回答に合わせて修正（A2・A6・A7） | 吉楽 | #1 | 文面と動画が1対1で対応する |
| 3 | ads_read 用のOAuth部分を英語UIで撮り直し、A3〜A5を修正して ads_read を先行提出 | 吉楽 | #2 | 提出完了 |
| 4 | `debug_token` で granular_scopes を確認（ブロッカー①） | 吉楽 | なし | Page未選択かPartial accessか切り分けられる |
| 5 | ポートフォリオ紐付けを外して再接続し、Page選択画面を通るOAuthを成功させる（ブロッカー②） | 吉楽 | なし | `/me/accounts` がPageを返す |
| 6 | 社内テスト用Pageの Full control 付与 | 小池さん | なし | テスト用Pageが `/me/accounts` に出る |
| 7 | Page一覧＋Page詳細画面の実在確認、なければ実装 | 開発 | #1 | DECA Ad上でPage名・詳細が表示される |
| 8 | Sync JobのSystem Error解消（CA利用規約同意の確認を含む） | 開発 | なし | Ads ManagerのAudiencesにDECA Ad作成のCAが出る |
| 9 | マスター収録 → 3本に切り出し → 字幕付け | 吉楽 | #5〜#8 | 5章の3本が完成 |
| 10 | Page系2権限 + ads_management を1つのバンドルで提出 | 吉楽 | #9 | 提出完了 |

\#3（ads_read先行）は依存関係の外なので、#4〜#8を待たずに進める。
ただし#1のAd Set選択の確認は、ads_read の文面に直接影響するので先に済ませる。

---

## 5. 収録手順

### 5-1. 構成方針

1回のマスター収録を、権限別に3本へ切り出す。どの動画にも冒頭のログイン・権限許可を入れる（要件1・2）。

| 提出動画 | 使う権限 | 構成（マスターの区間） | 目安尺 |
| :- | :- | :- | :-: |
| Video 1: pages_review.mp4 | pages_show_list / pages_read_engagement（同じ動画を両方にアップ） | S0 → S1 → S2 → S3 | 1:30–2:00 |
| Video 2: ads_read_review.mp4 | ads_read | S0 → S1 → S4 → S5 | 1:30–2:30 |
| Video 3: ads_management_review.mp4 | ads_management | S0 → S1 → S4（短縮） → S6 → S7 | 2:00–3:00 |

ads_read を先行提出する場合（アクション#3）は、S0・S1・S4・S5だけを先に撮る。

### 5-2. 収録前チェックリスト

**環境**
- [ ] Facebookの表示言語を English (US) に変更（Settings → Language and region）
- [ ] DECA Adの表示言語を English に変更
- [ ] Facebook「設定 → ビジネス統合」から既存のDECA Ad連携を削除（同意画面を必ず初回表示させるため）
- [ ] DECA Ad側の既存Meta接続も削除
- [ ] ブラウザは拡張機能なし・ブックマークバー非表示のプロファイルを使う。ズームは100%
- [ ] 画面解像度 1920×1080 で録画。アドレスバーの `facebook.com/.../dialog/oauth` が読めることを試し撮りで確認
- [ ] 通知（Slack・メール・OS通知）をすべてオフ

**データ（すべて社内アセット。実クライアントは使わない）**
- [ ] 社内テスト用Facebook Page（撮影者がFull control）
- [ ] 社内テスト用広告アカウント（Custom Audience利用規約に同意済み）
- [ ] テスト用Ad Setを2〜3件（名前は `DECA Review Test - AdSet A` のように一目で分かるもの。配信は停止のままでよい）
- [ ] テスト用Customer List（ダミーのメールアドレス、数十〜100件程度）
- [ ] Ads Manager の Audiences にテスト前のCustom Audienceが残っていないこと（新規作成が分かるように）

**事前の動作確認（撮影当日の本番前に1回通す）**
- [ ] OAuthでPage選択画面が出て、テスト用Pageを選べる
- [ ] 連携後、DECA AdにPage一覧とPage詳細が表示される
- [ ] Sync JobをPublishすると Success になり、Ads ManagerにCAができる
- [ ] 確認で作った連携・CA・Sync Jobは削除してから本番を撮る

### 5-3. マスター収録台本

各場面の最後で2〜3秒静止する（字幕を入れる余白と、審査員が読む時間の確保）。マウスは対象をゆっくりなぞる。

| 区間 | 画面・操作 | 静止して見せるもの | 英語字幕（後付け） |
| :- | :- | :- | :- |
| S0 | DECA Adのログイン画面 → テスト用IDでログイン | アプリ名「DECA Ad」とURL | `DECA Ad is a B2B tool for advertising agencies. The operator signs in to DECA Ad.` |
| S1-1 | Connections → Add Connection → Meta Ads → DECA Adモーダルで Authorize Access | モーダルの許可内容の説明文 | `The operator starts connecting a Meta account with Facebook Login.` |
| S1-2 | Facebook Login（dialog/oauth） | アドレスバーの `facebook.com` と `dialog/oauth` | `Facebook Login dialog for DECA Ad (App ID 1536677700794916).` |
| S1-3 | ビジネスポートフォリオ・広告アカウントの選択 | 選んだテスト用広告アカウント | `The operator selects the ad account to share with DECA Ad.` |
| S1-4 | **Page選択画面**でテスト用Pageを選ぶ | 選んだPage名 | `The operator selects the Facebook Page to share with DECA Ad.` |
| S1-5 | **権限の同意画面**（英語） | 4権限すべての行が見える状態で3秒以上静止 | `The operator grants: pages_show_list, pages_read_engagement, ads_read, ads_management.` |
| S1-6 | DECA Adに戻り、Connectionsに Connected 表示 | Connected 表示 | `Authorization is complete and the operator returns to DECA Ad.` |
| S2 | **Page一覧画面**（`/me/accounts` の結果） | テスト用Page名。マウスでなぞる | `pages_show_list: DECA Ad lists the Facebook Pages the operator manages, so the operator can confirm the correct Meta account is connected.` |
| S3 | Pageを選び、**Page詳細**（名前・画像・カテゴリなど）を表示し、広告アカウントとの紐付けを確認 | pages_read_engagement で取得した項目 | `pages_read_engagement: DECA Ad reads the selected Page's details to confirm it is the advertiser identity paired with this ad account. DECA Ad does not read posts, comments or Page insights.` |
| S4 | Sync Jobs → Create → 広告アカウント選択 → **Ad Set選択欄を開く** | 取得されたAd Setの名前（・ID・status）の一覧 | `ads_read: DECA Ad retrieves the Ad Sets (ID, name, status) from the connected ad account so the operator can pick the right one.` |
| S5 | 別タブでAds Managerを開き、同じAd Set名を表示 | DECA Adと同じAd Set名 | `The same Ad Set names appear in Meta Ads Manager.` |
| S6 | DECA Adに戻り、Customer Listを選択 → **Publish** → Statusが **Success** になるまで表示 | Success と Last Sync 時刻 | `ads_management: on publish, DECA Ad creates a Custom Audience and uploads SHA-256 hashed emails. No plain-text personal data is sent.` |
| S7 | Ads Manager → **Audiences** を再読み込み → DECA Adが作ったCustom Audienceを表示（名前・作成日時・ソース） | 新しく作られたCAの行 | `The Custom Audience created by DECA Ad now appears in Meta Ads Manager.` |

**撮影時の注意**
- S1-5の同意画面は、4権限がすべて見えることが最重要。スクロールが必要なら、ゆっくりスクロールして全行を見せる。
- S1は一連の流れを止めずに撮る。途中で失敗したら、連携を削除して最初からやり直す（つなぎ合わせると審査員に疑われる）。
- S6でSuccessになるまで時間がかかる場合は、待ち時間をカットしてよい。ただし `(time skipped)` のような字幕を入れる。
- 画面にアクセストークン・メールアドレス・パスワードを映さない。映った場合は編集でぼかす。
- 字幕は後から付けるので、撮影中は操作に集中する。

### 5-4. 編集・書き出し

- [ ] 各動画の冒頭2〜3秒にタイトルカード（例: `DECA Ad – Permission: ads_read`）
- [ ] 字幕は英語。UIの意味と「この場面でどの権限を使っているか」を説明
- [ ] 各動画の最後に Scope clarification を1枚入れる（例: `DECA Ad does not retrieve ad performance metrics and does not create or edit campaigns or ad creatives.` 2-4の確認結果に合わせて文言を直す）
- [ ] 実クライアント名・個人情報・トークンが映っていないか全編を見直す
- [ ] MP4（H.264）、1080p で書き出し。音声なしでよい
- [ ] 字幕の主張と画面の内容が1対1で対応しているか最終確認（前回の却下理由の再発防止）

### 5-5. 提出時の入力

- ads_read の用途チェックボックスは「Other」のみ（進捗記録の対応を維持）。記述欄はMetaの3項目（どの機能に必要か／どう連携するか／エンドユーザーにどう役立つか）に1対1で答える。
- Page系2権限 + ads_management は同じバンドルで申請する（「Your submission must include ...」の表示が消えることを確認）。
- Reviewer instructions は「Meta App review 提出用」6章のテンプレートを使い、`[EXACT MENU NAME]` などのプレースホルダを実際の英語UI名で埋める。審査員用テスト環境に、テスト用Page・広告アカウント・Ad Set・Customer List・Sync Jobを用意しておく。
- サーバー側で動く処理（差分同期・オプトアウト処理）で使うトークンの種類を1文で明記する（要件5）。
