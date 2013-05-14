

var Comparison = function( tester ){

	this.isTask = [0,0,0];
	this.data = [];

	for(var i = 0; i<experimentNum; i++){
		if(isExist[tester][i] == 1 || isExist[tester][i] == 3){
			this.data[i] = eyeData[tester][i];
			this.isTask[i] = 1;
		}
		else{
			this.data[i] = 0;
		}
	}
	this.len = 10;
	this.tester = tester;
	this.max = 0;
	this.count = 0;

	this.taskColor1 = "rgba(88,115,145,0.5)";
	this.taskColor2 = "rgba(129,198,224,0.5)";
	this.taskColor3 = "rgba(134,182,62,0.5)";
	this.outColor = "#e87461";
	this.grayColor = "rgba(170,170,170,0.5)";
	this.bgColor = "#f5f4f0";

	this.canvas = oCanvas.create({
		canvas: "#threecanvas",
		fps: 30
	});

	this.playInterval;
	this.start();

	var self = this;
	$("#comparison h3").click(function(){
		self.count = 0;
	})
}
Comparison.prototype.dispose = function() {

	this.canvas.reset();
	window.clearInterval(this.playInterval);

	$("#comparison .testerRight ul li.active").unbind("click");
	$("#comparison .tester-playbtn2").unbind("click");
	$("#comparison h3").unbind("click");
}

Comparison.prototype.start = function() {

	this.initShape();
	this.maxFrame();
	this.ui();
	this.play();
}
Comparison.prototype.maxFrame = function() {

	for(var i = 0; i<experimentNum; i++){
		if(this.data[i]){
			var temp = this.data[i][this.data[i].length - 1].frame;
			if(temp > this.max)
				this.max = temp;
		}
	}
}
Comparison.prototype.ui = function() {

	var self = this;
	$("#comparison .testerRight h3 span").html(this.tester);

	if($("#comparison .testerRight ul li.task1").hasClass("active")){

	}
	for(var i = 0; i<experimentNum; i++){
		if(this.isTask[i]){
			$("#comparison .testerRight ul li.task"+(i+1)).addClass("active").addClass("curTester");
		}
		else{
			$("#comparison .testerRight ul li.task"+(i+1)).removeClass("active");
		}
	}

	$("#comparison .testerRight ul li.active").click(function(){

		var index = $(this).attr("index");
		if($(this).hasClass("curTester")){
			$(this).removeClass("curTester");
		}
		else{
			$(this).addClass("curTester");
		}
		self.isTask[index] = !self.isTask[index];
		
	})
	
	$("#comparison .tester-playbtn2").click(function(){
		console.log("d")
		if($(this).hasClass("stop")){
			self.stop();
			$(this).removeClass("stop").addClass("play");
		}
		else{
			self.play();
			$(this).removeClass("play").addClass("stop");
		}
	})
}
Comparison.prototype.stop = function() {
	window.clearInterval(this.playInterval);
	$("#comparison .tester-playbtn2").removeClass("stop").addClass("play");
}
Comparison.prototype.play = function() {
	
	this.stop();
	$("#comparison .tester-playbtn2").removeClass("play").addClass("stop");

	var self = this;
	
	
	this.playInterval = setInterval(function(){

		if(self.count <= self.max){
			self.draw(self.count);
			self.count ++;
		}
		else{
			self.count = 0;
		}

	},1000/30.0);

}
Comparison.prototype.draw = function(frame){

	this.canvas.reset();
	
	for(var i = 0; i< experimentNum; i++){
		if(this.isTask[i]){
			
			var maxF = this.data[i][this.data[i].length - 1].frame;
			var index = this.binarySearch(frame,i);
			var temp = index + this.len ;

			if(this.data[i][temp] == undefined){

			}
			else{

				for(var j = index; j<temp; j++){
					for(var n = 0; n<this.data[i][j].shape.length; n++){
						this.canvas.addChild(this.data[i][j].shape[n]);

					}
				}
					
			}
				
		}
	}
	$("#comparison .timeBox p.testerFrame").html(frame);
	$("#comparison .timeBox p.testerTime").html(this.getTime(frame));

			

}
Comparison.prototype.initShape = function() {

	for(var j = 0; j<experimentNum; j++){
		
		if(this.data[j]){
			for(var i = 0; i< this.data[j].length; i++){

				if(this.data[j][i].isBroken){
					color = this.grayColor;
				}
				else{
					if(j == 0)
						color = this.taskColor1;
					else if(j == 1)
						color = this.taskColor2;
					else if(j == 2)
						color = this.taskColor3;
				}


				// draw
				if(this.data[j][i].type == 2){

					var line = this.canvas.display.line({
						start: { x: this.data[j][i].startX, y: this.data[j][i].startY },
						end: { x: this.data[j][i].endX, y: this.data[j][i].endY },
						stroke: "5px " + color,
						cap: "round"
					});
					this.data[j][i].shape.push(line);

					var rotation = Math.atan((this.data[j][i].startY - this.data[j][i].endY) / (this.data[j][i].startX - this.data[j][i].endX)) /(Math.PI/180);
					if(this.data[j][i].startX - this.data[j][i].endX < 0)
						rotation += 360;
					else if(this.data[j][i].startY - this.data[j][i].endY < 0)
						rotation += 180;
					else 
						rotation += 180;

					var triangle = this.canvas.display.polygon({
						x: this.data[j][i].endX,
						y: this.data[j][i].endY,
						sides: 3,
						radius: 8,
						rotation: rotation,
						fill: color
					});
					this.data[j][i].shape.push(triangle);

				}
				else if(this.data[j][i].type == 1){

					var radius = parseInt(this.data[j][i].duration * 30);
		        	var ellipse = this.canvas.display.ellipse({
						x: this.data[j][i].startX,
						y: this.data[j][i].startY,
						radius: radius,
						fill: color
					});
		        	this.data[j][i].shape.push(ellipse);

				}	
				

				
			}

		}
			
	}
		
}
Comparison.prototype.binarySearch = function(n,i){


	var low = 0; 
	var high = this.data[i].length-1; 

	if(n<=this.data[i][0].frame)
		return 0;
	else
		while(low <= high) { 
			var middle = Math.floor((low + high)/2); 
			if(middle == 0){
				return 1;
			}
			if(n > this.data[i][middle-1].frame && n <= this.data[i][middle].frame) { 
				return middle; 
			}else if(n <this.data[i][middle].frame) { 
				high = middle - 1; 
			}else { 
				low = middle + 1; 
			} 
	　　}
}
Comparison.prototype.getTime = function(item){

	var minute = parseInt(item/60);
	var second = parseInt(item%60);
	var misecond = parseInt( (item - parseInt(item)) * 60 );

	if(minute < 10)
		minute = "0" + minute;
	if(second < 10)
		second = "0" + second;
	if(misecond < 10)
		misecond = "0" +  misecond;

	return minute + ":" + second + " s";
}