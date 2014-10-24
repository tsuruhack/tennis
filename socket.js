var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var isPlayer1 = 0;	//プレイヤー1が接続しているかどうか
var isPlayer2 = 0;	//プレイヤー2が接続しているかどうか
var player = 0;

//ルーム内での動作に必要な変数
  var room1=0; //room1の参加人数
  var room2=0; //room2の参加人数

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.emit('some event', {for: 'everyone'});

io.on('connection',function(socket){
	/*繋がったとき */
  if(isPlayer1==0){
	  player = 1;
	  isPlayer1 = 1;
  }else if(isPlayer2==0){
	  player = 2;
	  isPlayer2 = 1;
  }else{
	  player = 0;
  }

  console.log('player%d connected',player);
  io.emit('user connected',player);

  //ルームでの動作

  socket.on('join room1', function(player){
    room1++;
    if(room1==1){
      //room1の参加者が１人目なら「参加待ち画面」を表示
      console.log("room1 has "+room1+" people.");
      io.emit('waiting',player,1);
      socket.broadcast.emit('show enemy name',player);
    }else if(room1==2){
      //room1の参加者が２人目ならゲームをスタートする
      console.log("room1 has "+room1+" people.");
      io.emit('game start',player,1);
      room1=0;
    }
  });
  
  /* 通信を切ったとき */
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  /* キーが押されたとき */
  socket.on('keydown', function(msg,p){
    console.log(player + 'p keydown: ' + msg);
    socket.broadcast.emit('keydown', msg,p);  
  });
  
  /* ボールを動かす */
  socket.on('update',function(rad){
    socket.emit('update',rad);
  });
});

http.listen(4000, function(){
  console.log('listening on *:4000');
});


function calc(ball,racket_1,racket_2){
	
}