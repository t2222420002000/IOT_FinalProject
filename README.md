# IOT_FinalProject: 遙控逗貓車
![image](https://github.com/t2222420002000/IOT_FinalProject/blob/master/Catcar.jpg)

可藉由網頁控制車子來達成遠端逗貓的功能，車子提供前進、後退、左轉、右轉等方向控制，以及遇到障礙物會自動停下來，避免撞傷您的愛貓！在自動模式下則會避開障礙物繼續行駛。

Demo影片:  https://youtu.be/_Fmwv50jBPg  

所需材料：  
 * 樹莓派 * 1  
 * 小塊麵包板 * 1  
 * 3號電池盒 * 2  
 * 3號電池 * 8  
 * L298N馬達驅動模組 * 2  
 * US-100 超音波測距模組 * 1  
 * 樹莓派 UPS 鋰電池擴充板 USB 電源供應模組 * 1  
 * 市售四驅四輪智慧小車底盤 * 1（內含減速馬達 * 4 輪子 * 4）  
 * 杜邦線 約22條  
 * 絕緣膠帶 * 1捲 
 * 逗貓玩具 * 1
 
## 前置準備-在樹莓派上安裝作業系統

1.先至官網下載作業系統，本專案下載的是NOOBS
  * 下載連結:  https://www.raspberrypi.org/downloads/
  
2.下載完成後在你的電腦上解壓縮檔案，並將裡面的檔案移至要裝在樹莓派上的SD卡

3.將樹莓派接上電源，啟動樹莓派

4.安裝Raspbian
  * 安裝完成的畫面如下
  * ![image](https://github.com/t2222420002000/IOT_FinalProject/blob/master/image/Raspbian.jpg)

## 前置準備-啟用VNC遠端到樹莓派上

1.打開樹莓派上的VNC Server設定
  * raspberry icon -> Preferences -> Raspberry Pi Configuration
  * 選擇Interfaces，將VNC狀態改為Enable
  * 更改完之後可以看見畫面右上角多了VNC的圖示




## 步驟一：在樹莓派上安裝Node.js和onoff、socket.io套件
參考連結: https://maker.pro/raspberry-pi/tutorial/how-to-control-a-raspberry-pi-gpio-pin-with-a-nodejs-web-server  

1. 先更新你的樹莓派
```
sudo apt-get update
```
 * 並將已安裝再樹莓派上的套件更新至最新版本
 ```
sudo apt-get dist-upgrade
```
2. 使用下列指令安裝最新版本的Node.js
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
```
```
sudo apt-get install -y nodejs
```
3. 確認Node.js是否有安裝成功
```
node -v
```
4. 安裝onoff套件
```
npm install onoff
```
5. 安裝socket.io套件
```
npm install socket.io --save
```

## 步驟二：連接電路
樹莓派GPIO說明
 * 請參考: https://pinout.xyz/  
 
需要連接的零件有以下:

 1.減速馬達連接L298N馬達控制模組，在接上樹莓派  
  * 請參考: https://www.youtube.com/watch?v=bF1XDjpLork  
  * 請參考: https://www.youtube.com/watch?v=7vTl9kosZDc  
  * 2個L298N共使用樹莓派8個Pin，分別為BCM 17,18,20,21,22,23,24,25，以及2個Ground。

 2.US-100超音波測距模組連接樹莓派
  * 請參考: https://atceiling.blogspot.com/2014/03/raspberry-pi_18.html
  * US-100超音波測距模組共使用樹莓派2個Pin，分別為BCM 6,26，以及1個Ground，1個3.3V Power輸出。
 
一共使用樹莓派GPIO上的10個Pin，3個Ground，1個3.3V Power輸出。

## 步驟三：建立控制車子的網頁檔案
共有兩支檔案，一支為顯示在網頁上的.html檔，一支為在server端執行的.js檔

### index.html
內建有6個按鈕，分別為控制前進、左轉、右轉、後退、停車、自動模式等功能，當使用者在網頁上按按鈕，會傳送websocket到樹莓派上的server，使車子做出對應的動作。

```html
<!DOCTYPE html>
<html>
	<title>GPIO Control</title>
	<head>
		<meta charset="utf-8">
 		 <!--定義按鈕樣式-->
		<style>
			.btn{
				height: 80px;
				width: 100px;
				font-size:18px;
				background-color: green;
			}
			.btn_stop{
				height: 80px;
				width: 100px;
				font-size:18px;
				background-color: red;
			}
			.cell{
				height: 80px;
				width: 120px;
			}
		</style>
	</head>
	<body>
		<h2>Control Car</h2>
  		<!--控制車子的按鈕-->
		<table border="0" cellspacing="8" cellpadding="8">
			<tr>
				<td class="cell"></td>
				<td class="cell"><button class="btn" type="button" id="mstate" onclick="mauto()">Auto</button></td>
				<td class="cell"></td>
			</tr>
		　	<tr>
				<td class="cell"></td>
			　  <td class="cell"><button class="btn" type="button" id="mstate" onclick="mforward()">Forward</button></td>
				<td class="cell"></td>
		　	</tr>
			<tr>
				<td class="cell"><button class="btn" type="button" id="mstate" onclick="carleft()" >Left</button></td>
				<td class="cell"><button class="btn_stop" type="button" id="mstate" onclick="mstop()" >Stop</button></td>
				<td class="cell"><button class="btn" type="button" id="mstate" onclick="carright()" >Right</button></td>
		　	</tr>
			<tr>
				<td class="cell"></td>
			　  <td class="cell"><button class="btn" type="button" id="mstate" onclick="mbackward()">Backward</button></td>
				<td class="cell"></td>
			</tr>
   			<!--按下按鈕後傳出對應的狀態的websocket給server-->
			<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"></script>
			<script>
				var socket = io.connect(); //load socket.io-client and connect to the host
				function mstop() {
					socket.emit("mstate", 0); //send button state to server
				}
				
				function mforward() {
					socket.emit("mstate", 1); //send button state to server
				}
				
				function carleft() {
					socket.emit("mstate", 2); //send button state to server
				}
				
				function carright() {
					socket.emit("mstate", 3); //send button state to server
				}
				
				function mbackward() {
					socket.emit("mstate", 4); //send button state to server
				}
				
				function mauto() {
					socket.emit("mstate", 5); //send button state to server
				}
			</script>
		</table>
	</body>
</html>
```

### webserver.js
在server端監聽websocket，使用onoff套件控制GPIO，達到控制輪子的轉動使車子前進後退轉彎；以及控制超音波測距模組進行測量距離，達到避障的功能。

```javascript
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
```

## 步驟四：啟動webserver

1.將上列兩支檔案放在node.js的資料夾

2.移動到該資料夾底下
 * cd your_dir_path

3.啟動webserver
 * node webserver.js
 
4.開起瀏覽器，網址列輸入
 * localhost:8080
 
5.網頁上就會出現6個控制按鈕囉！就可以開始控制車子！






