
var isExist = [[1,1,2],
			   [1,1,2],
			   [1,1,2],
			   [2,2,0],
			   [1,1,3],
			   [1,1,3],
			   [0,1,3],
			   [1,1,2],
			   [1,1,2]]; // 0: none, 1: valid, 2: time, 3: manual



var articleAvg = [3.56, 3.89, 3.67];

var testerNum = 9;
var experimentNum = 3;
var personInfo = ["25-29 years old, male, PhD student, use tablet 3-6 times a week, do not use glasses.",
				  "20-24 years old, female, master student, do not use tablet, do not use glasses.",
				  "30-39 years old, female, researcher, use tablet once every week, do not use glasses.",
				  "20-24 years old, female, master student, do not use tablet, do not use glasses.",
				  "20-24 years old, female, master student, do not use tablet, do not use glasses.",
				  "30-39 years old, male, engineer, use tablet every day, do not use glasses.",
				  "20-24 years old, female, master student, use tablet once every week, do not use glasses.",
				  "25-29 years old, male, PhD student, use tablet once every week, use glasses.",
				  "30-39 years old, female, post doc, use tablet only occasionally, use glasses."];

var frequencyInfo = [3,0,2,0,0,4,2,2,1];
var taskOrder = [[1,2,3],
				 [3,2,1],
				 [3,1,2],
				 [3,2,1],
				 [1,2,3],
				 [2,1,3],
				 [2,3,1],
				 [2,3,1],
				 [1,2,3]];
var articleOrder = [[1,2,3],
					[1,2,3],
					[1,3,2],
					[2,1,3],
					[2,3,1],
					[3,1,2],
					[3,2,1],
					[1,2,3],
					[1,3,2]];
var taskArticleOrder = [[1,2,3],
					   [3,2,1],
					   [3,2,1],
					   [3,1,2],
					   [2,3,1],
					   [1,3,2],
					   [1,3,2],
					   [3,1,2],
					   [1,3,2]];

var scoreOrder = [[4,3,4],
				  [2,4,5],
				  [4,4,4],
				  [4,4,3],
				  [4,3,5],
				  [5,5,4],
				  [3,4,2],
				  [2,4,3],
				  [4,3,4]];

var sexInfo = [1,0,0,0,0,1,0,1,0];
var conditionScore = [[4,3,4],
					  [5,4,2],
					  [4,4,4],
					  [3,4,4],
					  [4,3,5],
				  	  [5,5,4],
					  [2,3,4],
					  [3,2,4],
					  [4,3,4]];

var articleScore = [[4,3,4],
					[2,4,5],
					[4,4,4],
					[4,4,3],
					[5,4,3],
					[5,4,5],
					[2,4,3],
					[2,4,3],
					[4,4,3]];