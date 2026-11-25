# 西医体サイトの公開サンプル

第78回西医体のサイト構成を使って、次年度担当者が大会ページの作り方を試せる見本です。開催日程、参加チーム、結果、役員、記事、添付資料はすべて架空です。

## 手元で開く

Node.js 20.9以降を用意し、このREADMEのあるフォルダーで実行します。

```sh
npm ci
npm run dev
```

[ローカルのトップページ](http://localhost:3000/~nisiitai/78th/)を開いてください。環境変数を設定しなくても、競技別の組合せ、結果、資料を閲覧できます。

## 年度ごとに編集する場所

| 内容 | 編集場所 |
| --- | --- |
| 大会名と案内 | `src/app/layout.tsx`、`src/app/page.tsx`、`src/components/Navbar.tsx` と `Footer.tsx`。申込・宿泊・連絡先は `src/app/entry/`、`accommodation/`、`contact/`。 |
| 競技・日程・会場 | `src/libs/games_data.ts`、`src/app/schedule/`、`src/app/venues/`。 |
| 組合せと結果 | Excelの原本は `reference/tournament-xlsx/`。サイトは `src/app/tournament/data/schedule.json` と `result.json` を読みます。Excelとの自動同期はないため、試合IDとチームIDをそろえて更新してください。 |
| PDFと結果画像 | 素材は `public/file/` と `public/images/`。競技詳細ページの表示順や対応付けは `src/app/games/[id]/_lib/`。 |
| お知らせ・理事会・評議会 | `src/libs/microcms.ts` にサンプル記事と、microCMSを使う場合の取得処理があります。 |
| 役員一覧 | `src/app/members/data/members.json` に架空の掲載例があります。 |

## 連携を試すとき

初期状態ではFirebaseに接続せず、ログイン画面は説明だけを表示します。認証を試す場合は `.env.example` を `.env.local` にコピーし、**自分の検証用プロジェクト**のFirebase設定4項目を入力して再起動します。Storageの添付を使う場合はバケット名も必要です。microCMSを試す場合は検証用サービスのドメインとAPIキーを設定します。どちらの検証環境でも架空データを使ってください。記事本文はHTMLとして表示するため、CMSの編集権限は信頼できる担当者に限定します。

このサイトは静的HTMLを出力します。画面にログイン条件があっても、組み込んだJSONや配布物はダウンロードできます。実際の名簿や関係者資料を扱う場合は、取得時に権限を確認できる別の保管先を使用してください。

## 動作確認

```sh
npm run lint
npm run build
npx tsc --noEmit
```

生成先は `out/` です。公開サンプルには大学サーバーへの自動配信や既存のFirebaseプロジェクトへの設定は含めていません。
