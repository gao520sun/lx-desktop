

// 为了以后web使用
export const setStoreItem = (key:string,value:any) => {
    if(!key){return new Error('切少存储key')}
    window.ipc.store.setItem(key,value);
}
export const getStoreItem = (key:string) => {
    return window.ipc.store.getItem(key)
}

export const removeStoreItem = (key:string) => {
    return window.ipc.store.getItem(key)
}
export const clearStore = () => {
    return window.ipc.store.clear()
}