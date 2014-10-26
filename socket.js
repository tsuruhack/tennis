var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var isPlayer1 = 0;	//プレイヤー1が接続しているかどうか
var isPlayer2 = 0;	//プレイヤー2が接続しているかどうか
var key_buffer = [];//それぞれのプレイヤーのキー入力受けつけバッファ
var player = 0;
var boardInfo = {//盤面状態の情報
		player1:{
			 ID:null,
			 name:null,
			 barPosition:50,
			 gameWin:false
		},
		player2:{
			 ID:null,
			 name:null,
			 barPosition:50,		 
			 gameWin:false
		},
		ball:{
			position:{
				x:0,
				y:50
			},
			move:{
			    x:5,
		  		y:5
			},
			isShot:false
		},
	    window:{
		x:600,
		y:500,
		gameover:false
	    }
}


//ルーム内での動作に必要な変数
  var room1=0; //room1の参加人数
  var room2=0; //room2の参加人数

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/client.js', function(req, res) {
    res.sendfile('./client.js');
});

app.use(express.static('./stick.jpg'));
app.get('/keyInput.js', function(req, res) {
    res.sendfile('./keyInput.js');
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

  socket.on('join room', function(player,room_number){
    if(room_number==1){
      room1++;
      if(room1==1){
        //room1の参加者が１人目なら「参加待ち画面」を表示
        console.log("room1 has "+room1+" people.");
        io.emit('waiting',player,1);
        socket.broadcast.emit('show enemy name',player,1);
      }else if(room1==2){
        //room1の参加者が２人目ならゲームをスタートする
        console.log("room1 has "+room1+" people.");
        io.emit('game start',player,1);
        room1=0;
      }
    }else if(room_number==2){
      room2++;
      if(room2==1){
        //room1の参加者が１人目なら「参加待ち画面」を表示
        console.log("room2 has "+room2+" people.");
        io.emit('waiting',player,2);
        socket.broadcast.emit('show enemy name',player,2);
      }else if(room2==2){
        //room1の参加者が２人目ならゲームをスタートする
        console.log("room1 has "+room2+" people.");
        io.emit('game start',player,2);
        room2=0;
      }
    }
  });
  //ルームにいる人に向けて自分の名前を表示させる
  socket.on('show my name', function(jibun,room_number){
    console.log("jibun is "+jibun+"and"+room_number);
    socket.broadcast.emit('show my name',jibun,room_number);
  })
  
  /* 通信を切ったとき */
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  /* ボールを動かす */
  socket.on('update',function(key,playernum){
	  if(playernum==1){//プレイヤー１のキー入力情報
		  key_buffer[1] = key;
	  }else if(playernum==2){//プレイヤー２のキー入力情報
		  key_buffer[2] = key;
	  }
	  if(key_buffer[1] && key_buffer[2]){//お互いのプレイヤーの入力が確認できたら
	  	if(boardInfo.window.gameover){
	  		resetBoardInfo();
	  	}
	  	calc_boardInfo();//盤面情報を更新する
	  	key_buffer = []; 
		socket.emit('update',boardInfo);
	  }
  });
});

http.listen(4000, function(){
  console.log('listening on *:4000');
});

function resetBoardInfo () {
  boardInfo.ball.move.x = 5;
  boardInfo.ball.move.y = 5;
  boardInfo.ball.position.x = 0;
  boardInfo.ball.position.y = boardInfo.player1.barPosition;
  boardInfo.ball.isShot = false;
  boardInfo.window.gameover = false;
  boardInfo.player1.gameWin = false;
  boardInfo.player2.gameWin = false;
}

function calc_boardInfo(){
	if(key_buffer[1] == 1){//プレイヤー１のボードが上に
		if(boardInfo.player1.barPosition < boardInfo.window.y){
		boardInfo.player1.barPosition += 5;
		}
	}else if(key_buffer[1] == 2){//プレイヤー１のボードが下に
		if(boardInfo.player1.barPosition > 0){
		boardInfo.player1.barPosition -= 5;
		}
	}
	if(key_buffer[2] == 1){//プレイヤー２のボードが上に
        if(boardInfo.player2.barPosition < boardInfo.window.y){
	    boardInfo.player2.barPosition += 5;
	    }
	}else if(key_buffer[2] == 2){//プレイヤー２のボードが下に
		if(boardInfo.player2.barPosition > 0){
	    boardInfo.player2.barPosition -= 5;
	 }
	}
	if(key_buffer[1] == 4){
		boardInfo.ball.isShot = true;
	}
	moveBall();
}

function moveBall () {
	if(boardInfo.ball.isShot){
		if(isReflectX()){
			boardInfo.ball.move.x *= -1;
		}
		if(isReflectY()){
			boardInfo.ball.move.y *= -1;
		}
	boardInfo.ball.position.x += boardInfo.ball.move.x;
	boardInfo.ball.position.y += boardInfo.ball.move.y;
	} else {
		boardInfo.ball.position.y = boardInfo.player1.barPosition;
	}
}

function isReflectY () {
  if(boardInfo.ball.position.y > boardInfo.window.y){
  	return true;
  }
  if(boardInfo.ball.position.y < 0){
  	return true;
  }
  return false;
}

function isReflectX () {
  //player2に当たっているかの判定
  if(boardInfo.ball.position.x > boardInfo.window.x - 20
  	&& boardInfo.ball.position.x < boardInfo.window.x
  	&& boardInfo.ball.position.y >= boardInfo.player2.barPosition
  	&& boardInfo.ball.position.y <= boardInfo.player2.barPosition + 80){
  	return true;
  }
  if(boardInfo.ball.position.x >= boardInfo.window.x){
  	boardInfo.window.gameover = true;
  	boardInfo.player1.gameWin = true;
  }
  //player1 "
  if(boardInfo.ball.position.x < 0
  	&& boardInfo.ball.position.x > -20
  	&& boardInfo.ball.position.y >= boardInfo.player1.barPosition
  	&& boardInfo.ball.position.y <= boardInfo.player1.barPosition + 80){
  	return true;
  }
  if(boardInfo.ball.position.x < -20){
  	boardInfo.window.gameover = true;
  	boardInfo.player2.gameWin = true;
  }
  console.log(boardInfo.window.gameover);
  return false;
}
