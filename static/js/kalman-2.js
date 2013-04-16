


function kalman(data){


	var pk = 1;

	for(var i = 0; i<data.length; i++){

		if(data[i].type == 1){

			if(i == 0)
				var result = calKalman(data[i].startX, data[i].startY, 1, 0, 0);
			else if(data[i-1].type == 1){

				var result = calKalman(data[i].startX, data[i].startY, pk, data[i-1].startX, data[i-1].startY)

				data[i].startX = result[0];
				data[i].startY = result[1];
				pk = result[2];
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

			var result = calKalman(data[i].endX, data[i].endY, pk, data[i].startX, data[i].startY);
			data[i].endX = result[0];
			data[i].endY = result[1];
			pk = result[2];
		}

		console.log(pk, data[i].startX, data[i].startY);
	}




}


function calKalman(x,y,pk,xk,yk){

	// xk means xk-1, yk means yk-1
	var xkk = xk;
	var ykk = yk;
	var pkk = pk;
	var kkk = pkk/(pkk+0.1);

	var newX = parseInt(xkk + kkk*(x - xkk));
	var newY = parseInt(ykk + kkk*(y - ykk));
	var newPk = (1-kkk)/pkk;

	console.log(pkk+" kkk")
	return [newX, newY, newPk];
}