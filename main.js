const {app, BrowserWindow, ipcMain, globalShortcut} = require('electron')
const isDev = require('electron-is-dev')
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

// 打开视频新的窗口
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