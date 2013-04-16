
var k = new Kalman();
var paper = Raphael($('#canvas')[0], $('#canvas').width(), $('#canvas').height());
var predicted = undefined;

function kalman(data){


	

	for(var i = 0; i<data.length; i++){

		if(data[i].type == 1){

			if(i == 0){
				var result = calKalman(data[0].startX, data[0].startY);
			}
			else if(data[i-1].type == 1){

				// kalman
				var result = calKalman(data[i].startX, data[i].startY);
				console.log(result);

				if(i>5){

					data[i].startX = result[0];
					data[i].startY = result[1];
				}

			}
			else if(data[i-1].type == 2){
				data[i].startX = data[i-1].endX;
				data[i].startY = data[i-1].endY;
			}
		}
		else if(data[i].type == 2){

			if(data[i-1].type == 1){
				data[i].startX = data[i-1].startX;
				data[i].startY = data[i-1].startY;
			}
			else if(data[i-1].type == 2){
				data[i].startX = data[i-1].endX;
				data[i].startY = data[i-1].endY;
			}

			// kalman
			var result = calKalman(data[i].endX, data[i].endY);
			console.log(result);

			if(i>5){

				data[i].endX = result[0];
				data[i].endY = result[1];
			}
		}

		
	}




}


function calKalman(x,y){

	k.filter(x,y);
	if (predicted) predicted.remove();

	return [k.nextX(), k.nextY()]
}