

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
	this.width = 1000;
	this.controlWidth = 10;

	this.update();

	var self = this;
	$("#leftControl").mousedown(function(e){
		e.preventDefault();
		self.isMoveLeft = true;
		self.mouseX = e.pageX;
		self.tempX = self.leftX;
	});

	$("#leftControl").mousemove(function(e){
		if(self.isMoveLeft){

			self.leftX = self.tempX + e.pageX - self.mouseX;
			self.update();
		}
	});

	$("#rightControl").mousedown(function(e){
		e.preventDefault();

		self.isMoveRight = true;
		self.mouseX = e.pageX;
		self.tempX = self.rightX;

	});

	$("#rightControl").mousemove(function(e){
		if(self.isMoveRight){

			self.rightX = self.tempX + e.pageX - self.mouseX;
			self.update();
		}
	});
	$("body").mousemove(function(e){

		if(self.isMoveLeft){

			self.leftX = self.tempX + e.pageX - self.mouseX;
			self.update();
		}
		if(self.isMoveRight){

			self.rightX = self.tempX + e.pageX - self.mouseX;
			self.update();
		}
		if(self.isMoveMid){

			
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
	});

	// move middle controller
	$("#midControl").mousedown(function(e){
		e.preventDefault();
		
		self.isMoveMid = true;
		self.mouseX = e.pageX;
		self.tempX = self.leftX;
		self.tempWidth = self.rightX - self.leftX;
	})
	$("#midControl").mousemove(function(e){
		if(self.isMoveMid){

			$(this).css("cursor", "move");

			self.leftX = self.tempX + e.pageX - self.mouseX;
			self.rightX = self.tempWidth + self.leftX;
			self.update();
		}
	});
}


Controller.prototype.update = function() {

	//console.log("l:"+ this.leftX + "  r:" + this.rightX)
	$("#leftControl").css("left", (this.leftX-5) + "px");
	$("#rightControl").css("left", (this.rightX-5) + "px");

	$("#midControl-l").css("width", this.leftX + "px");
	$("#midControl").css("width", (this.rightX - this.leftX) + "px");
	$("#midControl-r").css("width", (this.width - this.rightX) + "px");
	this.updateZoomLines();
}

Controller.prototype.initLines = function(data){

	var n = data[data.length-1].frame;
	var count = 0;

	for(var i = 0; i<n; i++){

		if(i >= data[count+1].frame){
			count ++;

			var width = (data[count].frame - data[count-1].frame)/n * 1000 - 1;

			var $li = $("<li></li>").css("width",width+"px");

			if(data[count].type == 1)
				$li.addClass("fix");
			else
				$li.addClass("sac");

			$(".lines.normal ul").append($li);
			
		}

	}

}
Controller.prototype.updateZoomLines = function(){
	
	if(this.rightX - this.leftX != 0){

		var zoom = this.width / (this.rightX - this.leftX);
		var self = this;

		$(".lines.zoom ul").html("");
		
		$(".lines.normal ul li").each(function( index ) {
			
			var x = $(this).position().left;
			if(x >= self.leftX && x <= self.rightX){
				var width = parseFloat($(this).css("width")) * zoom;

				var $li = $("<li></li>").css("width",width+"px");

				if($(this).hasClass("fix"))
					$li.addClass("fix");
				else if($(this).hasClass("sac"))
					$li.addClass("sac");

				$(".lines.zoom ul").append($li);
			}
				
		});

	}
		

}
