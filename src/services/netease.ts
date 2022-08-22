import { getParameterByName, split_array, weapi } from "@/utils/MicUtil";
import { request } from "@umijs/max"

interface IClassifiedSong {
    order:string,
    limit:number,
    offset:number
}
// 分类歌单
export const classifiedSongList = async (params:IClassifiedSong) => {
    const res =   await request('discover/playlist',{method:'GET',params:params})
    const list_elements = Array.from(
      new DOMParser()
        .parseFromString(res, 'text/html')
        .getElementsByClassName('m-cvrlst')[0].children
    );
    const result = list_elements.map((item) => ({
      cover_url: item.getElementsByTagName('img')[0].src,
      title: item.getElementsByTagName('div')[0].getElementsByTagName('a')[0].title,
      name: item.getElementsByTagName('p')[1].getElementsByTagName('a')[0].title,
      count:  item.getElementsByTagName('div')[0].getElementsByClassName('nb')[0].innerHTML,
      id: `neplaylist_${getParameterByName('id',item.getElementsByTagName('div')[0].getElementsByTagName('a')[0].href)}`,
      source_url: `https://music.163.com/#/playlist?id=${getParameterByName('id',item.getElementsByTagName('div')[0].getElementsByTagName('a')[0].href)}`,
    }));
     return {status:200,data:result,message:''}
  }
  // 歌单详情
export const classifiedSongDetail = async (id:string='') => {
    const d:any = {id: id.split('_').pop(),offset: 0,total: true,limit: 1000,n: 1000,csrf_token: ''}
    const data = weapi(d);
    const target_url = 'weapi/v3/playlist/detail';
    const res =   await request(target_url,{method:'POST',data:new URLSearchParams(data).toString()})
    const res_track = await classifiedSongDetailTrack(res.playlist.trackIds);
    return {status:200,data:{info:res.playlist,list:res_track},message:''}
}
// 歌单详情的数据，在获取具体数据
export const classifiedSongDetailTrack = async (playlist_tracks:any) => {
    const target_url = 'weapi/v3/song/detail';
    const track_ids = playlist_tracks.map((i: { id: any; }) => i.id);
    const d:any = {c: `[${track_ids.map((id: any) => `{"id":${id}}`).join(',')}]`,ids: `[${track_ids.join(',')}]`};
    const data = weapi(d);
    const res =   await request(target_url,{method:'POST',data:new URLSearchParams(data).toString()})
    // 最终数据格式
    const tracks = res.songs.map((track_json:any) => ({
      id: `netrack_${track_json.id}`,
      title: track_json.name,
      artist: track_json.ar[0].name,
      artist_id: `neartist_${track_json.ar[0].id}`,
      album: track_json.al.name,
      album_id: `nealbum_${track_json.al.id}`,
      source: 'netease',
      source_url: `https://music.163.com/#/song?id=${track_json.id}`,
      img_url: track_json.al.picUrl,
      // url: `netrack_${track_json.id}`,
    }));
    return tracks
}