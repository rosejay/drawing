


function kalman(data){


	for(var i = 0; i<data.length; i++){

		if(i < 10){
			;
		}
		else if(data[i].type == 1){

			
			if(data[i-1].type == 1){

				// kalman
				var result = calKalman(i,"start",data);
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
			var result = calKalman(i,"end",data);
			console.log(result);

			if(i>5){

				data[i].endX = result[0];
				data[i].endY = result[1];
			}
		}

		
	}




}


function calKalman(index,str,data){

	var count = 0,
		sumX = 0,
		sumY = 0;
		console.log(index)

	while(count < 5){

		count ++;
		sumX += data[index - count].startX;
		sumY += data[index - count].startY;
		
	}

	var avgX = sumX / 10,
		avgY = sumY / 10;

	if(str == "start"){
		var newX = parseInt(0.5*avgX + data[index].startX);
		var newY = parseInt(0.5*avgY + data[index].startY);
	}
	else{
		var newX = parseInt(0.5*avgX + data[index].endX);
		var newY = parseInt(0.5*avgY + data[index].endY);
	}

	return [newX, newY]
}