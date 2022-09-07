import { eapi, getParameterByName, split_array, weapi } from "@/utils/MicUtil";
import { responseError, responseSuccess } from "@/utils/response";
import { request } from "@umijs/max"
import Linq from 'linq'
interface IClassifiedSong {
  filterId:string,
  limit:number,
  offset:number,
  order?:string,
  cat?:string,// 华语 流行等
}
// 分类歌单
export const classifiedSongList = async (params:IClassifiedSong) => {
    const res =   await request('https://music.163.com/discover/playlist',{method:'GET',params:params})
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
      id: `${getParameterByName('id',item.getElementsByTagName('div')[0].getElementsByTagName('a')[0].href)}`,
      source_url: `https://music.163.com/#/playlist?id=${getParameterByName('id',item.getElementsByTagName('div')[0].getElementsByTagName('a')[0].href)}`,
    }));
    return responseSuccess(result)
  }
// 歌单详情
export const classifiedSongDetail = async (id:string='') => {
    const d:any = {id: id,offset: 0,total: true,limit: 1000,n: 1000,csrf_token: ''}
    const data = weapi(d);
    const target_url = 'https://music.163.com/weapi/v3/playlist/detail';
    const res =   await request(target_url,{method:'POST',data:new URLSearchParams(data).toString()})
    const res_track = await classifiedSongDetailTrack(res.playlist.trackIds);
    return responseSuccess({info:fixedSongBaseInfo(res.playlist),list:res_track})
}
// 获取歌曲详情
export const classifiedSongDetailTrack = async(playlist_tracks=[]) => {
  const url = 'https://music.163.com/api/song/detail';
  const track_ids = playlist_tracks.map((i: { id: any; }) => i.id);
  const d = {ids: `[${track_ids.join(',')}]`,};
  const res =   await request(url,{method:'GET',params:d})
  const tracks = res.songs.map((data: any) => fixedSongInformation(data));
  return tracks;
}
// 获取需要播放我url地址
export const playerUrl = async (track: any) => {
  console.log('playerUrl-track1111;:',track)
  const sound:any = {};
  const target_url = `https://interface3.music.163.com/eapi/song/enhance/player/url`;
  let song_id = track.id;
  const eapiUrl = '/api/song/enhance/player/url';
  const d = {ids: `[${song_id}]`,br: 999000,};
  const data = eapi(eapiUrl, d);
  const res =   await request(target_url,{method:'POST',data:new URLSearchParams(data).toString()})
  const { data: res_data } = res;
  const { url, br } = res_data[0];
  if (url != null) {
    sound.url = url;
    const bitrate = `${(br / 1000).toFixed(0)}kbps`; // 码率
    sound.bitrate = bitrate;
    sound.platform = 'netease';
    return responseSuccess({...track,...sound})
  }
  return responseError('当前播放地址不存在')
}
// 获取歌词
export const getLyric = async (id:string='') => {
  const target_url = 'https://music.163.com/weapi/song/lyric?csrf_token=';
  const csrf = '';
  const d:any = {id: id,lv: -1,tv: -1,csrf_token: csrf,};
  const data = weapi(d);
  const res =   await request(target_url,{method:'POST',data:new URLSearchParams(data).toString()})
  if(res){
    return responseSuccess(res.lrc?.lyric)
  }
  return responseError('未获取数据')
}
// 获取排行帮
export const getTopList = async () => {
  const url = 'https://music.163.com/weapi/toplist/detail';
  const data = weapi({});
  const res =   await request(url,{
    method:'POST',
    data:new URLSearchParams(data).toString()
  })
  if(res) {
    const list = res.list.map((data:any) => topListDataHandle(data))
    return responseSuccess(list)
  }
  return responseError('暂无数据')
}
// 获取专辑信息
interface IAlbum {
  album_id:string,
  offset:number,
  limit:number,
}
// 获取专辑信息
export const getAlbumInfo = async (params:IAlbum) => {
  const target_url = `https://music.163.com/api/album/${params.album_id}?ext=true&id=${params.album_id}&offset=${params.offset}&total=true&limit=${params.limit}`;
  const res =  await request(target_url,{method:'GET'});
  if(res?.album?.songs){
    const tracks = res.album.songs.map((data: any) => fixedSongInformation(data));
    return responseSuccess({info:fixedSongBaseInfo(res.album),list:tracks})
  }
  return responseError('暂无数据')
}
// 歌手歌曲网易前50首
export const getArtistInfo = async (artist_id:any) => {
  const target_url = `https://music.163.com/api/artist/${artist_id}?ext=true&id=${artist_id}&offset=50&total=true&limit=10`;
  const res =  await request(target_url,{method:'GET'});
  const tracks = res.hotSongs.map((data: any) => (fixedSongInformation(data)));
  return responseSuccess({info:fixedSongBaseInfo(res.artist),list:tracks})
}
// 搜索信息
interface ISearch {
  offset:number,
  keywords:string,
  type?:number
}
// type=1 单曲, type=10 专辑, type=100 歌手, type=1000 歌单, type=1002 用户, type=1004 MV, type=1006 歌词, ype=1009 主播电台,
export const getSearchInfo = async (params:ISearch = {type:1000, offset:0, keywords:''}) => {
    const req_data = {s: params.keywords,offset: params.offset,limit: 20,type: params.type,csrf_token:'hlpretag=',hlposttag:'',};
    let url = 'https://music.163.com/api/search/get/web'
    // let urll = 'api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=周杰伦&type=1&offset=0&total=true&limit=20'
    const res = await request(url,{method:'GET',params:req_data})
    if(res?.result){
      const tracks = res.result?.songs?.map((data: any) => (fixedSongInformation(data)))  || [];
      return responseSuccess({total:res.result.songCount,songs:tracks})
    }
    return responseError('服务异常，请稍后重试');
}
// 获取歌单分类信息
const getPlayListFilters = async() => {
    return new Promise((resolve)=>{
      resolve(responseSuccess({all:classifyAll(),recommend:classifyRecommend()}))
    })
}
// 固定歌曲信息-> list显示，存储等
const fixedSongInformation = (data:any) => {
  return {
    id: `${data.id}`, //  歌曲ID
    name: data.name, // 歌曲名字
    artist_list: data.artists,//歌手信息 一首歌可以有多个
    artist_name: data.artists[0].name,//  歌手名字s
    artist_id: `${data.artists[0].id}`, // 歌手id
    artist_pic: data.artists[0].picUrl, // 歌手图片
    album: data.album.name, // 专辑名字
    album_pic: data.album.picUrl, // 专辑封面
    album_id: `${data.album.id}`, // 专辑id
    source: 'netease', // 来源网易
    source_url: `https://music.163.com/#/song?id=${data.id}`, // 来源链接
    duration:data.duration , // 歌曲时长
  }
}
const fixedSongBaseInfo = (data:any={}) =>  {
  return {
    // 歌曲名字 作者的名字等
    name:data.name,
    // 歌曲id 专辑id 第二个
    id:data.id,
    // 封面
    coverImgUrl:data.coverImgUrl || data.picUrl,
    // 作者
    nickname:data.creator?.nickname || data.name || '音乐人',
    // 作者头像
    avatarUrl:data.creator?.avatarUrl || data.picUrl || '',
    // 描述
    description:data.description || '',//
    // 表签
    tag:data.tags || [],
  }
}
// 排行榜
const topListDataHandle = (data:any) => {
  return {
    playCount:data.playCount,
    name:data.name,
    coverImgUrl:data.coverImgUrl,
    songList:data.tracks,// [first:,second:'']
    id:data.id,
    source:'netease',
    updateTime:data.updateTime,
  }
}
const classifyRecommend = () => {
  const recommend = [
    { id: '', name: '全部' },
    { id: '流行', name: '流行' },
    { id: '民谣', name: '民谣' },
    { id: '电子', name: '电子' },
    { id: '舞曲', name: '舞曲' },
    { id: '说唱', name: '说唱' },
    // { id: '轻音乐', name: '轻音乐' },
    // { id: '爵士', name: '爵士' },
    // { id: '乡村', name: '乡村' },
  ];
  return recommend;
}
const classifyAll = () => {
  const all = [
    {
      category: '语种',
      filters: [
        { id: '华语', name: '华语' },
        { id: '欧美', name: '欧美' },
        { id: '日语', name: '日语' },
        { id: '韩语', name: '韩语' },
        { id: '粤语', name: '粤语' },
      ],
    },
    {
      category: '风格',
      filters: [
        { id: '流行', name: '流行' },
        { id: '民谣', name: '民谣' },
        { id: '电子', name: '电子' },
        { id: '舞曲', name: '舞曲' },
        { id: '说唱', name: '说唱' },
        { id: '轻音乐', name: '轻音乐' },
        { id: '爵士', name: '爵士' },
        { id: '乡村', name: '乡村' },
        { id: 'R%26B%2FSoul', name: 'R&B/Soul' },
        { id: '古典', name: '古典' },
        { id: '民族', name: '民族' },
        { id: '英伦', name: '英伦' },
        { id: '金属', name: '金属' },
        { id: '朋克', name: '朋克' },
        { id: '蓝调', name: '蓝调' },
        { id: '雷鬼', name: '雷鬼' },
        { id: '世界音乐', name: '世界音乐' },
        { id: '拉丁', name: '拉丁' },
        { id: 'New Age', name: 'New Age' },
        { id: '古风', name: '古风' },
        { id: '后摇', name: '后摇' },
        { id: 'Bossa Nova', name: 'Bossa Nova' },
      ],
    },
    {
      category: '场景',
      filters: [
        { id: '清晨', name: '清晨' },
        { id: '夜晚', name: '夜晚' },
        { id: '学习', name: '学习' },
        { id: '工作', name: '工作' },
        { id: '午休', name: '午休' },
        { id: '下午茶', name: '下午茶' },
        { id: '地铁', name: '地铁' },
        { id: '驾车', name: '驾车' },
        { id: '运动', name: '运动' },
        { id: '旅行', name: '旅行' },
        { id: '散步', name: '散步' },
        { id: '酒吧', name: '酒吧' },
      ],
    },
    {
      category: '情感',
      filters: [
        { id: '怀旧', name: '怀旧' },
        { id: '清新', name: '清新' },
        { id: '浪漫', name: '浪漫' },
        { id: '伤感', name: '伤感' },
        { id: '治愈', name: '治愈' },
        { id: '放松', name: '放松' },
        { id: '孤独', name: '孤独' },
        { id: '感动', name: '感动' },
        { id: '兴奋', name: '兴奋' },
        { id: '快乐', name: '快乐' },
        { id: '安静', name: '安静' },
        { id: '思念', name: '思念' },
      ],
    },
    {
      category: '主题',
      filters: [
        { id: '综艺', name: '综艺' },
        { id: '影视原声', name: '影视原声' },
        { id: 'ACG', name: 'ACG' },
        { id: '儿童', name: '儿童' },
        { id: '校园', name: '校园' },
        { id: '游戏', name: '游戏' },
        { id: '70后', name: '70后' },
        { id: '80后', name: '80后' },
        { id: '90后', name: '90后' },
        { id: '网络歌曲', name: '网络歌曲' },
        { id: 'KTV', name: 'KTV' },
        { id: '经典', name: '经典' },
        { id: '翻唱', name: '翻唱' },
        { id: '吉他', name: '吉他' },
        { id: '钢琴', name: '钢琴' },
        { id: '器乐', name: '器乐' },
        { id: '榜单', name: '榜单' },
        { id: '00后', name: '00后' },
      ],
    },
  ];
  return all
}

