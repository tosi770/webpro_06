const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

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
  let win = Number( req.query.win )||0;
  let total = Number( req.query.total )||0;
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  let judgement = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';

  // ここに勝敗の判定を入れる

  if(( hand=='グー' && num==2)||(hand=='チョキ' && num==3)||(hand=='パー' && num==1)){
    judgement = '勝ち';
    win += 1;
    total += 1;}
  else if(( hand=='グー' && num==1)||(hand=='チョキ' && num==2)||(hand=='パー' && num==3)){
    judgement = 'あいこ';}
  if(( hand=='グー' && num==3)||(hand=='チョキ' && num==1)||(hand=='パー' && num==2)){
    judgement = 'なんで負けたか明日まで考えといてください';
    total += 1;}
  const display = {
  your: hand,
  cpu: cpu,
  judgement: judgement,
  win: win,
  total: total
  }
  res.render( 'janken', display );
});

app.get("/highlow", (req, res) => {
  // クエリパラメータを取得し、既存の値があれば使用
  let win = Number(req.query.win) || 0;
  let lose = Number(req.query.lose) || 0;
  let total = Number(req.query.total) || 0;
  
  // `now` の値がクエリパラメータで提供されていない場合、新しい数値を生成
  let now = req.query.now !== undefined ? Number(req.query.now) : Math.floor(Math.random() * 10 + 1);
  
  const num = Math.floor(Math.random() * 10 + 1); // 比較用のランダムな数値
  const value = req.query.radio; // ユーザーの選択肢 (高いか低いか)
  let result = '';

  // ゲームのロジック
  if ((now > num && value == 2) || (now < num && value == 1)) {
    result = 'win';
    win++;
    total++;
  } else if (now == num) {
    result = 'draw';
  } else {
    result = 'lose';
    lose++;
    total++;
  }

  // 次のゲーム用の新しい数値を生成
  now = num;  // 次のリクエストで使用する新しい数値を now にセット

  // 表示用のオブジェクトを設定
  const display = {
    result: result,
    win: win,
    lose: lose,
    total: total,
    now: now  // 新しい now を次のゲームに渡す
  };

  res.render('highlow', display);
});

app.get("/inpeikanpa", (req, res) => {
  // クエリから win と total を取得し、数値化。未定義の場合はデフォルト値 0 を設定。
  let win = Number(req.query.win) || 0;
  let total = Number(req.query.total) || 0;

  console.log({ win, total });

  // `before` の処理
  let before = req.query.before !== undefined ? Number(req.query.before) : Math.floor(Math.random() * 5 + 1);

  // ラジオボタンの値を取得し、数値に変換
  const value = Number(req.query.radio) || null;

  // 結果を格納する変数
  let result = '';

  // 比較用のランダムな数値を生成
  const num = Math.floor(Math.random() * 5 + 1);

  // 勝敗判定
  if (value !== null && num === value) {
    result = 'win';
    win++;
  } else if (value !== null) {
    result = 'lose';
  }
  total++; // 試行回数を増加

  // 次回用の値を設定
  before = num;

  // 表示用オブジェクト
  const display = {
    result: result,
    win: win,
    total: total,
    before: before, // 次回ゲームに渡す値
  };

  // テンプレートをレンダリング
  res.render('inpeikanpa', display);
});


app.listen(8080, () => console.log("Example app listening on port 8080!"));
