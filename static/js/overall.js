

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


console.log(pageScore)
$("ul.boxChart").append("<li class='taskScore'><ul></ul></li>");
for(var i = 0; i<testerNum; i++){

	personScore[i] = 0;
	$("ul.boxChart").append("<li><ul></ul></li>");
	for(var j = 0; j<experimentNum; j++){

		$li = $("<li class='color"+conditionScore[i][j]+"'></li>");
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


