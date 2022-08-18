
  export interface IWinType {
      fullScreen:string,
      resized:string,
  }
  export interface IVodType {
    detail:string,
    fullScreen:string,
    js:string,
  }
  export interface IStoreType {
    vodHistory:string,
  }
    
  declare global {
      interface Window {
        WIN_TYPE: IWinType,
        VOD_TYPE: IVodType,
        STORE_TYPE:IStoreType
    }
}

