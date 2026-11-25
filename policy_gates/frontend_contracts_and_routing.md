# Gate: Frontend Contracts and Routing

## 目的

Next.js の画面境界、静的 export、既存ルーティング仕様を守りながら UI を変更する。

## 判定条件

- [ ] `next.config.ts` の `output: "export"`、`trailingSlash: true`、`basePath: "/~nisiitai/78th"` と矛盾しない実装になっている。
- [ ] 画面間で共有するデータ変換は、表示コンポーネントへ直接散らさず、近い共通層に置いている。
- [ ] feature 内部だけで完結する表示部品は、必要以上に広い共有ディレクトリへ移していない。
- [ ] 既存 UI の styling 手法、余白、配色、状態表示と一貫している。

## 不合格条件

- [ ] `basePath` 前提の URL で確認できない実装になっている。
- [ ] 静的 export と相性の悪い runtime 専用処理を、画面表示に必須としている。
- [ ] 関連性の低い feature や横断層へ表示ロジックが漏れている。

## 判定

YES / NO
