# Gate: Firebase Security and Configuration

## 目的

Firebase の設定値、Firestore のデータ境界、デプロイ順序を明示し、意図しない公開・権限付与・本番停止を防ぐ。

## 判定条件

- [ ] Firebase クライアント設定の実値をソースへフォールバックとして直書きせず、必要な環境変数を起動・build 時に検証している。
- [ ] `NEXT_PUBLIC_*` の Firebase Web 設定値を公開情報として扱い、認可やデータ保護をその値の秘匿性に依存していない。
- [ ] 使用する各 Firestore database と rules ファイルの対応を `firebase.json` に明示している。
- [ ] 公開書き込みを許可する場合、操作、対象 collection、field、型、長さ、サーバー管理値を必要最小限に制限している。
- [ ] 公開 collection の read、update、delete は、明示した要件がない限り拒否している。
- [ ] クライアントが新しい権限に依存する場合、対応する Security Rules をクライアントより先に本番反映する手順を確認している。
- [ ] App Check、認証強制、外部 API、課金に関わる設定変更は、既存利用者への影響と監視方法を確認してから行う。

## 不合格条件

- [ ] 実値を含む認証情報、サービスアカウント、秘密鍵、debug token をリポジトリ、クライアントログ、例外へ含めている。
- [ ] 名前付き database が、意図しない default rules または未管理の console rules に依存している。
- [ ] 問い合わせ本文、メールアドレスなどの個人情報をクライアントログへ出力している。

## 判定

YES / NO
