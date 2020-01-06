# IOT_FinalProject: 遙控逗貓車
可藉由網頁控制車子來達成遠端逗貓的功能，車子提供前進、後退、左轉、右轉等方向控制，以及遇到障礙物會自動停下來，避免撞傷您的愛貓！在自動模式下則會避開障礙物繼續行駛。

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









