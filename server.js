var express = require('express'),
	http = require('http'),
	mongo = require('mongodb'),
    app = express.createServer();

var db;
mongo.connect('mongodb://localhost:27017/games', function(err, conn){
	db = conn;
});


app.use(express.static(__dirname+'/static'));
app.use(express.bodyParser());
app.use(express.cookieParser());


app.get('/get/games/db', function(req, res){

	db.collection('game').find({ "eventNum" : req.query.eventNum })
		.toArray(function(err, result){

			res.send({
				err : null,
				result : result
			})
		})
});

app.get('/get/games/add', function(req, res){
	console.log(req.query)
	db.collection('game').save(req.query, function(err, result){
		res.send({
			err : null,
			result : result
		})
	})
	
});
app.get('/get/games/edit', function(req, res){

	db.collection('game').update({ "eventNum" : req.query.eventNum,
									 "number" : req.query.number }, 
								 { $set: { name : req.query.name ,
								 		 point1 : req.query.point1 ,
								 		 point2 : req.query.point2 ,
								 		 point3 : req.query.point3 ,
								 		 point4 : req.query.point4 ,
								 		 point5 : req.query.point5 }} , function(err, result){
		res.send({
			err : null,
			result : result
		})
		
	})
	
});


app.listen(8888);