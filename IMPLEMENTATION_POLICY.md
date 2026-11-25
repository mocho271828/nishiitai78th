# Implementation Policy

このファイルは、今後の実装判断に使う永続的な方針エントリポイントである。

## プロジェクト状態

- 状態: 導入済みサイトから派生した公開用サンプル
- 既存サイトの構成と認証境界を引き継ぐ。サンプルの本文、連絡先、競技データ、画像・添付は架空の内容とし、旧サイトのGit履歴・本番設定・配信ジョブを持ち込まない。

## Policy Gates

実装は以下の gate をすべて通過しなければならない。

- [Project State and Compatibility](./policy_gates/project_state_and_compatibility.md)
- [Frontend Contracts and Routing](./policy_gates/frontend_contracts_and_routing.md)
- [Type Safety and Dependencies](./policy_gates/type_safety_and_dependencies.md)
- [Firebase Security and Configuration](./policy_gates/firebase_security_and_configuration.md)
- [Verification and Git](./policy_gates/verification_and_git.md)

## 運用

- gate 検証時は `policy_gates/` を `temp_gates/yyyy-mm-dd-hh-mm-ss/` にコピーし、コピー先のチェックボックスを埋める。
- リポジトリ全体方針を追加・変更した場合は、既存 gate を更新するか新しい gate を追加する。
- Board添付は関係者限定を原則とする。文書単位で管理者の明示承認がある場合のみ公開URLを許可し、公開状態を画面表示とデータで明示する。

- 次年度への引継ぎでは、サイトの編集元をリポジトリ直下、競技資料の編集原本を `reference/`、公開用の配布物を `public/` に置く。
