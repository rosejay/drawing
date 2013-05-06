


var lineWidth = 5;
var totalwidth = 210;
var avgwidth = 30;

var picWidth, picHeight;
var canvas;


var c=document.getElementById("canvas");
var ctx=c.getContext("2d");
ctx.fillStyle="#FF0000";

var testerNum = 9;
var experimentNum = 3;
var isExist = [[1,0,0],
			   [1,0,0],
			   [1,1,0],
			   [0,0,0],
			   [1,1,0],
			   [0,0,0],
			   [0,0,0],
			   [0,0,0],
			   [0,0,0]];

var eyeData = [];
var eyeResult = [];
var count = 0;
var control;

/*
$("#sourceImg").attr("src", imgFile);
$("#sourceImg").load(function() {

	picWidth  = this.width;   // Note: $(this).width() will not
	picHeight = this.height; // work for in memory images.
	$("#canvas").attr("width", picWidth);
	$("#canvas").attr("height", picHeight);


	$(".dataArea").css("width", picWidth).css("height", picHeight).css("zoom", 0.8);

	canvas = oCanvas.create({
		canvas: "#canvas",
		fps: 10
	});

	
	

}); 
*/
initData();

function newPage(tester, experiment){
	control = new Controller( eyeData[tester][experiment], eyeResult[tester][experiment], tester, experiment );
}





function initData(){

	var tempData = []

	// get data
	for(var i = 0; i < testerNum; i++){

		eyeData[i] = [];
		for(var j = 0; j < experimentNum; j++){
			eyeData[i][j] = [];
			if(isExist[i][j])
				getData(i,j);
			//tempData.push("experiment-" + i + "-" + j);

		}
	}

/*
	async.each(tempData, getData, function(err){
		console.log("dddddd")
	});
*/
	
}
function initResult(){

	// get result
	for(var i = 0; i < testerNum; i++){

		eyeResult[i] = [];
		for(var j = 0; j < experimentNum; j++){
			if(isExist[i][j]){
				eyeResult[i][j] = new myResult( eyeData[i][j], i, j );
				eyeResult[i][j].init();
			}
			
			//eyeResult[i][j].ui();
		}
	}
	console.log("data done")
	
}

setTimeout(function(){
	newPage(4,1)
},1000);

var myData = function( type, duration, frame, p1, p2, p3, p4, speed){

	this.type = type;
	this.duration = duration;
	this.frame = frame;
	this.startX = p1;
	this.startY = p2;

	this.endX = p3;
	this.endY = p4;
	this.speed = speed;
	this.isIn = true;
	this.shape = [];
}

var myResult = function( data, tester, experiment ){

	this.tester = tester;
	this.experiment = experiment;
	this.title = "Tester " + tester + " - Experiment " + experiment;
	this.src = "data/" + tester + "-" + experiment;
	this.data = data;

	this.txtFile = this.src + ".txt";
	this.imgFile = this.src + ".jpg";

	// get img width and height
	var self = this;
	var $img = $("<img />");
	$img.attr("src", this.imgFile);
	$img.load(function() {

		self.picWidth  = this.width;   // Note: $(this).width() will not
		self.picHeight = this.height; // work for in memory images.
		console.log("ddd",self.picWidth, self.picHeight)
	}); 

	this.fixTime = 0;
	this.fixNum = 0;
	this.fixAvg = 0;
	this.fixPerc = 0;

	this.sacTime = 0;
	this.sacNum = 0;
	this.sacAvg = 0;
	this.sacPerc = 0;

	this.outTime = 0;
	this.outNum = 0;
	this.outAvg = 0;
	this.outPerc = 0;

	this.totalTime = 0;
	this.totalNum = 0;
	this.totalFrame = 0;

}
myResult.prototype.init = function() {

	// check if data is in view
	for(var i = 0; i<this.data.length; i++){

		if(this.data[i].type == 1){

			if( !this.isIn(this.data[i].startX, this.data[i].startY) ){
				this.data[i].isIn = false;
				this.outTime += this.data[i].duration;
				this.outNum ++;
			}
			else{
				this.fixTime += this.data[i].duration;
				this.fixNum ++;
			}
		}
		else if(this.data[i].type == 2){

			if( !( this.isIn(this.data[i].startX, this.data[i].startY) && this.isIn(this.data[i].endX, this.data[i].endY) ) ){
				this.data[i].isIn = false;
				this.outTime += this.data[i].duration;
				this.outNum ++;
			}
			else{
				this.sacTime += this.data[i].duration;
				this.sacNum ++;
			}
		}
		this.totalTime += this.data[i].duration;
		this.totalNum ++;
	}

	this.fixPerc = Math.ceil(this.fixTime / this.totalTime * 100);
	this.sacPerc = Math.floor(this.sacTime / this.totalTime * 100);
	this.outPerc = parseInt(this.outTime / this.totalTime * 100);

	this.totalFrame = this.data[i-1].frame;

	this.fixAvg = this.fixTime / this.fixNum ;
	this.sacAvg = this.sacTime / this.sacNum ;
	

	if(this.outNum != 0)
		this.outAvg = this.outTime / this.outNum ;
	else
		this.outAvg = 0;
	

}
myResult.prototype.isIn = function(x,y){

	if( x<0 || x>picWidth || y<0 || y>picHeight )
		return false;
	return true;

}
myResult.prototype.ui = function() {


	$("#sourceImg").attr("src", this.imgFile);
		
	$("#canvas").attr("width", this.picWidth);
	$("#canvas").attr("height", this.picHeight);

	$(".dataArea").css("width", this.picWidth).css("height", this.picHeight);

	canvas = oCanvas.create({
		canvas: "#canvas",
		fps: 10
	});

/*
	if(window.devicePixelRatio == 2) {
        $("#canvas").attr("width", this.picWidth*2);
		$("#canvas").attr("height", this.picHeight*2);
        $("#canvas").css('width', this.picWidth);
        $("#canvas").css('height', this.picHeight);

        var ctx = document.getElementById('canvas').getContext('2d');
        ctx.scale(2, 2);
    }
    */

	$(".timeline").css("width", controlWidth + "px");

	$(".timeData.down .first").html("00:00:00");
	var total = getTime(this.totalTime);
	$(".timeData.down .last").html(total);
	$(".down.first-frame").html("0");
	$(".down.last-frame").html(this.totalFrame);


	$("#title").html(this.title);
	
	
	if(this.fixTime > this.sacTime){

		$(".mylegend ul li .sac.total").css("width", totalwidth * this.sacTime / this.fixTime + "px");
		$(".mylegend ul li .red.total").css("width", (totalwidth * this.outTime / this.fixTime)+70 + "px");

	}
	else{
		$(".mylegend ul li .fix.total").css("width", totalwidth * this.fixTime / this.sacTime + "px");
		$(".mylegend ul li .red.total").css("width", (totalwidth * this.outTime / this.sacTime)+70 + "px");

	}
		
	if(this.fixAvg > this.sacAvg){
		$(".mylegend ul li .sac.total .avg").css("width", avgwidth * this.sacAvg / this.fixAvg + "px");
		$(".mylegend ul li .red.total .avg").css("width", avgwidth * this.outAvg / this.fixAvg + "px");
	}
	else{
		$(".mylegend ul li .fix.total .avg").css("width", avgwidth * this.fixAvg / this.sacAvg + "px");
		$(".mylegend ul li .red.total .avg").css("width", avgwidth * this.outAvg / this.sacAvg + "px");
	}
		


	$(".mylegend ul li .fix.total .data .data-num").html(this.fixAvg.toFixed(2) + " s");
	$(".mylegend ul li .fix.perc .data-perc").html(this.fixPerc + " %");
	$(".mylegend ul li .fix.perc .data-time").html(getTime(this.fixTime));

	$(".mylegend ul li .sac.total .data .data-num").html(this.sacAvg.toFixed(2) + " s");
	$(".mylegend ul li .sac.perc .data-perc").html(this.sacPerc + " %");
	$(".mylegend ul li .sac.perc .data-time").html(getTime(this.sacTime));


	$(".mylegend ul li .red.total .data .data-num").html(this.outAvg.toFixed(2) + " s");
	$(".mylegend ul li .red.perc .data-perc").html(this.outPerc + " %");
	$(".mylegend ul li .red.perc .data-time").html(getTime(this.outTime));

}


