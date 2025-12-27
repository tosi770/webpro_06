"use strict";
const { name } = require("ejs");
const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

let station = [
  { id:1, code:"JE01", name:"東京駅"},
  { id:2, code:"JE07", name:"舞浜駅"},
  { id:3, code:"JE12", name:"新習志野駅"},
  { id:4, code:"JE13", name:"幕張豊砂駅"},
  { id:5, code:"JE14", name:"海浜幕張駅"},
  { id:6, code:"JE05", name:"新浦安駅"},
];

let station2 = [
  { id:1, code:"JE01", name:"東京駅", change:"総武本線，中央線，etc", passengers:403831, distance:0 },
  { id:2, code:"JE02", name:"八丁堀駅", change:"日比谷線", passengers:31071, distance:1.2 },
  { id:3, code:"JE05", name:"新木場駅", change:"有楽町線，りんかい線", passengers:67206, distance:7.4 },
  { id:4, code:"JE07", name:"舞浜駅", change:"舞浜リゾートライン", passengers:76156,distance:12.7 },
  { id:5, code:"JE12", name:"新習志野駅", change:"", passengers:11655, distance:28.3 },
  { id:6, code:"JE17", name:"千葉みなと駅", change:"千葉都市モノレール", passengers:16602, distance:39.0 },
  { id:7, code:"JE18", name:"蘇我駅", change:"内房線，外房線", passengers:31328, distance:43.0 },
];

let KingGnu = [
  { id:1, name:"AIZO", album:"single", tieup:"アニメ「呪術廻戦死滅回遊編」主題歌", release:"26'01'09"},
  { id:2, name:"SO BAD", album:"single", tieup:"USJゾンビ・デ・ダンス テーマソング", release:"25'09'05"},
  { id:3, name:"白日", album:"single", tieup:"ドラマ「イノセント冤罪弁護士」主題歌", release:"19'02'22"},
  { id:4, name:"Sorrows", album:"Sympa", tieup:"「アサヒドライゼロスパーク」CMソング", release:"19'01'16"},
  { id:5, name:"IKAROS", album:"THE GREATEST UNKNOWN", tieup:"なし", release:"23'11'29"},
  { id:6, name:"サマーレイン・ダイバー", album:"Tokyo Rendez-Vous", tieup:"なし", release:"17'10'25"},
];

let radio = [
  { id:1, name:"SPARK", station:"J-WAVE" ,day:"毎週火曜日", time:"24:00~",personality:"新井和輝"},
  { id:2, name:"霜降り明星のオールナイトニッポン", station:"ニッポン放送" ,day:"毎週金曜日", time:"25:00~",personality:"霜降り明星"},
  { id:3, name:"SixTONESのオールナイトニッポンサタデースペシャル", station:"ニッポン放送" ,day:"毎週土曜日", time:"23:30~",personality:"SixTONES(田中樹とランダムなメンバー1人)"},
  { id:4, name:"オードリーのオールナイトニッポン", station:"ニッポン放送" ,day:"毎週土曜日", time:"25:00~",personality:"オードリー"},
];

let game =[
  { id:1, name:"原神", genre:"オープンワールド", release:"20'09'28", company:"miHoYo"},
  { id:2, name:"崩壊スターレイル", genre:"ターン制コマンドバトル", release:"23'04'26", company:"miHoYo"},
  { id:3, name:"ゼンレスゾーンゼロ", genre:"3Dアクション", release:"24'07'04", company:"miHoYo"},
  { id:4, name:"モンスターハンターライズ", genre:"ハンティングアクション", release:"21'03'26", company:"CAPCOM"},
  { id:5, name:"モンスターストライク", genre:"ひっぱりハンティング", release:"13'10'10", company:"MIXI"},
];

app.get("/keiyo", (req, res) => {
  res.render('db1', { data: station });
});

app.get("/keiyo2", (req, res) => {
  res.render('keiyo2', { data: station2 });
});

app.get("/keiyo2/create", (req, res)=>{
  res.redirect('/public/keiyo2_new.html');
});

app.get("/keiyo2/:number", (req, res) => {
  const number = req.params.number;
  const detail = station2[ number ];
  res.render('keiyo2_detail', {id: number, data: detail} );
});

app.post("/keiyo2", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const id = station2.length + 1;
  const code = req.body.code;
  const name = req.body.name;
  const change = req.body.change;
  const passengers = req.body.passengers;
  const distance = req.body.distance;
  station2.push( { id: id, code: code, name: name, change: change, passengers: passengers, distance: distance } );
  console.log( station2 );
  res.render('keiyo2', {data: station2} );
});

// Delete
app.get("/keiyo2/delete/:number", (req, res) => {
  // 本来は削除の確認ページを表示する
  // 本来は削除する番号が存在するか厳重にチェックする
  // 本来ならここにDBとのやり取りが入る
  station2.splice( req.params.number, 1 );
  res.redirect('/keiyo2' );
});

// Edit
app.get("/keiyo2/edit/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = station2[ number ];
  res.render('keiyo2_edit', {id: number, data: detail} );
});

app.post("/keiyo2/update/:number", (req, res) =>{
  // 本来は変更する番号が存在するか，各項目が正しいか厳重にチェックする
  // 本来ならここにDBとのやり取りが入る
  station2[req.params.number].code = req.body.code;
  station2[req.params.number].name = req.body.name;
  station2[req.params.number].change = req.body.change;
  station2[req.params.number].passengers = req.body.passengers;
  station2[req.params.number].distance = req.body.distance;
  console.log( station2 );
  res.redirect('/keiyo2' );
});
// 1.King Gnu -------------------------------------------
app.get("/kinggnu", (req, res) => {
  res.render('kinggnu', { data: KingGnu });
});

