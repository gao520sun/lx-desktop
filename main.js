const {app, BrowserWindow} = require('electron')
const isDev = require('electron-is-dev')
const createWindow = () => {
    const win = new BrowserWindow({
        width:800,
        height:600,
        minWidth:600,
        minHeight:400,
        frame:false, // 无边框
        webPreferences: {
            nodeIntegration:true, // 可以在js文件中使用node
        }
    })
    console.log('isDev::',isDev)
    const urlLocation = isDev ? 'http://localhost:8000' : ''
    win.loadURL(urlLocation)
}

app.whenReady().then(() => {
    createWindow();
})