# webpro_06
2024.10.29

## このプログラムについて

## ファイル一覧

ファイル名 | 説明
-|-
app5.js | プログラム本体
public/janken.html | じゃんけんの開始画面

```javasript
console.log('Hello');
```

```mermaid
flowchart TD;
開始 --> 終了;
```

```mermaid
flowchart TD;

start["開始"]
end1["終了"]
if{"条件に合うか"}
win["勝ち"]
lose["負け"]

start --> if
if -->|yes| win
win --> end1
if -->|no| lose
lose --> end1
```

```javasript
「High & Low」
1~10の数字がランダムで生成されて現在の数(now)として表示される．

```