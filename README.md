# IOT_FinalProject: 遙控逗貓車
可藉由網頁控制車子來達成遠端逗貓的功能，車子提供前進、後退、左轉、右轉等方向控制，以及遇到障礙物會自動停下來，避免撞傷您的愛貓！

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

## 步驟一：安裝Node.js和onoff、socket.io套件
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

## 步驟二：建立控制車子的網頁檔案
共有兩支檔案，一支為顯示在網頁上的.html檔，一支為在server端執行的.js檔

### index.html
內建有5個按鈕，分別為控制前進、左轉、右轉、後退、停車等功能，當使用者在網頁上按按鈕，會傳送websocket到樹莓派上的server，使車子做出對應的動作！

### webserver.js
在server端監聽websocket，使用onoff套件控制GPIO，達到控制輪子的轉動使車子前進後退轉彎；以及控制超音波測距模組進行測量距離，達到避障的功能。

## 步驟三：連接電路
需要連接的零件有以下:

1.減速馬達連接L298N馬達控制模組，在接上樹莓派  
 * 請參考: https://www.youtube.com/watch?v=bF1XDjpLork  
 * 請參考: https://www.youtube.com/watch?v=7vTl9kosZDc  

2.L298N馬達控制模組連接樹莓派
 * 參考: 