function getData(tester, experiment){

	var title = "data/" + tester + "-" + experiment;
	var txtFile = title + ".txt";
	var imgFile = title + ".jpg";

	var newData = [];
	count ++;
	$.get(txtFile, function(data) {

		count --;

        var lines = data.split("\n");

        $.each(lines, function(n, elem) {
            
        	if(elem.substring(0,1) == 2 || elem.substring(0,1) == 1){
        		var arr = elem.split("\t");

        		if(arr[0] == 2){
        			newData.push( new myData(parseInt(arr[0]), parseFloat(arr[1]), parseInt(arr[2]), parseInt(arr[3]), parseInt(arr[4]), parseInt(arr[5]), parseInt(arr[6]), parseInt(arr[7])) );
        		}
        		else if(arr[0] == 1){
        			newData.push( new myData(parseInt(arr[0]), parseFloat(arr[1]), parseInt(arr[2]), parseInt(arr[3]), parseInt(arr[4])) );
        		}
        	}

        	if(n>=2){
        		
        		var num = n-1;
        		var index = n-2;

                // fix & fix
                if(newData[num].type == 1 && newData[index].type == 1){
                    
                    // nothing
                }
                // sac & fix || sac & sac
                else if((newData[num].type == 1 && newData[index].type == 2)
                     || (newData[num].type == 2 && newData[index].type == 2)){
                    
                    var x = parseInt((newData[index].endX + newData[num].startX) / 2);
                    var y = parseInt((newData[index].endY + newData[num].startY) / 2);

                    newData[index].endX = x;
                    newData[index].endY = y;
                    newData[num].startX = x;
                    newData[num].startY = y;
                }
                // fix & sac
                else if(newData[num].type == 2 && newData[index].type == 1){
                    
                    var x = parseInt((newData[index].startX + newData[num].startX) / 2);
                    var y = parseInt((newData[index].startY + newData[num].startY) / 2);

                    newData[index].startX = x;
                    newData[index].startY = y;
                    newData[num].startX = x;
                    newData[num].startY = y;
                }
            }


        });
		
		eyeData[tester][experiment] = newData;
		if(count == 0){
			initResult();
		}

		//return newData;
		//kalman(newData);
		//getIsIn();
		//calculation();

		//console.log(newData);
		//createLines();
/*
		var control = new Controller();
		control.initLines(newData);
		*/


    });
}

function getTime(item){

	var minute = parseInt(item/60);
	var second = parseInt(item%60);
	var misecond = parseInt( (item - parseInt(item)) * 60 );

	if(minute < 10)
		minute = "0" + minute;
	if(second < 10)
		second = "0" + second;
	if(misecond < 10)
		misecond = "0" +  misecond;

	return minute + ":" + second + ":" + misecond;
}
