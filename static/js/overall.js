

var personScore = [];
var taskScore = [0,0,0];
var pageScore = [0,0,0];




var Tester = function(number){
	this.number = number;
	this.experiment = [];

	var n = this.number;
	this.sex = sexInfo[n];
	this.frequency = frequencyInfo[n];
	
	for(var i = 0; i<experimentNum; i++){
		this.experiment[i] = new Experiment(taskOrder[n][i], articleOrder[n][i], scoreOrder[n][i]);
	}
}
var Experiment = function(task, article, score){
	this.task = task;
	this.article = article;
	this.score = score;
}

var tester = [];
for(var i = 0; i<testerNum; i++){
	tester[i] = new Tester(i);
}



// person - chart
for(var i = 0; i<testerNum; i++){

	$li = $("<li index='"+i+"'></li>");
	
	if(!sexInfo[i]){
		$li.addClass("female");
	}
	$li.hover(
		function () {
			var index = $(this).attr("index");
			$(this).parent().parent().children(".notes").children("p").html(personInfo[index]);

			$(this).parent().parent().children(".notes").children("span").css("left", index*30 + 35);
		},
		function () {
			$(this).find("span:last").remove();
		}
	);
	$(".people-chart ul.person").append($li);
	if(i == 0)
		$li.parent().parent().children(".notes").children("p").html(personInfo[i]);

	// add frequency
	$li = $("<li index='"+i+"' class='frequency"+tester[i].frequency+"'></li>");
	$(".people-chart ul.frequency").append($li);
	$li.hover(
		function () {
			var index = $(this).attr("index");
			$(this).parent().parent().children(".notes").children("p").html(personInfo[index]);

			$(this).parent().parent().children(".notes").children("span").css("left", index*30 + 35);
		},
		function () {
			$(this).find("span:last").remove();
		}
	);
}




// article - chart
$(".article-chart ul.article").append("<li class='taskScore'><ul></ul></li>");
for(var i = 0; i<testerNum; i++){
	$(".article-chart ul.article").append("<li><ul></ul></li>");
	for(var j = 0; j<experimentNum; j++){

		$li = $("<li class='color"+articleScore[i][j]+"'></li>");
		$(".article-chart ul.article li:nth-child("+(i+2)+") ul").append($li);
		pageScore[j] += articleScore[i][j];
	}
}
for(var i = 0; i<experimentNum; i++){

	$li = $("<li class='article"+(i+1)+"'><div><p></p><div></div></div></li>");
	$li.children("div").children("p").html((pageScore[i]/testerNum).toFixed(2));
	$li.children("div").children("div").css("height", ((pageScore[i]-30)*10)+"px");
	$(".article-chart ul.article .taskScore ul").append($li);
}


$("ul.boxChart").append("<li class='taskScore'><ul></ul></li>");
for(var i = 0; i<testerNum; i++){

	personScore[i] = 0;
	$("ul.boxChart").append("<li><ul></ul></li>");
	for(var j = 0; j<experimentNum; j++){

		$li = $("<li class='color"+conditionScore[i][j]+"'><p>"+conditionScore[i][j]+"</p><p class='article article"+taskArticleOrder[i][j]+"'></p></li>");
		$("ul.boxChart li:nth-child("+(i+2)+") ul").append($li);

		personScore[i] += conditionScore[i][j];
		taskScore[j] += conditionScore[i][j];
	}

	$li = $("<li class='personScore'><div></div><p></p></li>");
	$li.children("div").css("width", (personScore[i]-7) * 10);
	$li.children("p").html((personScore[i]/experimentNum).toFixed(2));

	// style
	if(personScore[i] > 12)
		$li.children("div").addClass("blackColor3");
	else if(personScore[i] <11)
		$li.children("div").addClass("blackColor1");

	$("ul.boxChart li:nth-child("+(i+2)+") ul").append($li);
}


for(var i = 0; i<experimentNum; i++){

	$li = $("<li class='task"+(i+1)+"'><div><p></p><div></div></div></li>");
	$li.children("div").children("p").html((taskScore[i]/testerNum).toFixed(2));
	$li.children("div").children("div").css("height", ((taskScore[i]-30)*10)+"px");
	$("ul.boxChart .taskScore ul").append($li);
}
	
	


