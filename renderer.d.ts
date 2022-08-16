export interface IElectronAPI {
    renderer:any
  }
  
  declare global {
    interface Window {
        ipc: IElectronAPI
    }
  }