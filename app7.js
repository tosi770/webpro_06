"use strict";
const express = require("express");
const app = express();

let bbs = [];  // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える
let postCounter = 0; // 投稿番号を管理するカウンタ

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 今はダミーで人間の勝ちにしておく
  let judgement = '勝ち';
  win += 1;
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

app.get("/get_test", (req, res) => {
  res.json({
    answer: 0
  })
});

app.get("/add", (req, res) => {
  console.log("GET");
  console.log( req.query );
  const num1 = Number( req.query.num1 );
  const num2 = Number( req.query.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});

app.post("/add", (req, res) => {
  console.log("POST");
  console.log( req.body );
  const num1 = Number( req.body.num1 );
  const num2 = Number( req.body.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});

// これより下はBBS関係
app.post("/check", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  res.json( {number: bbs.length });
});

app.post("/read", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  const start = Number( req.body.start );
  console.log( "read -> " + start );
  if( start==0 ) res.json( {messages: bbs });
  else res.json( {messages: bbs.slice( start )});
});

app.post("/post", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;

  console.log(`[投稿追加] 番号: ${postCounter + 1}, 名前: ${name}, 内容: ${message}`);

  // 投稿番号をインクリメントして設定
  postCounter += 1;

  // 新しい投稿を作成
  const newPost = {
      id: postCounter, // 投稿番号
      name: name || "匿名", // 名前（デフォルトは「匿名」）
      message: message || "（メッセージなし）", // メッセージ（デフォルトは空）
      likes: 0, // いいね数（初期値0）
      replies: [], // 返信の初期化
  };

  bbs.push(newPost); // 配列に追加

  // 正常なレスポンスを返す（/readはここで呼び出さない）
  res.json({ number: bbs.length });
});


// 投稿を取得するAPI（番号といいねを含めて返す）
app.post("/read", (req, res) => {
  const start = Number(req.body.start) || 0; // startが無効な場合は0を使用
  console.log("read -> " + start);

  if (start < 0 || start >= bbs.length) {
      // 範囲外の場合は全データを返す
      res.json({ messages: bbs });
  } else {
      // 部分的なデータを返す（startからのスライス）
      res.json({ messages: bbs.slice(start) });
  }
});



app.post("/reply", (req, res) => {
  const postId = Number(req.body.id); // 親投稿のID
  const name = req.body.name || "匿名";
  const message = req.body.message || "（メッセージなし）";

  console.log(`[返信追加] 親投稿ID: ${postId}, 名前: ${name}, 内容: ${message}`);

  // 親投稿を検索
  const parentPost = bbs.find((post) => post.id === postId);

  if (parentPost) {
      // 返信を追加
      const newReply = {
          name: name,
          message: message,
      };
      parentPost.replies.push(newReply);

      console.log(`[返信成功] 親投稿ID: ${postId}, 現在の返信数: ${parentPost.replies.length}`);
      res.json({ success: true });
  } else {
      console.log(`[返信失敗] 親投稿ID: ${postId}が見つかりません`);
      res.status(404).json({ success: false, message: "Parent post not found" });
  }
});

// いいねのカウントを更新するAPI（指定されたIDの投稿を更新）
app.post("/like", (req, res) => {
  const postId = Number(req.body.id); // 投稿IDを取得
  console.log(`[いいね処理] 投稿ID: ${postId}`);

  // 投稿を検索
  const post = bbs.find((item) => item.id === postId);

  if (post) {
      post.likes += 1; // いいね数を増加
      console.log(`[いいね成功] 投稿ID: ${postId}, 現在のいいね数: ${post.likes}`);
      res.json({ success: true, likes: post.likes });
  } else {
      console.log(`[いいね失敗] 投稿ID: ${postId}が見つかりません`);
      res.status(404).json({ success: false, message: "Post not found" });
  }
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));