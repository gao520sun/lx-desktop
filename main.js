const {app, BrowserWindow, ipcMain, globalShortcut} = require('electron')
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
        contextIsolation:true,
        preload: __dirname + '/preload.ts'
    }
}
const host = 'http://localhost:8000'
const createWindow = () => {
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