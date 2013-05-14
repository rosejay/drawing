
var winwidth = window.innerWidth,	// windows width
	winheight = window.innerHeight;	// windows height

var controlWidth = 1000 ;

// class marker
var Controller = function( data, result, tester, experiment ){

	// Frame
	//this.isFrame = true;
	this.curFrame = 0;
	this.segDiv = 0;
	this.frameWidth = 260;
	this.frameMax = 50;
	this.isMoveFrame = false;

	this.isFix = true;
	this.isSac = true;
	this.isOut = true;

	this.data = data;
	this.result = result;
	this.tester = tester;
	this.experiment = experiment;

	this.isMoveLeft = false;
	this.isMoveRight = false;
	this.isMoveMid = false;
	this.leftX = 0;
	this.rightX = 15;

	this.mouseX = 0;
	this.tempX = 0;
	this.tempWidth = 0;
	// ui
	this.width = controlWidth;
	this.controlWidth = 10;
	this.max = this.data[this.data.length - 1].frame;
	this.smallZoomRatio = this.max / this.width;
	this.bigZoomRatio = 0;

	this.currentPos = 0;
	this.playLength = 10;

	this.sacColor = "#587391";
	this.fixColor = "#81c6e0";
	this.outColor = "#e87461";
	this.grayColor = "#aaa";
	this.bgColor = "#f5f4f0";

	this.playInterval;

	this.canvas = oCanvas.create({
		canvas: "#experimentcanvas",
		fps: 30
	});
	this.canvas.reset();

	this.init();
	this.initShape();
	this.initLines();
	this.initFrame();
	this.update();

	var self = this;
	$("#leftControl").mousedown(function(e){
		e.preventDefault();
		self.isMoveLeft = true;
		self.mouseX = e.pageX;
		self.tempX = self.leftX;
	});

	$("#rightControl").mousedown(function(e){
		e.preventDefault();

		self.isMoveRight = true;
		self.mouseX = e.pageX;
		self.tempX = self.rightX;

	});

	// move middle controller
	$("#midControl").mousedown(function(e){
		e.preventDefault();
		
		self.isMoveMid = true;
		self.mouseX = e.pageX;
		self.tempX = self.leftX;
		self.tempWidth = self.rightX - self.leftX;
	})
	$("body").mousedown(function(e){

		window.clearInterval(self.playInterval);
	})

	$("body").mousemove(function(e){

		if(self.isMoveLeft || self.isMoveRight || self.isMoveMid){

			if(self.isMoveLeft){

				self.leftX = self.tempX + e.pageX - self.mouseX;
				self.checkLeftRight("left");
			}
			if(self.isMoveRight){

				self.rightX = self.tempX + e.pageX - self.mouseX;
				self.checkLeftRight("right");
			}
			if(self.isMoveMid){

				self.leftX = self.tempX + e.pageX - self.mouseX;
				self.rightX = self.tempWidth + self.leftX;
			}
			self.check();
			self.update();

		}
		if(self.isMoveFrame){
			self.adjustFrame(e.pageX - self.tempX);
			self.getRightX();

			self.check();
			self.update();
		}

			
	});
	$("body").mouseup(function(e){

		if(self.isMoveLeft){
			self.isMoveLeft = false;
		}
		if(self.isMoveRight){
			self.isMoveRight = false;
		}
		if(self.isMoveMid){
			self.isMoveMid = false;
		}
		if(self.isMoveFrame)
			self.isMoveFrame = false;

		self.mouseX = 0;
		self.tempX = 0;
		self.tempWidth = 0;
	});
	$("#experiment .play").removeClass("stop");
	$("#experiment .play").click(function(){
		
		if($(this).hasClass("stop")){
			// stop
			$(this).removeClass("stop");
			window.clearInterval(self.playInterval);
			self.draw();
		}
		else{
			// play
			$(this).addClass("stop");
			self.play();
		}
		
	})
/*
	$(".slot .slider").mousedown(function(e){

		if(self.isFrame){
			e.preventDefault();
			
			self.isMoveFrame = true;
			self.mouseX = e.pageX;
			self.tempX = $(".slot").offset().left;
		}
	})
/*
	$(".playBar .FrameControl .checkFrame").click(function(e){
		e.preventDefault();
		if($(this).hasClass("dis")){
			$(this).removeClass("dis");
			$(".playBar .FrameControl .checkFrameDiv").removeClass("dis");
			self.isFrame = true;
		}
		else{
			$(this).addClass("dis");
			$(".playBar .FrameControl .checkFrameDiv").addClass("dis");
			self.isFrame = false;
		}

	})*/
}
Controller.prototype.init = function() {

	this.result.ui();

}
Controller.prototype.dispose = function() {
/*
	var c=document.getElementById("experimentcanvas");
	var ctx=c.getContext("2d");
	ctx.clearRect ( 0,0,600,450 );*/
	this.canvas.reset();
	window.clearInterval(this.playInterval);

	$("#leftControl").unbind("mousedown");
	$("#rightControl").unbind("mousedown");
	$("#midControl").unbind("mousedown");
	$("body").unbind("mousedown");
	$("body").unbind("mousemove");
	$("body").unbind("mouseup");
	$("#experiment .play").unbind("click");

}

