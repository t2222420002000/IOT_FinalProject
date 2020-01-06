var Gpio = require('onoff').Gpio; //require onoff to control GPIO
var fs = require('fs'); //require filesystem to read html files
var http = require('http').createServer(function handler(req, res) { //create server
  fs.readFile(__dirname + '/index.html', function (err, data) { //read html file
    if (err) {
      res.writeHead(500);
      return res.end('Error loading socket.io.html');
    }

    res.writeHead(200);
    res.end(data);
  });
});

var io = require('socket.io')(http) //require socket.io module and pass the http object

http.listen(8080); //listen to port 8080

var IN1 = new Gpio(22, 'out'); //motor1 
var IN2 = new Gpio(17, 'out'); //motor1

var IN3 = new Gpio(25, 'out'); //motor2 
var IN4 = new Gpio(18, 'out'); //motor2

var IN5 = new Gpio(24, 'out'); //motor3 
var IN6 = new Gpio(23, 'out'); //motor3

var IN7 = new Gpio(20, 'out'); //motor4 
var IN8 = new Gpio(21, 'out'); //motor4

var leftID;
var rightID;

var left = false;
var right = false;

function mforward(){ // car forward
	IN1.writeSync(1);
	IN2.writeSync(0);
	IN3.writeSync(1);
	IN4.writeSync(0);
	
	IN5.writeSync(1);
	IN6.writeSync(0);
	IN7.writeSync(1);
	IN8.writeSync(0);
}

function mbackward(){ // car backward
	IN1.writeSync(0);
	IN2.writeSync(1);
	IN3.writeSync(0);
	IN4.writeSync(1);
	
	IN5.writeSync(0);
	IN6.writeSync(1);
	IN7.writeSync(0);
	IN8.writeSync(1);
}

function mstop(){ // car stop
	IN1.writeSync(0);
	IN2.writeSync(0);
	IN3.writeSync(0);
	IN4.writeSync(0);
	
	IN5.writeSync(0);
	IN6.writeSync(0);
	IN7.writeSync(0);
	IN8.writeSync(0);
	 
	clearInterval(distanceID);
	
	if(left){clearTimeout(leftID);}
	if(right){clearTimeout(rightID);}
	
	left = false;
	right = false;
}

function mleft(){ // car turn left
	left = true;
	IN1.writeSync(0);
	IN2.writeSync(0);
	IN3.writeSync(1);
	IN4.writeSync(0);

	IN5.writeSync(0);
	IN6.writeSync(0);
	IN7.writeSync(1);
	IN8.writeSync(0);
		 
	leftID = setTimeout(function(){
				IN1.writeSync(1);
				IN2.writeSync(0);
				IN3.writeSync(1);
				IN4.writeSync(0);

				IN5.writeSync(1);
				IN6.writeSync(0);
				IN7.writeSync(1);
				IN8.writeSync(0);
				left = false;
			},1500);
}

function mright(){ // car turn right
	right = true;
	IN1.writeSync(1);
	IN2.writeSync(0);
	IN3.writeSync(0);
	IN4.writeSync(0);
	
	IN5.writeSync(1);
	IN6.writeSync(0);
	IN7.writeSync(0);
	IN8.writeSync(0);
		
	rightID = setTimeout(function(){
				IN1.writeSync(1);
				IN2.writeSync(0);
				IN3.writeSync(1);
				IN4.writeSync(0);

				IN5.writeSync(1);
				IN6.writeSync(0);
				IN7.writeSync(1);
				IN8.writeSync(0);	
				right = false;				
			},1500);	
}

var auto = false;
var period = 500;
var distanceID;
var dis_trigger = new Gpio(26, 'out');
var dis_echo = new Gpio(6, 'in','both');

function distance(){ //Calculate Distance
	
	dis_trigger.writeSync(1);
	setTimeout(function(){
		dis_trigger.writeSync(0);
	},10);
	
	var starttime = -1;
	var stoptime;
	
	while(dis_echo.readSync() == 0){
		if(starttime < 0){
			starttime = new Date();
			starttime = starttime.getMilliseconds();
		}
	}
	while(dis_echo.readSync() == 1){
			stoptime = new Date();
			stoptime = stoptime.getMilliseconds();
	}
	var d_time = stoptime - starttime ;
	d =  (d_time * 34 / 2 );
	if(d < 150){
		console.log("Need Stop!");
		mstop();
	}else{
		console.log("Keep going~");
	}	
}

function distance_auto(){ //Calculate Distance for auto mode
	
	dis_trigger.writeSync(1);
	setTimeout(function(){
		dis_trigger.writeSync(0);
	},10);
	
	var starttime = -1;
	var stoptime;
	
	while(dis_echo.readSync() == 0){
		if(starttime < 0){
			starttime = new Date();
			starttime = starttime.getMilliseconds();
		}
	}
	while(dis_echo.readSync() == 1){
			stoptime = new Date();
			stoptime = stoptime.getMilliseconds();
	}
	var d_time = stoptime - starttime ;
	d =  (d_time * 34 / 2 );
	if(d < 200){
		console.log("Need turn!");
		if(left){clearTimeout(leftID);}
		if(right){clearTimeout(rightID);}
		var i = getRandomInt(1);
		if  (i == 0){
			mleft();
		}else{
			mright();
		}
	}else{
		console.log("Keep going~");
	}	
}

function getRandomInt(max) { //Generate random number
  return Math.floor(Math.random() * Math.floor(max));
}

function mauto(){ // auto mode
	auto = true;
	mforward();
}

try{
	io.sockets.on('connection', function (msocket) {// WebSocket Connection
	  msocket.on('mstate', function (data) { //get button state from client
		switch (data) {
			case 0:
			　mstop();	      
			　break;
			case 1:
			　mforward();
			  distanceID = setInterval(distance, period);	
			　break;
			case 2:
			　mleft();	
			　break;
			case 3:
			　mright();
			　break;
			case 4:
			　mbackward();
			　break;
			case 5:
			　mauto();
			  distanceID = setInterval(distance_auto, period);
			　break;
			default:
			　break;
		}   
	  });
	});
}catch(ex){
	IN1.writeSync(0);
	IN2.writeSync(0);
	IN3.writeSync(0);
	IN4.writeSync(0);
	
	IN5.writeSync(0);
	IN6.writeSync(0);
	IN7.writeSync(0);
	IN8.writeSync(0);
}