app.get("/kinggnu/create", (req, res)=>{
  res.redirect('/public/kinggnu_new.html');
});

app.post("/kinggnu", (req, res) => {
  const id = KingGnu.length + 1;
  const name = req.body.name;
  const album = req.body.album;
  const tieup = req.body.tieup;
  const release = req.body.release;
  KingGnu.push( { id: id, name: name, album: album, tieup: tieup, release: release } );
  res.render('kinggnu', {data: KingGnu} );
});

app.get("/kinggnu/:number", (req, res) => {
  const number = req.params.number;
  const detail = KingGnu[ number ];
  res.render('kinggnu_detail', {id: number, data: detail} );
});

app.get("/kinggnu/delete/:number", (req, res) => {
  KingGnu.splice( req.params.number, 1 );
  res.redirect('/kinggnu' );
});

app.get("/kinggnu/edit/:number", (req, res) => {
  const number = req.params.number;
  const detail = KingGnu[ number ];
  res.render('kinggnu_edit', {id: number, data: detail} );
});

app.post("/kinggnu/update/:number", (req, res) =>{
  KingGnu[req.params.number].name = req.body.name;
  KingGnu[req.params.number].album = req.body.album;
  KingGnu[req.params.number].tieup = req.body.tieup;
  KingGnu[req.params.number].release = req.body.release;
  res.redirect('/kinggnu' );
});

// 2.radio-------------------------------------------
app.get("/radio", (req, res) => {
  res.render('radio', { data: radio });
});

app.get("/radio/create", (req, res)=>{
  res.redirect('/public/radio_new.html');
});

app.post("/radio", (req, res) => {
  const id = radio.length + 1;
  const name = req.body.name;
  const stationName = req.body.station;
  const day = req.body.day;
  const time = req.body.time;
  const personality = req.body.personality;
  radio.push( { id: id, name: name, station: stationName, day: day, time: time, personality: personality } );
  res.render('radio', {data: radio} );
});

app.get("/radio/:number", (req, res) => {
  const number = req.params.number;
  const detail = radio[ number ];
  res.render('radio_detail', {id: number, data: detail} );
});

app.get("/radio/delete/:number", (req, res) => {
  radio.splice( req.params.number, 1 );
  res.redirect('/radio' );
});

app.get("/radio/edit/:number", (req, res) => {
  const number = req.params.number;
  const detail = radio[ number ];
  res.render('radio_edit', {id: number, data: detail} );
});

app.post("/radio/update/:number", (req, res) =>{
  radio[req.params.number].name = req.body.name;
  radio[req.params.number].station = req.body.station;
  radio[req.params.number].day = req.body.day;
  radio[req.params.number].time = req.body.time;
  radio[req.params.number].personality = req.body.personality;
  res.redirect('/radio' );
});

// 3.game-------------------------------------------
app.get("/game", (req, res) => {
  res.render('game', { data: game });
});

app.get("/game/create", (req, res)=>{
  res.redirect('/public/game_new.html');
});

app.post("/game", (req, res) => {
  const id = game.length + 1;
  const name = req.body.name;
  const genre = req.body.genre;
  const release = req.body.release;
  const company = req.body.company;
  game.push( { id: id, name: name, genre: genre, release: release, company: company } );
  res.render('game', {data: game} );
});

app.get("/game/:number", (req, res) => {
  const number = req.params.number;
  const detail = game[ number ];
  res.render('game_detail', {id: number, data: detail} );
});

app.get("/game/delete/:number", (req, res) => {
  game.splice( req.params.number, 1 );
  res.redirect('/game' );
});

app.get("/game/edit/:number", (req, res) => {
  const number = req.params.number;
  const detail = game[ number ];
  res.render('game_edit', {id: number, data: detail} );
});

app.post("/game/update/:number", (req, res) =>{
  game[req.params.number].name = req.body.name;
  game[req.params.number].genre = req.body.genre;
  game[req.params.number].release = req.body.release;
  game[req.params.number].company = req.body.company;
  res.redirect('/game' );
});

app.get("/keiyo_add", (req, res)=> {
  let id = req.query.id;
  let code = req.query.code;
  let name = req.query.name;
  let newdata = { id: id, code: code, name: name };
  station.push( newdata );
  res.redirect('/public/keiyo_add.html');
});

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

app.get("/omikuji1", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.send( '今日の運勢は' + luck + 'です' );
});

app.get("/omikuji2", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.render( 'omikuji2', {result:luck} );
});

app.get("/janken", (req, res) => {
  const isSubmitted = req.query.hand !== undefined;
  let hand, win, total, num, cpu, judgement, yourHandStr;

  if (isSubmitted) {
    hand = Number(req.query.hand);
    win = Number(req.query.win);
    total = Number(req.query.total);

    console.log( {hand, win, total});

    num = Math.floor(Math.random() * 3 + 1);
    cpu = '';
    judgement = '';
    if( num==1 ) cpu = 'グー';
    else if( num==2 ) cpu = 'チョキ';
    else cpu = 'パー';

    if( hand==1 ) yourHandStr = 'グー';
    else if( hand==2 ) yourHandStr = 'チョキ';
    else yourHandStr = 'パー';
    
    // 勝敗判定
    if(( hand==1 && num==2)||(hand==2 && num==3)||(hand==3 && num==1)){
      judgement = '勝ち';
      win += 1;
      total += 1;
    }
    else if(( hand==1 && num==1)||(hand==2 && num==2)||(hand==3 && num==3)){
      judgement = 'あいこ';
    }
    else{
      judgement = '負け';
      total += 1;
    }

  } else {
    hand = undefined;
    win = 0;
    total = 0;
    cpu = '';
    judgement = '';
    yourHandStr = '';
  }
  const display = {
    your: yourHandStr,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