export default {
  classifiedSongList,
  classifiedSongDetail,
  playerUrl,
  getLyric,
  getTopList,
  getAlbumInfo,
  getArtistInfo,
  getSearchInfo,
  getPlayListFilters
}












// 歌单详情的数据，在获取具体数据
// export const classifiedSongDetailTrack = async (playlist_tracks:any) => {
//     const target_url = 'weapi/v3/song/detail';
//     const track_ids = playlist_tracks.map((i: { id: any; }) => i.id);
//     const d:any = {c: `[${track_ids.map((id: any) => `{"id":${id}}`).join(',')}]`,ids: `[${track_ids.join(',')}]`};
//     const data = weapi(d);
//     const res =   await request(target_url,{method:'POST',data:new URLSearchParams(data).toString()})
//     // 最终数据格式
//     const tracks = res.songs.map((track_json:any) => ({
//       id: `netrack_${track_json.id}`,
//       title: track_json.name,
//       artist: track_json.ar[0].name,
//       artist_id: `neartist_${track_json.ar[0].id}`,
//       album: track_json.al.name,
//       album_id: `nealbum_${track_json.al.id}`,
//       source: 'netease',
//       source_url: `https://music.163.com/#/song?id=${track_json.id}`,
//       img_url: track_json.al.picUrl,
//       // url: `netrack_${track_json.id}`,
//     }));
//     return tracks
// }