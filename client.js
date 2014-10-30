var socket = io();
var FPS = 60;
var movescale = 2;
//ルーム内での動作に必要な変数
var come=0;
var room1_player=-1; //room1上で、player1なら1、player2なら2の値をとる。
var room2_player=-1; //room2上で、...
var jibun1,jibun2,teki1,teki2; //自分と敵の名前を入れる.数字は部屋番号
//for room1_player 自分：jibun1 相手：teki1
//for room2_player 相手：jibun2 自分：teki2
var myplayernum = 0;//自分のプレイヤー番号
var myroom = 0;//ルーム番号
	
//フォーム１が入力されたら
$('#form1').submit(function(){
	console.log("abc");
	room1_player +=2;
    var player1 = $("#player1-1").val();
    if(room1_player==1){
       	if(player1 == ""){ player1 = "player1"; }
   	}else if(room1_player==2){
   		if(player1 == ""){ player1 = "player2"; }
   	}
   	jibun1=player1;    
	socket.emit('join room',player1,1);
   	return false;
});
//フォーム2が入力されたら
$('#form2').submit(function(){
   	room2_player +=2;
   	var player2 = $("#player2-1").val();
  	if(room2_player==1){
       	if(player2 == ""){ player2 = "player1"; }
   	}else if(room2_player==2){
   		if(player2 == ""){ player2 = "player2"; }
   	}
   	jibun2=player2;
   	socket.emit('join room',player2,2);
   	return false;   
});
    

//「参加待ち画面」を表示
socket.on('waiting',function(player1,room){
    //alert("あなたは"+player1+"です。部屋はroom"+room+"です。");
    if((room1_player==1 &&room==1) || (room2_player==1 && room==2)){
	    $("#room-box2").css({'margin-left':'-200%'});
	  	$("#room-box").css({'margin-left':'-200%'});
	   	$("body").append($('<div id="wait" class="room-box3">'));
	   	$("#wait").append("<h1>Your name is <span style='color:#ff3300'>"+player1+"</span> in Room "+room+".</h1><h3>Serching for the other side player.</h3><h3>Please wait.</h3>");
    }
});

//
socket.on('user connected',function(room1,room2,ple11,ple12,ple21,ple22){
	if(come==0){
		room1_player=room1;
		room2_player=room2;
		if(room1 != 2) room1_player -= 1;
		if(room2 != 2) room2_player -= 1;
		//alert("room1:"+room1+"\nroom2:"+room2);
	}
	if(room1 >= 1) $('#enemy-room1').text(ple11);
	if(room1 >= 2){
		$('#form1 input').remove();
		$('#form1 button').remove();
		$('#form1').prepend("<span>"+ple12+"</span>");
	}
	if(room2 >= 1) $('#enemy-room2').text(ple21);
	if(room2 >= 2){
		$('#form2 input').remove();
		$('#form2 button').remove();
		$('#form2').prepend("<span>"+ple22+"</span>");
	}
	teki1=ple11;
	teki2=ple21;
	come=1;
});

//"vs"以降の表示を変更
socket.on('show enemy name',function(player1,room_number){
    if(room_number==1){
	   	$('#enemy-room1').text(player1);
    	teki1=$('#enemy-room1').text();
    	//alert("player:"+teki1);
    	room1_player +=1;
   	}else if(room_number==2){
   		$('#enemy-room2').text(player1);
    	teki2=$('#enemy-room2').text();
    	//alert("player:"+teki2);
    	room2_player +=1;
 	}
});
//vs以前の名前を変更
socket.on('show my name',function(jibun,room_number){
	if(room_number==1){
		$('#form1 input').remove();
		$('#form1 button').remove();
		$('#form1').prepend("<span>"+jibun+"</span>");
	}else if(room_number==2){
		$('#form2 input').remove();
		$('#form2 button').remove();
		$('#form2').prepend("<span>"+jibun+"</span>");
	}
});

