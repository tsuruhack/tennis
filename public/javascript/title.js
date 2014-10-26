/* タイトルでの処理に使うhtml */
function gamemode(mode){
	
	/*説明テキストの変更s*/
	$("h3").text('Input your name and push "join" button.');
	/* ゲームモード選択ボタンを削除する */
	$(".gamemode").empty();
   	$(".gamemode").remove();
	
	$("#roomquery").append($('<div class="room-box3"><li class="room"><p>room1</p><form id="form1" action=""><input id="player1-1" class="input" type="text" placeholder="Your Name">
	 <button class="OK-button">join</button>
	   				<span>vs</span><span id="enemy-room1">no player</span>
	   			</form>
	   		</li>
	   	</div>
	   	<div class="room-box3">
	   		<li class="room">
	   			<p>room2</p>
	   			<form id="form2" action="">
		   			<input id="player2-1" class="input" type="text" placeholder="Your Name">
		   			<button class="OK-button">join</button>
	   				<span>vs</span><span id="enemy-room2">no player</span>
	   			</form>
	   		</li>
	   	</div>'));
	
	/* room1の表記を追加 */
	/*
	$("#room1").append($('<p>room1</p><form id="form1" action=""><input id="player1-1" class="input" type="text" placeholder="Your Name"><button class="OK-button">join</button><span>vs</span><span id="enemy-room1">no player</span></form>'));
	
	*/
	
}

	   					
	   					
	   					
	   				