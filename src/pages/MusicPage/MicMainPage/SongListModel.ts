import { getStoreItem, setStoreItem } from "@/utils/Storage"
import Linq from 'linq';
import PubSub from 'pubsub-js'
// // 歌单结构
// {
//     'store:mic_songList':[
//         {name:'',creator:'',list:[]}
//     ]
// }

// 获取歌单列表
export const getSongList = () => {
    const songList = getStoreItem(window.STORE_TYPE.micSongList) || [];
    return songList
}
export const getCollectSongList = () => {
    const songList = getStoreItem(window.STORE_TYPE.collectSongList) || [];
    return songList
}
// 创建歌单
export const createSongList = (info:any={},list=[])  => {
    try {
        if(!info.name.length){return {status:-1,message:'歌单名称不能为空'}}
        let songList = getSongList();
        const sDic = Linq.from(songList).firstOrDefault((x:any) => x.info.name == info.name,null);
        if(!sDic){
            songList.push({info:{name:info.name,coverImgUrl:'',creator:{avatarUrl:'',nickname:''},tags:[],description:''},list});
            setStoreItem(window.STORE_TYPE.micSongList,songList);
            PubSub.publishSync(window.MIC_TYPE.createSongList,songList)
            return {status:0,message:'本地保存成功'}
        }
        return {status:-1,message:'相同歌单名称'}
    } catch (error) {
        console.log('error::',error)
        return {status:-1,message:'未知错误,请关闭重新打开'}
    }
}
// 保存已有的歌单
export const saveHasSongList = (info:any={},list=[]) => {
    try {
        let songList = getSongList();
        let sDic:any = Linq.from(songList).firstOrDefault((x:any) => x.info.name == info.name,null);
        const tList = [...sDic?.list || [],...list];
        sDic.list = Linq.from(tList).distinct((x:any) => x.id).toArray();
        setStoreItem(window.STORE_TYPE.micSongList,songList)
        return {status:0,message:'本地保存成功'}
    } catch (error) {
        console.log('error::',error)
        return {status:-1,message:'未知错误,请关闭重新打开'}
    }
}
// 保存收藏歌单
export const saveNetworkSongList = (info:any,list=[]) => {
    if(!info.name.length){return {status:-1,message:'歌单名称不能为空'}}
    let songList = getCollectSongList();
    const sDic = Linq.from(songList).firstOrDefault((x:any) => x.info.name == info.name,null);
    if(!sDic) {
        songList.push({info,list});
        setStoreItem(window.STORE_TYPE.collectSongList,songList);
        PubSub.publishSync(window.MIC_TYPE.createSongList,songList)
        return {status:0,message:'已收藏歌单成功'}
    }
    return {status:-1,message:'当前歌单已收藏'}
}
// 获取当前单个歌单
export const getSingleSongList = (name:string) => {
    let songList = getSongList();
    let sDic:any = Linq.from(songList).firstOrDefault((x:any) => x.info.name == name,null);
    return sDic;
}
// 获取当前收藏单个歌单
export const getCollectSingleSongList = (name:string) => {
    let songList = getCollectSongList();
    let sDic:any = Linq.from(songList).firstOrDefault((x:any) => x.info.name == name,null);
    return sDic;
}
// 删除当前收藏单个歌单
export const deleteSingleSongList = (name:string,type:string) => {
    if(!name.length){return {status:-1,message:'歌单名称不能为空'}}
    let songList = []
    if(type == 'custom') {
        songList = getSongList();
    }else if(type == 'collect'){
        songList = getCollectSongList();
    }
    songList =  Linq.from(songList).where((x:any) => x.info.name != name).toArray();
    setStoreItem(window.STORE_TYPE.collectSongList,songList);
    PubSub.publishSync(window.MIC_TYPE.createSongList,songList)
    return {status:0,message:'删除歌单成功'}
}
// 删除自定义歌单的数据
export const deleteSingSong = (name:string,data:any) => {
   try {
    console.log('v::',data);
        if(!name.length){return {status:-1,message:'歌单名称不能为空'}}
        let songList = getSongList();
        let sDic:any = Linq.from(songList).firstOrDefault((x:any) => x.info.name == name,null);
        sDic.list = Linq.from(sDic.list).where((x:any) => x.id != data.id).toArray();
        console.log('sDic.list;:',sDic.list)
        setStoreItem(window.STORE_TYPE.micSongList,songList);
        return {status:0,message:'删除成功'}
   } catch (error) {
    return {status:-1,message:'未知错误,请关闭重新打开'}
   }
}
