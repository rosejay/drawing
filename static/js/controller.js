
var winwidth = window.innerWidth,	// windows width
	winheight = window.innerHeight;	// windows height

// class marker
var Controller = function(  ){

	this.isMoveLeft = false;
	this.isMoveRight = false;
	this.isMoveMid = false;
	this.leftX = 0;
	this.rightX = 200;

	this.mouseX = 0;
	this.tempX = 0;
	this.tempWidth = 0;
	// ui
	this.width = winwidth;
	this.controlWidth = 20;
	this.max = newData[newData.length - 1].frame;

	this.total = 0;
	for(var i = 0; i<newData.length; i++){
		this.total += newData[i].duration;
	}
	$(".timeData .last").html(this.total.toFixed(2));
	$(".timeline").css("width", winwidth + "px");

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

	$("body").mousemove(function(e){

		if(self.isMoveLeft || self.isMoveRight || self.isMoveMid){

			if(self.isMoveLeft){

				self.leftX = self.tempX + e.pageX - self.mouseX;
			}
			if(self.isMoveRight){

				self.rightX = self.tempX + e.pageX - self.mouseX;
			}
			if(self.isMoveMid){

				self.leftX = self.tempX + e.pageX - self.mouseX;
				self.rightX = self.tempWidth + self.leftX;
			}
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

		self.mouseX = 0;
		self.tempX = 0;
		self.tempWidth = 0;
	});

}


Controller.prototype.update = function() {

	//console.log("l:"+ this.leftX + "  r:" + this.rightX)
	$("#leftControl").css("left", (this.leftX-this.controlWidth/2) + "px");
	$("#rightControl").css("left", (this.rightX-this.controlWidth/2) + "px");

	$("#midControl-l").css("width", this.leftX + "px");
	$("#midControl").css("width", (this.rightX - this.leftX) + "px");
	$("#midControl-r").css("width", (this.width - this.rightX) + "px");
	this.updateZoomLines();
	this.draw();
}

Controller.prototype.check = function() {

	// right
	if(this.rightX > this.width)
		this.rightX = this.width;
	else if(this.rightX < this.leftX + 20)
		this.rightX = this.leftX + 20;
	
	// left
	if(this.leftX < 0)
		this.leftX = 0;
	else if(this.leftX >= this.rightX - 20)
		this.leftX = this.rightX - 20;

	// mid
	if(this.rightX < this.leftX + this.tempWidth)
		this.rightX = this.leftX + this.tempWidth;
	if(this.leftX > this.rightX - this.tempWidth)
		this.leftX = this.rightX - this.tempWidth
}

Controller.prototype.initLines = function(data){

	var n = data[data.length-1].frame;
	var count = 0;

	for(var i = 0; i<n; i++){

		if(i >= data[count+1].frame){
			count ++;

			var width = (data[count].frame - data[count-1].frame)/n * this.width - 1;
			var ratio = width / this.width * 100;
			var $li = $("<li></li>").css("width",ratio+"%");


			if(data[count].type == 1){

				if( data[count].isIn )
					$li.addClass("fix");
				else
					$li.addClass("red");

			}
			else{

				if( data[count].isIn )
					$li.addClass("sac");
				else
					$li.addClass("red");
			}

			$(".lines ul").append($li);
		}

	}

	$(".lines.zoom ul li").hover(
		function () {
			var x = $(this).offset().left;
			if(x<0)
				x = 0;
			console.log(x)
			$(".frameTip").css("display", "block")
						  .css("left", x + "px");
		},
		function () {
			$(".frameTip").css("display", "none");
		}
	);
	

}
Controller.prototype.isIn = function(x,y){

	if( x<0 || x>picWidth || y<0 || y>picHeight )
		return false;
	return true;

}
Controller.prototype.updateZoomLines = function(){
	
	if(this.rightX - this.leftX != 0){

		var zoom = this.width / (this.rightX - this.leftX);
		var self = this;

		$(".lines.zoom ul").css("width", this.width * zoom).css("left", (-this.leftX*zoom)+"px");
		
		

	}
		

}

Controller.prototype.draw = function(a,b){
	console.log("draw")
	canvas.reset();

	var a = parseInt(this.leftX * this.max / this.width);
	var b = parseInt(this.rightX * this.max / this.width);

	var segmentNum = 0;
	var segmentTime = 0;

	for(var i = 0; i< newData.length; i++){

		if(newData[i].frame >= a && newData[i].frame <= b){

			segmentNum ++;
			// draw
			if(newData[i].type == 2){

				var line = canvas.display.line({
					start: { x: newData[i].startX, y: newData[i].startY },
					end: { x: newData[i].endX, y: newData[i].endY },
					stroke: "5px #008fbf",
					cap: "round"
				});
				canvas.addChild(line);

				var ellipse = canvas.display.ellipse({
					x: newData[i].startX,
					y: newData[i].startY,
					radius: 8,
					fill: "#0ec2fe"
				});
				canvas.addChild(ellipse);

				var ellipse = canvas.display.ellipse({
					x: newData[i].endX,
					y: newData[i].endY,
					radius: 8,
					fill: "#0ec2fe"
				});

				canvas.addChild(ellipse);

			}
			else if(newData[i].type == 1){

	        	var ellipse = canvas.display.ellipse({
					x: newData[i].startX,
					y: newData[i].startY,
					radius: 8,
					fill: "#0ec2fe"
				});

				canvas.addChild(ellipse);

			}	
			segmentTime += newData[i].duration;


		}



	}

	$("#segmentN span").html(segmentNum + "&nbsp;&nbsp;&nbsp;");
	$("#segmentD span").html(segmentTime.toFixed(2) + " s");


}



