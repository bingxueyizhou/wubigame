//main script

var STATE = {
	STARTED : true,
	STOPPED  : false
}
var BLOCK = function(){
	this.gid = 0;
	this.x   = 0;
	this.y   = 0;
	this.item= 0; 
}

var SCENE = {
	__size 		: 0,
	__MAX_SIZE 	: 8,
	__gidIndex  : 0,
	__canvas    : null,
	__blockArray : null,
	__WORD_SIZE_X : 32,
	__WORD_SIZE_Y : 32,
	__MOVE_X_STEP : 1,

	_getRandomX : function(){
		//I don't know why $("#canvas-body").width() can't be used.
		var canvas = document.getElementById('canvas-body');
		return canvas.width;
	},
	_getRandomY : function(){
		var canvas = document.getElementById('canvas-body');
		var center = Math.ceil(canvas.height/2);
		return (Math.ceil(Math.random()*200-100)+center);
	},
	_getRandomItem : function(){
		return (Math.ceil(Math.random()*DATA.length));
	},


	logic : function(){
		//左移动
		//*
		for (var i = 0; i < SCENE.__size; i++) {
			SCENE.__blockArray[i].x -= SCENE.__MOVE_X_STEP;
			if (SCENE.__blockArray[i].x <= 0){
				//超出左屏幕删除
				SCENE.delete(SCENE.__blockArray[i].gid);
			}
		}
		//*/
		SCENE.clearCanvas();

		SCENE.drawCanvas();
	},
	clearCanvas : function(){
		var x = window.screen.availWidth;
		var y = window.screen.availHeight;
		SCENE.__canvas.clearRect(0,0,x,y);
	},
	clearRectCanvas : function(_x,_y){
		//TODO 只删除部分区域
	},
	drawCanvas : function(){
	    SCENE.__canvas.font="bold 16px Arial";    
	    SCENE.__canvas.fillStyle="#111";
	    //*
	    for (var i = 0; i < SCENE.__blockArray.length; i++) {
	    	//console.log(DATA[SCENE.__blockArray[i].item].name,SCENE.__blockArray[0].x,SCENE.__blockArray[0].y)
	    	SCENE.__canvas.fillText(
	    			DATA[SCENE.__blockArray[i].item].name,
	    			SCENE.__blockArray[i].x,
	    			SCENE.__blockArray[i].y);
	    };
	    //*/
	},
	initialize : function(){
		SCENE.__size       = 0;
		SCENE.__MAX_SIZE   = 8;
		SCENE.__gidIndex   = 0;
		SCENE.__blockArray = new Array();
		var htmlCanvas = document.getElementById('canvas-body');
		htmlCanvas.width = window.screen.availWidth;
		htmlCanvas.height = window.screen.availHeight - 100;
		SCENE.__canvas = htmlCanvas.getContext('2d');
	},
	add : function(id){
		//TODO check id is right.
		if (id < 0) return;
		if (id > DATA.length) return;
		SCENE.__gidIndex ++;
		var blk = new BLOCK();
		blk.gid  = SCENE.__gidIndex;
		blk.item = id;
		blk.x    = SCENE._getRandomX();
		blk.y    = SCENE._getRandomY();
		console.log(blk.x,blk.y,blk.item);
		SCENE.__blockArray.push(blk);
		SCENE.__size++;
	},
	delete : function(gid){
		for (var i = 0; i < SCENE.__blockArray.length; i++) {
			if (SCENE.__blockArray[i].gid === gid){
				SCENE.__blockArray.splice(i,1);
				SCENE.__size--;
				break;
			}
		};
	},

	size : function(){
		return SCENE.__size;
	}
};

var GAME={
	__gameState : STATE.STOPPED,
	__gameSpead : 0.2,
	__timeCount : 0,
	__BASE_SPEAD : 10,
	__MAX_GAME_SPEAD  : 5.0,
	__MIN_GAME_SPEAD  : 0.2,
	__STEP_GAME_SPEAD : 20,

	_timeloop : function(){
		if (GAME.__gameState ===  STATE.STARTED){
			GAME.__timeCount ++;

			if ( (GAME.__timeCount*GAME.__gameSpead) >= GAME.__BASE_SPEAD){
				GAME.__timeCount = 0;
				GAME._speadCall();
			}
			GAME._logicCall();
			setTimeout("GAME._timeloop()",GAME.__STEP_GAME_SPEAD);
		}
	},
	_speadCall : function(){
		SCENE.add(SCENE._getRandomItem());
	},
	_logicCall : function(){
		SCENE.logic();
	},
	_resetGameValue : function(){
		GAME.__timeCount = 0;
		GAME.__gameState = STATE.STOPPED;
		GAME.__gameSpead = GAME.__MIN_GAME_SPEAD;
	},


	speadUp : function(){
		if (GAME.__gameSpead <= GAME.__MAX_GAME_SPEAD){
			GAME.__gameSpead += 0.1;
		}
	},
	speadDown : function(){
		if (GAME.__gameSpead > GAME.__MIN_GAME_SPEAD){
			GAME.__gameSpead -= 0.1;
		}
	},
	playSound : function(){
		var au_success 		= document.createElement("audio");
		au_success.preload  = "auto";
		au_success.src      = "suc.wav";
	    au_success.play();
	},
	start : function(){
		if(GAME.__gameState === STATE.STARTED) return false;
		GAME.__gameState = STATE.STARTED;
		GAME._timeloop();
	},
	pause : function(){

	},
	stop : function(){
		if(GAME.__gameState === STATE.STOPPED) return false;
		GAME.__gameState = STATE.STOPPED;
		GAME._resetGameValue();
	},
	initListener : function(){
		$("#bu-start").click(function(){
			GAME.playSound();
			GAME.start();
		});

		$(document).keydown(function (event) {
			console.log(event.keyCode);
			for (var i = 0; i < SCENE.__blockArray.length; i++) {
	    		if (DATA[SCENE.__blockArray[i].item].keyCode == event.keyCode){
	    			GAME.playSound();
	    			SCENE.delete(SCENE.__blockArray[i].gid);
	    			break;
	    		}
	    	};

			if (event.ctrlKey && event.keyCode == 13) {
		        alert('Ctrl+Enter');
		    };
		    switch (event.keyCode) {
		    case 187:
		        console.warn('加速');
		        GAME.speadUp();
		        break;
		    case 189:
		        console.warn('减速');
		        GAME.speadDown();
		        break;
		    };
		    return false;
		});
	} 
}


///////////////////////////////////////////////////////////////
/**  初始化事件  **/
SCENE.initialize();
GAME.initListener();


SCENE.drawCanvas();