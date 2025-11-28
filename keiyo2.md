# keiyo2のページ遷移図

####
```mermaid
stateDiagram-v2
[*] --> 駅一覧を表示:/keiyo2
駅一覧を表示 --> 詳細を表示:/keiyo2/：number
駅一覧を表示 --> 駅を追加:/keiyo2/create
駅一覧を表示 --> 駅を削除:/keiyo2/delete：number
詳細を表示　--> 駅一覧を表示
駅を追加 --> 駅一覧を表示
駅を削除 --> 駅一覧を表示
```