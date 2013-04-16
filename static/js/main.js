

var title = "output";
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

	//calculation();

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
		
		kalman(newData);

		//console.log(newData);
		//createLines();

		var control = new Controller();
		control.initLines(newData);
		//drawData();
		$( "#slider-range" ).slider({
			range: true,
			min: 0,
			max: newData[newData.length - 1].frame,
			values: [ 0, 10 ],
			step: 1,
			change: function( event, ui ) {
				
				canvas.reset();
				drawData(ui.values[ 0 ],ui.values[ 1 ]);

			}
		});

    });
}


function calculation(){


	$("#datacanvas").attr("width", "300px");
	$("#datacanvas").attr("height", picHeight*0.8);

	var canvas = oCanvas.create({
		canvas: "#datacanvas"
	});

	// add title
	var text = canvas.display.text({
		x: 20,
		y: 20,
		origin: { x: "left", y: "top" },
		font: "30px HelveticaNeue-UltraLight",
		text: title,
		fill: "#aaa"
	});
	canvas.addChild(text);

	// add fix and sac chart
	var fixTime = 0,
		totalTime = 0,
		saccadeTime = 0;

	for(var i = 0; i< newData.length; i++){
		if(newData[i].type == 1)
			fixTime += newData[i].duration;
		totalTime += newData[i].duration;
	}
	saccadeTime = totalTime - fixTime;


	for( i = 0; i<3; i++){


		var rectangle = canvas.display.rectangle({
			x: 77,
			y: 77,
			width: 100,
			height: 30,
			fill: "hsl(195, "+ (100 - i*10) +"%, "+ (50 - i*10) +"%)"
		});

		canvas.addChild(rectangle);
	}



	

	
}









var sectionTime = 0;
function drawData(a, b){

	sectionTime = 0;
	console.log(a,b)

	var startPoint = 0,
		endPoint = 0;

	for(var i = 0; i< newData.length; i++){

		if(newData[i].frame > a && startPoint == 0)
			startPoint = i;
		if(newData[i].frame > b && endPoint == 0)
			endPoint = i;

		if(startPoint && endPoint)
			break;
	}


	for(var i = startPoint; i<endPoint; i++){

		if(newData[i].type == 2){

			var line = canvas.display.line({
				start: { x: newData[i].startX, y: newData[i].startY },
				end: { x: newData[i].endX, y: newData[i].endY },
				stroke: "3px #00bfff",
				cap: "round"
			});

			canvas.addChild(line);
/*
			ctx.moveTo(newData[i].startX, newData[i].startY);
			ctx.lineTo(newData[i].endX, newData[i].endY);
			ctx.stroke();
			*/

		}
		else if(newData[i].type == 1){

        	var ellipse = canvas.display.ellipse({
				x: newData[i].startX,
				y: newData[i].startY,
				radius: 5,
				fill: "#00bfff"
			});

			canvas.addChild(ellipse);
/*
			ctx.beginPath();
			ctx.arc(newData[i].startX,newData[i].startY,5,0,2*Math.PI);
			ctx.stroke();
*/
		}	
		sectionTime += newData[i].duration;

	}
	console.log(sectionTime)
	

}