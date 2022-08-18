
const { contextBridge, ipcRenderer} = require('electron')
const validChannels = ["toMain", "myRenderChannel"];
// @ts-nocheck
contextBridge.exposeInMainWorld('ipc', {
    renderer: {
        sendMessage(channel, args) {
            ipcRenderer.sendMessage(channel, args);
        },
        send(channel, args) {
            ipcRenderer.send(channel, args);
        },
        on(channel, func) {
            const subscription = (_event, ...args) =>func(...args);
            ipcRenderer.on(channel, subscription);
      
            return () => ipcRenderer.removeListener(channel, subscription);
        },
    },
    store:{
        // https://my.oschina.net/zhxz/blog/5403942
        setItem(key, value) {
            ipcRenderer.sendSync('store:set', key, value)
        },
        getItem(key) {
            return ipcRenderer.sendSync('store:get', key)
        },
        removeItem(key) {
            ipcRenderer.sendSync('store:remove', key)
        },
        clear() {
            ipcRenderer.sendSync('store:clear')
        },
    }
})