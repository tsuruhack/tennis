var http = require("http");
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
	if(KeyIsDown(39)){
		console.log("→キーが押されている");
		return 1;
	}else{
		console.log("→キーが離されている");
	}

	// スペースキーが押されているか調べる
	if(KeyIsDown(37)){
		console.log("←キーが押されている");
		return 2;
	}else{
		console.log("←キーが離されている");
	}
	
	return 0;

}
mojule.exports = CheckKeyKind;