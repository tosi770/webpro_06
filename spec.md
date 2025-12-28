# 仕様書
## 利用者向け
## 管理者向け
## 開発者向け
```mermaid
stateDiagram-v2
    [*] --> 一覧表示
    一覧表示 --> 詳細表示: 
    詳細表示 --> 編集画面: 編集ボタン
    編集画面 --> 登録
    登録 --> 一覧表示
    一覧表示 --> 追加画面: 新規追加ボタン
    追加画面 --> 登録
    詳細表示 --> 削除画面: 削除ボタン
    削除画面 --> 一覧表示
    詳細表示 --> 一覧表示: 一覧ボタン
    追加画面 --> 一覧表示: 一覧ボタン
```

```mermaid
stateDiagram-v2
    state "/kinggnu" as List
    state "/public/kinggnu_new.html" as NewForm
    state "/kinggnu/:number" as Detail
    state "/kinggnu/edit/:number" as Edit
    state "/kinggnu/delete/:number" as Delete

    [*] --> List
    List --> NewForm: [新規追加]
    NewForm --> List: 登録処理 [POST]
    List --> Detail: [詳細]
    Detail --> List: [一覧に戻る]
    Detail --> Delete: [削除]
    Delete --> List: 削除後リダイレクト
    Detail --> Edit: [編集]
    Edit --> List: 更新処理 [POST]
```
```mermaid
stateDiagram-v2
    state "/radio" as R_List
    state "/public/radio_new.html" as R_NewForm
    state "/radio/:number" as R_Detail
    state "/radio/edit/:number" as R_Edit
    state "/radio/delete/:number" as R_Delete

    [*] --> R_List
    R_List --> R_NewForm: [新規追加]
    R_NewForm --> R_List: 登録処理
    R_List --> R_Detail: [詳細]
    R_Detail --> R_Delete: [削除]
    R_Delete --> R_List: リダイレクト
    R_Detail --> R_Edit: [編集]
    R_Edit --> R_List: 更新処理
```

```mermaid
stateDiagram-v2
    state "/game" as G_List
    state "/public/game_new.html" as G_NewForm
    state "/game/:number" as G_Detail
    state "/game/edit/:number" as G_Edit
    state "/game/delete/:number" as G_Delete

    [*] --> G_List
    G_List --> G_NewForm: [新規追加]
    G_NewForm --> G_List: 登録処理
    G_List --> G_Detail: [詳細]
    G_Detail --> G_Delete: [削除]
    G_Delete --> G_List: リダイレクト
    G_Detail --> G_Edit: [編集]
    G_Edit --> G_List: 更新処理
 ```