//ゲームスタート
socket.on('game start',function(player2,room){
   	//player1 in room1の動作
   	if(room1_player==1 && room==1){
   		teki1=player2;
		myplayernum = 1;
		myroom = 1;
   		alert("私は"+jibun1+". 敵は"+teki1+"です。");
   		$("#wait").empty();
   		$("#wait").remove();
   	} 
  	//player2 in room1の動作
   	else if(room1_player==2 && room==1){
		myplayernum = 2;
		myroom = 1;
   		alert("私は"+jibun1+". 敵は"+teki1+"です。");
  		$("#room-box2").css({'margin-left':'-200%'});
    	$("#room-box").css({'margin-left':'-200%'});
	   	socket.emit('show my name',jibun1,room);
   	}
   	//player1 in room2の動作
   	if(room2_player==1 && room==2){
   		teki2=player2;
		myplayernum = 1;
		myroom = 2;
    	alert("私は"+jibun2+". 敵は"+teki2+"です。");
    	$("#wait").empty();
    	$("#wait").remove();
   	}
   	//player2 in room2の動作
   	else if(room2_player==2 && room==2){
		myplayernum = 2;
		myroom = 2;
    	alert("私は"+jibun2+". 敵は"+teki2+"です。");
    	$("#room-box2").css({'margin-left':'-200%'});
	   	$("#room-box").css({'margin-left':'-200%'});
	   	socket.emit('show my name',jibun2,room);
    }
	
	/* 得点盤挿入 */
	$('#point-box').css({'background-color':'#ff6600','border-style':'solid'});
	$('#point-box').text("0-0");
	
	gameroop();
		
});
	 
socket.on('update',function(data){//サーバーから盤面情報が送られてきたとき
	 if(data){
	 	//console.log(data);
	 }
	//boardInfo.ball.position.x = data.ball.position.x;
	flush_board(data);//盤面の表示を更新
});
  
function gameroop(){//更新を要求
	var key = CheckKeyKind();//押されてるキーの種類を判定する
	socket.emit('update',key,myplayernum)
	setTimeout(gameroop, 1000/FPS);
}
  
function flush_board(data){//盤面の情報を更新
 		$("#mybox").css({'bottom':data.player1.barPosition});
 		if(data.ball.isShot){
 			$("#ball").css({'bottom':data.ball.position.y, 'right':data.ball.position.x});
 		} else {
 		    $("#ball").css({'bottom':data.player1.barPosition});
 		}
 		if(data.window.gameover){
			console.log("1P:" + data.player1.gameWin);
			console.log("2P:" + data.player2.gameWin);
 			$("#ball").css({'right':270});
 			if(data.player1.gameWin){
				if(myroom==1){
 					alert(jibun1+"の勝ち！\n" + data.player2.point + "-" + data.player1.point);
				}else if(myroom==2){
					alert(jibun2+"の勝ち！\n" + data.player2.point + "-" + data.player1.point);
				}
 			}
 			if(data.player2.gameWin){
				if (myroom==1){
 					alert(teki1+"の勝ち！\n" + data.player2.point + "-" + data.player1.point);
				}else if(myroom==2){
					alert(teki2+"の勝ち！\n" + data.player2.point + "-" + data.player1.point);
				}
 			}
			$("#point-box").text(data.player2.point + "-" + data.player1.point);
 		}
	  	$("#enebox").css({'bottom':data.player2.barPosition});
	  	if(data.ball.isHitSound){
	  	}
}
  
  
  
  
  
/****************************************************/
  
/* 本当は keyInput.js というファイルを別で作って読み込みたいけどrequireできないからこのファイルに直で書く */  
  
//keyInput.js
// キーボードの入力状態を記録する配列
var input_key_buffer = new Array();

// ------------------------------------------------------------
// キーボードを押したときに実行されるイベント
// ------------------------------------------------------------
document.onkeydown = function (e){
	// InternetExplorer 用
	if (!e)	e = window.event;
	input_key_buffer[e.keyCode] = true;
};

// ------------------------------------------------------------
// キーボードを離したときに実行されるイベント
// ------------------------------------------------------------
document.onkeyup = function (e){
	// InternetExplorer 用
	if (!e)	e = window.event;

	input_key_buffer[e.keyCode] = false;
};

// ------------------------------------------------------------
// ウィンドウが非アクティブになる瞬間に実行されるイベント
// ------------------------------------------------------------
window.onblur = function (){
	// 配列をクリアする
	input_key_buffer.length = 0;
};

// ------------------------------------------------------------
// キーボードが押されているか調べる関数
// ------------------------------------------------------------
function KeyIsDown(key_code){

	if(input_key_buffer[key_code])	return true;

	return false;
}


// ------------------------------------------------------------
// 押されているキーを判定
// ------------------------------------------------------------
function CheckKeyKind(){

	// Ａキーが押されているか調べる
	if(KeyIsDown(38)){
		//console.log("←キーが押されている");
		return 1;
	}else{
		//console.log("←キーが離されている");
	}

	// スペースキーが押されているか調べる
	if(KeyIsDown(40)){
		//console.log("→キーが押されている");
		return 2;
	}else{
		//console.log("→キーが離されている");
	}
	
	if(KeyIsDown(39)){
		//console.log("→キーが押されている");
		return 4;
	}else{
		//console.log("→キーが離されている");
	}
	
	return 3;//何も押されてないという情報も送る必要があるため

}
//mojule.exports = CheckKeyKind;
  
/****************************************************/
  