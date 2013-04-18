

var title = "output-3";
var txtFile = title + ".txt";
var imgFile = title + ".jpg";

var lineWidth = 5;

var picWidth, picHeight;
var canvas;


var c=document.getElementById("canvas");
var ctx=c.getContext("2d");
ctx.fillStyle="#FF0000";




$("#sourceImg").attr("src", imgFile);
$("#sourceImg").load(function() {

	picWidth  = this.width;   // Note: $(this).width() will not
	picHeight = this.height; // work for in memory images.
	$("#canvas").attr("width", picWidth);
	$("#canvas").attr("height", picHeight);

	console.log(picWidth, picHeight);

	$(".dataArea").css("width", picWidth).css("height", picHeight).css("zoom", 0.8);

	canvas = oCanvas.create({
		canvas: "#canvas",
		fps: 10
	});

	getData();


}); 

// init
var newData = [];






var myData = function( type, duration, frame, p1, p2, p3, p4){

	this.type = type;
	this.duration = duration;
	this.frame = frame;
	this.startX = p1;
	this.startY = p2;

	this.endX = p3;
	this.endY = p4;
	this.isIn = true;
}


function getData(){

	$.get(txtFile, function(data) {

        var lines = data.split("\n");

        $.each(lines, function(n, elem) {
            
        	if(elem.substring(0,1) == 2 || elem.substring(0,1) == 1){
        		var arr = elem.split("\t");

        		if(arr[0] == 2){
        			newData.push( new myData(parseInt(arr[0]), parseFloat(arr[1]), parseInt(arr[2]), parseInt(arr[3]), parseInt(arr[4]), parseInt(arr[5]), parseInt(arr[6])) );
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
		
		//kalman(newData);
		getIsIn();
		calculation();

		//console.log(newData);
		//createLines();

		var control = new Controller();
		control.initLines(newData);
		

    });
}


// check if points are in view
function getIsIn(){

	for(var i = 0; i<newData.length; i++){

		if(newData[i].type == 1){

			if( !isIn(newData[i].startX, newData[i].startY) )
				newData[i].isIn = false;
		}
		else if(newData[i].type == 2){

			if( !( isIn(newData[i].startX, newData[i].startY) && isIn(newData[i].endX, newData[i].endY) ) )
				newData[i].isIn = false;
		}
	}

}
function isIn(x,y){

	if( x<0 || x>picWidth || y<0 || y>picHeight )
		return false;
	return true;
}


	// add fix and sac chart
	var fixTime = 0,
		totalTime = 0,
		saccadeTime = 0;
	var fixNum = 0,
		sacNum = 0;

		

function calculation(){


	

	for(var i = 0; i< newData.length; i++){
		if(newData[i].type == 1){
			fixTime += newData[i].duration;
			fixNum ++;
		}
		totalTime += newData[i].duration;
	}
	saccadeTime = totalTime - fixTime;
	sacNum = newData.length - fixNum;

	var sacAvg = saccadeTime / sacNum;
	var fixAvg = fixTime / fixNum;
	var frameNum = newData[newData.length-1].frame;

	$("#totalT span").html(totalTime.toFixed(2) + " s");
	$("#frameN span").html(frameNum + "&nbsp;&nbsp;&nbsp;");

	$(".legend ul li p.fix span.num").html(fixTime.toFixed(2) + " s");
	$(".legend ul li p.sac span.num").html(saccadeTime.toFixed(2) + " s");

	$(".legend ul li p.fix span.avg").html(fixAvg.toFixed(2) + " s");
	$(".legend ul li p.sac span.avg").html(sacAvg.toFixed(2) + " s");
	
	$(".legend ul li p.fix span.perc").html((fixTime/totalTime).toFixed(2) + " %");
	$(".legend ul li p.sac span.perc").html((saccadeTime/totalTime).toFixed(2) + " %");
}