Controller.prototype.initShape = function() {

    var self = this;

	for(var i = 0; i< this.data.length; i++){

		// draw
		if(this.data[i].type == 2){

			if(this.data[i].isBroken){
				color = this.grayColor;
			}
			else{
				if(this.data[i].isIn)
					color = this.sacColor;
				else
					color = this.outColor;
			}
				

			var line = this.canvas.display.line({
				start: { x: this.data[i].startX, y: this.data[i].startY },
				end: { x: this.data[i].endX, y: this.data[i].endY },
				stroke: "5px " + color,
				cap: "round"
			});
			this.data[i].shape.push(line);

			var rotation = Math.atan((this.data[i].startY - this.data[i].endY) / (this.data[i].startX - this.data[i].endX)) /(Math.PI/180);
			
			if(this.data[i].startX - this.data[i].endX < 0)
				rotation += 360;
			else if(this.data[i].startY - this.data[i].endY < 0)
				rotation += 180;
			else 
				rotation += 180;

			var triangle = this.canvas.display.polygon({
				x: this.data[i].endX,
				y: this.data[i].endY,
				sides: 3,
				radius: 8,
				rotation: rotation,
				fill: color
			});
			this.data[i].shape.push(triangle);

			triangle.bind("mouseenter touchenter", function () {
				this.radius = this.radius + 3;
				self.canvas.redraw();
			}).bind("mouseleave touchleave", function () {
				this.radius = this.radius - 3;
				self.canvas.redraw();
			}).bind("click tap", function () {
				
			});

		}
		else if(this.data[i].type == 1){

			if(this.data[i].isBroken){
				color = this.grayColor;
			}
			else{
				if(this.data[i].isIn)
					color = this.fixColor;
				else
					color = this.outColor;
			}
				

			var radius = parseInt(this.data[i].duration * 50);
        	var ellipse = this.canvas.display.ellipse({
				x: this.data[i].startX,
				y: this.data[i].startY,
				radius: radius,
				fill: color
			});
        	this.data[i].shape.push(ellipse);

        	ellipse.bind("mouseenter touchenter", function () {
				this.radius = this.radius + 3;
				self.canvas.redraw();
			}).bind("mouseleave touchleave", function () {
				this.radius = this.radius - 3;
				self.canvas.redraw();
			}).bind("click tap", function () {
				
			});
/*
			ellipse.bind("mouseenter touchenter", function () {
				this.radius = 10;
				canvas.redraw();
			}).bind("mouseleave touchleave", function () {
				this.radius = 8;
				canvas.redraw();
			}).bind("click tap", function () {
				
			});
*/
		}	
		
	}

}
Controller.prototype.update = function() {

	$(".slot .slider").css("left", this.framePos + "px");
	$(".checkFrameDiv .c").html(this.curFrame).css("left", this.framePos - 10 + "px")

	// console.log("l:"+ this.leftX + "  r:" + this.rightX)
	$("#leftControl").css("left", (this.leftX-this.controlWidth/2) + "px");
	$("#rightControl").css("left", (this.rightX-this.controlWidth/2) + "px");

	$("#midControl-l").css("width", this.leftX + "px");
	$("#midControl").css("width", (this.rightX - this.leftX) + "px");
	$("#midControl-r").css("width", (this.width - this.rightX) + "px");
	this.updateZoomLines();
	this.draw();
}
Controller.prototype.getNum = function(item){

	var time = item * this.result.totalTime / this.width;
	return this.getTime(time);
}
Controller.prototype.getTime = function(item){

	var minute = parseInt(item/60);
	var second = parseInt(item%60);
	var misecond = parseInt( (item - parseInt(item)) * 10 );

	if(minute < 10)
		minute = "0" + minute;
	if(second < 10)
		second = "0" + second;

	return minute + ":" + second + "." + misecond;
}
Controller.prototype.binarySearch = function(n){

	var low = 0; 
	var high = this.data.length-1; 
	if(n<=this.data[0].frame)
		return 0;
	else
		while(low <= high) { 
			var middle = Math.floor((low + high)/2); 
			if(middle == 0){
				return 1;
			}
			if(n > this.data[middle-1].frame && n <= this.data[middle].frame) { 
				return middle; 
			}else if(n <this.data[middle].frame) { 
				high = middle - 1; 
			}else { 
				low = middle + 1; 
			} 
	　　}
}
Controller.prototype.updateZoomLines = function(){
	
	$(".lines ul").html("");

	var startFrame = parseInt(this.smallZoomRatio * this.leftX);
	var endFrame = parseInt(this.smallZoomRatio * this.rightX);
	var frames = endFrame - startFrame;


	var startN = this.binarySearch(startFrame);
	var endN = this.binarySearch(endFrame);

	this.bigZoomRatio = (this.width - (endN - startN + 1)) / frames;
	var prevFrame = startFrame;
	for(var i = startN; i<endN+1; i++){

		var width = (this.data[i].frame - prevFrame)*this.bigZoomRatio;
		if(i == endN)
			var width = (endFrame - prevFrame)*this.bigZoomRatio;

		var $li = $("<li index='"+i+"'></li>").css("width",width+"px");

		if(this.data[i].type == 1){
			if(this.data[i].isBroken){
				$li.addClass("gray");
			}
			else{
				if( this.data[i].isIn )
					$li.addClass("fix");
				else{
					$li.addClass("red");
				}
			}
				
		}
		else{
			if(this.data[i].isBroken){
				$li.addClass("gray");
			}
			else{
				if( this.data[i].isIn )
					$li.addClass("sac");
				else{
					$li.addClass("red");
				}
			}
				
		}

		prevFrame = this.data[i].frame;

		$(".lines ul").append($li);

	}

	

}

