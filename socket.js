var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var isPlayer1 = 0;	//プレイヤー1が接続しているかどうか
var isPlayer2 = 0;	//プレイヤー2が接続しているかどうか
var player = 0;

app.get('/', function(req, res){
  res.sendfile('index.html');
});

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
  //yata
  console.log('player%d connected',player);
  io.emit('user connected',player);
  
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