// task - chart
$("ul.task").append("<li class='taskScore'><ul></ul></li>");
for(var i = 0; i<testerNum; i++){
	$("ul.task").append("<li><ul></ul></li>");

	for(var j = 0; j<experimentNum; j++){

		$li = $("<li><div class='article"+(tester[i].experiment[j].article)+"'></div>\
				<div class='task"+(tester[i].experiment[j].task)+"'></div></li>");

		$("ul.task li:nth-child("+(i+2)+") ul").append($li);

	}
}
for(var i = 0; i<experimentNum; i++){

	$li = $("<li><p>"+(i+1)+"</p></li>");
	$("ul.task .taskScore ul").append($li);
}



function syncData(){

	$("ul.isDataChart").append("<li class='title'><ul></ul></li>");
	var count = [0,0,0,0];

	for(var i = 0; i<testerNum; i++){

		$("ul.isDataChart").append("<li><ul></ul></li>");
		for(var j = 0; j<experimentNum; j++){

			if(eyeResult[i][j]===undefined){ //  exist

				$li = $("<li class='invalid'></li>");
				count[0]++;
			}
			else{
				if( eyeResult[i][j].dataType == 1){
					$li = $("<li class='valid' title='Full valid data' index='"+i+"-"+j+"'></li>");
				}
				else if( eyeResult[i][j].dataType == 2){
					$li = $("<li class='time' title='Only valid time data' index='"+i+"-"+j+"'></li>");
				}
				else if( eyeResult[i][j].dataType == 3){
					$li = $("<li class='manual' title='Manually Calibrated data' index='"+i+"-"+j+"'></li>");
				}
				count[eyeResult[i][j].dataType] ++;

/*				
				if(eyeResult[i][j].dataType != 2){

					$li.click(function(){
						var str = $(this).attr("index");
						var arr = str.split("-");

						tester = arr[0];
		                experiment = arr[1];
		            	newPage(tester, experiment);
						sys.renderer.that.trigger({type:"navigate", path:"experiment"});

					})
				}*/

			}
			
					
			$("ul.isDataChart li:nth-child("+(i+2)+") ul").append($li);

		}
	}

	for(var i = 0; i<experimentNum; i++){

		$li = $("<li class='task"+(i+1)+"'></li>");
		$("ul.isDataChart .title ul").append($li);
	}

	$(".isData-legend p.valid em").html(count[1]);
	$(".isData-legend p.manual em").html(count[3]);
	$(".isData-legend p.time em").html(count[2]);
	$(".isData-legend p.invalid em").html(count[0]);

	

}


