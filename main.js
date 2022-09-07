const {app, BrowserWindow, ipcMain, globalShortcut, session} = require('electron')
const isDev = require('electron-is-dev')
const Store = require('electron-store')
const option = {
  name: 'lcConfig', //文件名称,默认 config
  fileExtension: 'json', //文件后缀,默认json
  clearInvalidConfig: true // 发生 SyntaxError  则清空配置,
}
if(!isDev){
    option.encryptionKey = 'aes-256-cbc';// 对配置文件进行加密
}
const ElectronStore = new Store(option);
console.log('本地存储路径::',ElectronStore.path)
let mainWin = null
let initBrowser = {
    width:1200,
    height:800,
    minWidth:1064,
    minHeight: 664,
    // frame:false, // 无边框
    titleBarStyle: 'hidden',
    webPreferences: {
        webSecurity: false,
        contextIsolation:true,
        preload: __dirname + '/preload.ts'
    }
}
const MOBILE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30";

function hack_referer_header(details) {
    let replace_referer = true;
    let replace_origin = true;
    let add_referer = true;
    let add_origin = true;
    let referer_value = "";
    let origin_value = "";
    let ua_value = "";
  
    if (details.url.includes("://music.163.com/")) {
      referer_value = "http://music.163.com/";
    }
    if (details.url.includes("://interface3.music.163.com/")) {
      referer_value = "http://music.163.com/";
    }
    if (details.url.includes("://gist.githubusercontent.com/")) {
      referer_value = "https://gist.githubusercontent.com/";
    }
  
    if (details.url.includes(".xiami.com/")) {
      add_origin = false;
      referer_value = "https://www.xiami.com/";
    }
    if (details.url.includes("www.xiami.com/api/search/searchSongs")) {
      const key = /key%22:%22(.*?)%22/.exec(details.url)[1];
      add_origin = false;
      referer_value = `https://www.xiami.com/search?key=${key}`;
    }
    if (details.url.includes("c.y.qq.com/")) {
      referer_value = "https://y.qq.com/";
      origin_value = "https://y.qq.com";
    }
    if (
      details.url.includes("y.qq.com/") ||
      details.url.includes("qqmusic.qq.com/") ||
      details.url.includes("music.qq.com/") ||
      details.url.includes("imgcache.qq.com/")
    ) {
      referer_value = "http://y.qq.com/";
    }
    if (details.url.includes(".kugou.com/")) {
      referer_value = "https://www.kugou.com/";
      ua_value = MOBILE_UA;
    }
    if (details.url.includes("m.kugou.com/")) {
      ua_value = MOBILE_UA;
    }
    if (details.url.includes(".kuwo.cn/")) {
      referer_value = "http://www.kuwo.cn/";
    }
    if (
      details.url.includes(".bilibili.com/") ||
      details.url.includes(".bilivideo.com/")
    ) {
      referer_value = "https://www.bilibili.com/";
      replace_origin = false;
      add_origin = false;
    }
    if (details.url.includes(".migu.cn")) {
      referer_value = "http://music.migu.cn/v3/music/player/audio?from=migu";
    }
    if (details.url.includes("m.music.migu.cn")) {
      referer_value = "https://m.music.migu.cn/";
    }
    if (origin_value == "") {
      origin_value = referer_value;
    }
    let isRefererSet = false;
    let isOriginSet = false;
    let isUASet = false;
    let headers = details.requestHeaders;
  
    for (let i = 0, l = headers.length; i < l; ++i) {
      if (
        replace_referer &&
        headers[i].name == "Referer" &&
        referer_value != ""
      ) {
        headers[i].value = referer_value;
        isRefererSet = true;
      }
      if (replace_origin && headers[i].name == "Origin" && referer_value != "") {
        headers[i].value = origin_value;
        isOriginSet = true;
      }
      if (headers[i].name === "User-Agent" && ua_value !== "") {
        headers[i].value = ua_value;
        isUASet = true;
      }
    }
  
    if (add_referer && !isRefererSet && referer_value != "") {
      headers["Referer"] = referer_value;
    }
  
    if (add_origin && !isOriginSet && referer_value != "") {
      headers["Origin"] = origin_value;
    }
  
    if (!isUASet && ua_value !== "") {
      headers["User-Agent"] = ua_value;
    }
  
    details.requestHeaders = headers;
}
const host = 'http://localhost:8000'
const createWindow = () => {
    const filter = {
        urls: [
          "*://*.music.163.com/*",
          "*://music.163.com/*",
          "*://*.xiami.com/*",
          "*://i.y.qq.com/*",
          "*://c.y.qq.com/*",
          "*://*.kugou.com/*",
          "*://*.kuwo.cn/*",
          "*://*.bilibili.com/*",
          "*://*.bilivideo.com/*",
          "*://*.migu.cn/*",
        ],
      };
      session.defaultSession.webRequest.onBeforeSendHeaders(
        filter,
        (details, callback) => {
          hack_referer_header(details);
          callback({ cancel: false, requestHeaders: details.requestHeaders });
        }
      );
    mainWin = new BrowserWindow({...initBrowser})
    const urlLocation = isDev ? host : ''
    mainWin.loadURL(urlLocation)
    // mainWin.webContents.openDevTools()/
    mainWin.on('resized',(event, newBounds) => {
        console.log('newBounds::',newBounds)
        mainWin.webContents.send('win:resized', mainWin.getContentBounds())
    })
}
const setFullScreenFocused = (data) => {
    const focusedWin  = BrowserWindow.getFocusedWindow();
    if(focusedWin){
        focusedWin.setFullScreen(data)
    }
}

app.whenReady().then(() => {
    createWindow();
    globalShortcut.register('ESC', () => {
        setFullScreenFocused(false)
    })
})

// 打开视频事情详情新的窗口
ipcMain.on('vod:detail',(e,data) => {
    const vodDetailWin = new BrowserWindow({
        ...initBrowser,
        width:1400,
        height:800,
        minWidth:1024,
        minHeight:768,
        trafficLightPosition: { x:20, y: 20 }
    })
    const urlLocation = isDev ? `${host}/vod/detail/${data.vod_id}` : ''
    vodDetailWin.loadURL(urlLocation)
    vodDetailWin.webContents.openDevTools()
    vodDetailWin.on('window:min',() => {
        mainWin.minimize()
    })
    vodDetailWin.on('window:close',() => {
        console.log('aaaa')
    })
})
ipcMain.on('win:fullScreen',(e,  data) => {
    console.log('e,  data::',e,  data);
    setFullScreenFocused(data)
})
// 窗口最小化
ipcMain.on('window:min',(e,data) => {
    mainWin.minimize()
})
// 窗口最大化
ipcMain.on('window:max', function () {
    if (mainWin.isMaximized()) {
        mainWin.restore();
    } else {
        mainWin.maximize();
    }
})
//关闭窗口
ipcMain.on('window:close', function () {
    mainWin.close();
})

// 文件存储
ipcMain.on('store:set', (event, key, val) => {
    ElectronStore.set(key, val)
    event.returnValue = ElectronStore.get(key)
  })
  ipcMain.on('store:get', (event, key) => {
    event.returnValue = ElectronStore.get(key)
  })
  ipcMain.on('store:remove', (event, key) => {
    ElectronStore.delete(key)
    event.returnValue = ElectronStore.get(key)
  })
  ipcMain.on('store:clear', event => {
    ElectronStore.clear()
    event.returnValue = ''
  })