Controller.prototype.checkLeftRight = function(type) {

	var endFrame = parseInt(this.smallZoomRatio * this.rightX);
	var endN = this.binarySearch(endFrame);

	var startFrame = parseInt(this.smallZoomRatio * this.leftX);
	var startN = this.binarySearch(startFrame);

	this.curFrame = endN - startN;
	if(this.curFrame > 50){
		if(type == "left"){
			startN = endN - 50;
			this.leftX = this.data[startN].frame / this.smallZoomRatio;
		}
		else{
			endN = startN + 50;
			this.rightX = this.data[endN].frame / this.smallZoomRatio;
		}
		this.curFrame = 50;
	}

	this.framePos = this.curFrame * this.segDiv;
	

}
Controller.prototype.check = function() {

	// left
	if(this.leftX < 0)
		this.leftX = 0;
	
	// right
	if(this.rightX > this.width)
		this.rightX = this.width;
	else if(this.rightX < this.leftX + this.tempWidth)
		this.rightX = this.leftX + this.tempWidth;
	
	if(this.leftX > this.rightX - this.tempWidth)
		this.leftX = this.rightX - this.tempWidth
}

Controller.prototype.initLines = function(){

	var self = this;
	var n = this.data[this.data.length-1].frame;
	var count = 0;
	var outTime = 0;
	var outNum = 0;

	var c=document.getElementById("smallCanvas");
	c.width = this.max;
	c.height = 10;
	var ctx=c.getContext("2d");

	var prevFrame = 0;
	for(var i = 0; i<this.data.length; i++){

		var width = this.data[i].frame - prevFrame;

		// set color
		if(this.data[i].isBroken){
			ctx.fillStyle=this.grayColor;
		}
		else{
			if(this.data[i].isIn){
				if(this.data[i].type == 1)
					ctx.fillStyle=this.fixColor;
				else if(this.data[i].type == 2)
					ctx.fillStyle = this.sacColor;
			}
			else
				ctx.fillStyle = this.outColor;
		}
			
		

		ctx.fillRect(prevFrame,0,width,10);
		prevFrame = this.data[i].frame;
	}
	
	$("#smallCanvas").css("width", this.width + "px");
	$("#smallCanvas").css("height", "10px");







	/*
	for(var i = 0; i<n; i++){

		if(i >= this.data[count+1].frame){
			count ++;

			var width = (this.data[count].frame - this.data[count-1].frame)/n * this.width - 1;
			var ratio = width / this.width * 100;
			var $li = $("<li index='"+(count-1)+"'></li>").css("width",ratio+"%");

			$li.hover(
				function () {
					var t = $(this).attr("index");
					self.data[t].shape[0].radius += 3;
					self.update();
				},
				function () {
					var t = $(this).attr("index");
					self.data[t].shape[0].radius -= 3;
					self.update();
				}
			);

			if(this.data[count-1].type == 1){

				if( this.data[count-1].isIn )
					$li.addClass("fix");
				else{
					$li.addClass("red");
					outTime += this.data[count-1].duration;
					outNum ++;
				}

			}
			else{

				if( this.data[count-1].isIn )
					$li.addClass("sac");
				else{
					$li.addClass("red");
					outTime += this.data[count-1].duration;
					outNum ++;
				}
					
			}

			$(".lines ul").append($li);
		}

	}

	$(".lines.zoom ul li").hover(
		function () {
			var x = $(this).offset().left;
			if(x<0)
				x = 0;
			$(".frameTip").css("display", "block")
						  .css("left", x + "px");
		},
		function () {
			$(".frameTip").css("display", "none");
		}
	);
	*/
}
Controller.prototype.getRightX = function() {

	var startFrame = parseInt(this.smallZoomRatio * this.leftX);
	var startN = this.binarySearch(startFrame);
	var endN = startN + this.curFrame - 1;
	this.rightX = this.data[endN].frame / this.smallZoomRatio;
}
Controller.prototype.play = function() {

	this.result.ui();
	var div = 1.0/this.smallZoomRatio;
	window.clearInterval(this.playInterval);
	var self = this;
	var count = 0;
	this.playInterval = setInterval(function(){
/*
		if(self.isFrame){
			self.leftX += div;
			self.getRightX();
		}
		else{ */// by time
			self.leftX += div;
			self.rightX += div;
		//}
		self.check();
		self.update();

		if(self.rightX>=self.width)
			window.clearInterval(self.playInterval);

	},1000/30.0);

}
Controller.prototype.initFrame = function(){


	this.segDiv = this.frameWidth/this.frameMax;

	this.countFrame(this.leftX, this.rightX);
}
Controller.prototype.countFrame = function(start, end){

	this.curFrame = end - start + 1;
}
Controller.prototype.setFrame = function(){

	this.framePos = this.curFrame * this.segDiv;
	$(".slot .slider").css("left", this.framePos + "px");
	$(".checkFrameDiv .c").html(this.curFrame).css("left", this.framePos - 10 + "px")
}
Controller.prototype.adjustFrame = function(x){

	if(x >= 0 && x<= this.frameWidth){
		this.curFrame = parseInt(x/this.segDiv);
		this.framePos = this.curFrame * this.segDiv;
	}
	else if(x<0){
		this.curFrame = 0;
		this.framePos = 0;
	}
	else if(x>this.frameWidth){
		this.curFrame = this.frameMax;
		this.framePos = this.frameWidth;
	}
	

	$(".slot .slider").css("left", this.framePos + "px");
	$(".checkFrameDiv .c").html(this.curFrame).css("left", this.framePos - 10 + "px")
}
Controller.prototype.draw = function(){
/*
	if(this.isFrame){
		var a = parseInt(this.leftX * this.smallZoomRatio);
		var startN = this.binarySearch(a);
		var endN = startN + this.curFrame - 1;
	}
	else{*/
		var a = parseInt(this.leftX * this.smallZoomRatio);
		var b = parseInt(this.rightX * this.smallZoomRatio);
		var startN = this.binarySearch(a);
		var endN = this.binarySearch(b);
	//}

	this.countFrame(startN, endN);
	this.setFrame();

	var FrameNum = 0;
	var FrameTime = 0;
	var startFrame = 0;
	var endFrame = 0;
	var isStart = false;

	this.canvas.reset();

	for(var i = startN; i< endN; i++){


		FrameNum ++;

		if(!isStart){
			startFrame = this.data[i].frame;
			isStart = true;
		}
		endFrame = this.data[i].frame;
		// draw
		if( (!this.data[i].isIn && this.isOut) || 
			(this.isFix && this.data[i].type == 1) || (this.isSac && this.data[i].type == 2) )
			for(var n = 0; n<this.data[i].shape.length; n++){
				this.canvas.addChild(this.data[i].shape[n]);

			}

		FrameTime += this.data[i].duration;

	}

	// update time
	var leftTime = this.getNum(this.leftX);
	var rightTime = this.getNum(this.rightX);

	$(".timeData.up .first").html(leftTime);
	$(".timeData.up .last").html(rightTime);

	$(".up.first-frame").html(startFrame);
	$(".up.last-frame").html(endFrame);
	$(".timeData.up .center span").html(this.getNum(this.rightX - this.leftX));


}




$(".mylegend ul li .rect ").click(function(){


	if($(this).hasClass("fix")){
		control.isFix = !control.isFix;
		if(control.isFix){
			$(this).html("<em></em><span>Fixation</span>");
			$(this).parent().css("opacity", 1);
		}
		else{
			$(this).html("<span>Fixation</span>");
			$(this).parent().css("opacity", 0.5);
		}
	}
	else if($(this).hasClass("sac")){
		control.isSac = !control.isSac;
		if(control.isSac){
			$(this).html("<em></em><span>Saccade</span>");
			$(this).parent().css("opacity", 1);
		}
		else{
			$(this).html("<span>Saccade</span>");
			$(this).parent().css("opacity", 0.5);
		}
	}
	else if($(this).hasClass("red")){
		control.isOut = !control.isOut;
		if(control.isOut){
			$(this).html("<em></em><span>Out View</span>");
			$(this).parent().css("opacity", 1);
		}
		else{
			$(this).html("<span>Out View</span>");
			$(this).parent().css("opacity", 0.5);
		}
	}

	control.update();

})








