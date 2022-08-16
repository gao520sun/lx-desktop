
import Linq from 'linq'
export const httpImgUrl = (url='',host='http://watch.gaolingchuan.top/') => {
    if(!url) return ''
    const index = url.indexOf('http')
    if(index == -1){
        url = host + url;
    }
    return url
}

export const vodMergeData = (playFrom:any,playUrl:any) => {
    const pFrom = playFrom.split('$$$');
    const pUrl = Linq.from(playUrl.split('$$$'))
                    .select((ssItem:any) => (Linq.from(ssItem.split('#')).select((item:any) => {const a2 = item.split('$');return {name:a2[0],url:a2[1]}}).toArray()))
                    .toArray();
    const mergeData =  Linq.from(pFrom).select((x:any,index)=>({from:x?x.replace('m3u8',''):'',data:pUrl[index]})).toArray();
    return mergeData
}