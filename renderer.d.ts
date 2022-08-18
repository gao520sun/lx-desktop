interface IStore {
  setItem:any,
  getItem:any,
  removeItem:any,
  clear:any,
}
export interface IElectronAPI {
    renderer:any,
    store:IStore
  }
  
  declare global {
    interface Window {
        ipc: IElectronAPI
    }
  }