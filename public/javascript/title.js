/* タイトルでの処理に使うhtml */
function gamemode(mode){
	if(mode!=1){
		alert("準備中…");
	}else{
	/*説明テキストの変更*/
	$("h3").text('Input your name and push "join" button.');
	/* ゲームモード選択ボタンを削除する */
	$(".gamemode").empty();
   	$(".gamemode").remove();
	
	/* ルームページ挿入*/
	$("#roomquery").append($('<div class="room-box3"><li class="room"><p>room1</p><form id="form1" action=""><input id="player1-1" class="input" type="text" placeholder="Your Name"><button class="OK-button">join</button><span>vs</span><span id="enemy-room1">no player</span></form></li></div><div class="room-box3"><li class="room"><p>room2</p><form id="form2" action=""><input id="player2-1" class="input" type="text" placeholder="Your Name"><button class="OK-button">join</button><span>vs</span><span id="enemy-room2">no player</span></form></li></div>'));
	
	/* jsファイルを動的に読み込む */
	var script = document.createElement( 'script' );
	var filename="./client.js"
	script.type = 'text/javascript';
	script.src = filename;
	var firstScript = document.getElementsByTagName( 'script' )[ 0 ];
	firstScript.parentNode.insertBefore( script, firstScript );
	}
	
}

	   					
	   					
	   					
	   				