function initDataDiv(data,min,max, type){

	$("#datadiv").html("");

	var task1 = "#f3e724";
		task2 = "#f3ae24";
		task3 = "#e87461";
	var canvasWidth = 500;
	var canvasHeight = 440;

	// Grab the data
    var data = data;
	var minData = min;
	var maxData = max;

    // Draw
    var width = canvasWidth,
        height = canvasHeight,
        r = Raphael("datadiv", width, height),
        txt = {"font": '13px HelveticaNeue-UltraLight, Arial', stroke: "none", fill: "#999"};
    

    var lineheight = 40;
	var xStart = 30;
	var leftX = xStart*2;
	var centerWidth = canvasWidth - leftX*2;
	var div = centerWidth / (maxData - minData);



    for (var i = 0; i < testerNum; i++) {

    	var number = r.text(xStart, (i+1.5)*lineheight, data[i][3]).attr(txt);

        for (var j = 0; j < experimentNum; j++) {
            
			if(data[i][j]){
				(function (x,j,number,data,type) {

					var color;
					if(j == 0) color = task1;
					else if(j == 1) color = task2;
					else if(j == 2) color = task3;

					if(type == 4){

					}
		            var dt = r.circle((x - minData)*div + leftX, (i+1.5)*lineheight, lineheight/4)
		            			.attr({stroke: "none", fill: color});
		            
		            var dot = r.circle((x - minData)*div + leftX, (i+1.5)*lineheight, lineheight/3)
		            			.attr({stroke: "none", fill: color}).hide();

		            var lbl = r.text((x - minData)*div + leftX, (i+1.5)*lineheight, Math.floor(data[i][j]))
		                    	.attr({"font": '15px "HelveticaNeue-UltraLight", Arial', stroke: "none", fill: "#fff"}).hide();

		            var cov = r.circle((x - minData)*div + leftX, (i+1.5)*lineheight, lineheight/3)
		            			.attr({stroke: "none", fill: color, opacity: 0});

		            cov.hover(function () {
                        lbl.show();
		                dot.show();
		                number.attr({fill: "#000"});

                    }, function () {
                        lbl.hide();
		                dot.hide();
		                number.attr({fill: "#999"});
                    });


				})(data[i][j], j, number,data,type);
			}
				
					
        }
        r.path("M50 " + (i+1)*lineheight + " L460 " + (i+1)*lineheight).attr({stroke: "#eee"});
    }

    r.text( leftX, (i+1.5)*lineheight, minData).attr(txt);
    r.text( canvasWidth - leftX, (i+1.5)*lineheight, maxData).attr(txt);
    r.path("M50 40 L50 400").attr({stroke: "#ddd"});
    r.path("M50 400 L460 400").attr({stroke: "#ddd"});
}

$("ul.choose-bar li").click(function(){

	$(".backgroundBox").removeClass("sac").removeClass("fix").removeClass("total").removeClass("score");

	if(!$(this).hasClass("cur")){

		$("ul.choose-bar li").removeClass("cur");
		$(this).addClass("cur");

		if($(this).hasClass("fix")){
			$(".backgroundBox").css("top", "-1px").addClass("fix");
			var data = getOverallData(1);
		}
		else if($(this).hasClass("sac")){
			$(".backgroundBox").css("top", "59px").addClass("sac");
			var data = getOverallData(2);
		}
		else if($(this).hasClass("total")){
			$(".backgroundBox").css("top", "119px").addClass("total");
			var data = getOverallData(3);
		}
		else if($(this).hasClass("score")){
			$(".backgroundBox").css("top", "179px").addClass("score");
			var data = getOverallData(4);
		}
		
	}
})


function getOverallData(type){

	var minData = 9999;
	var maxData = 0;
	var data=[];

	for(var i = 0; i<testerNum; i++){
		data[i] = [];
		for(var j = 0; j<experimentNum; j++){

			if(type == 4){

				data[i][j] = conditionScore[i][j];
				while(isExistThisNumber(data,i,j)){
					data[i][j] += 0.2;
				}
				minData = 0;
				maxData = 5;
			}
			else{
				if(eyeResult[i][j]===undefined){ data[i][j] = 0; }
				else{

					if(type == 1){
						data[i][j] = eyeResult[i][j].fixPerc;
					}
					else if(type == 2){
						data[i][j] = eyeResult[i][j].sacPerc;
					}
					else if(type == 3){
						data[i][j] = parseInt(eyeResult[i][j].totalTime);
					}

					if(data[i][j] < minData)
						minData = data[i][j];
					if(data[i][j] > maxData)
						maxData = data[i][j];
				}
			}
				
		}
		data[i][j] = i;
	}

	minData = parseInt(minData/10) * 10;
	maxData = parseInt(maxData/10 + 1) * 10;

	data.sort(function(a,b){return b[2]-a[2]});
	
	initDataDiv(data, minData, maxData, type);

}
function isExistThisNumber(data,i,j){

	for(var n = 0; n<j; n++){
		if(data[i][n] == data[i][j]){
			return true;
		}

	}
	return false;
}

$(".showArticle li").click(function(){

	if($(this).parent().hasClass("dis")){
		$(this).parent().removeClass("dis");
		$("ul.boxChart li ul li p.article").fadeIn(200);
	}
	else{
		$(this).parent().addClass("dis");
		$("ul.boxChart li ul li p.article").fadeOut(200);
	}



});

