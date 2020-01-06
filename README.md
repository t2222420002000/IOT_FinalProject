# IOT_FinalProject: 遙控逗貓車
可藉由網頁控制車子來達成自動逗貓的功能，車子提供前進、後退、左轉、右轉等方向控制，以及遇到障礙物會自動停下來，避免撞傷您的愛貓！

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













