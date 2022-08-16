
const { contextBridge, ipcRenderer} = require('electron')
const validChannels = ["toMain", "myRenderChannel"];
// @ts-nocheck
contextBridge.exposeInMainWorld('ipc', {
    // renderer:ipcRenderer,
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
    }
})