import { responseError, responseSuccess } from "@/utils/response";
import { request } from "@umijs/max"
import Linq from 'linq'
// 分类歌单
interface IClassifiedSong {
    filterId:string,
    limit:number,
    offset:number,
    order?:string,
    cat?:string,// 华语 流行等
}
export const classifiedSongList = async (params:IClassifiedSong) => {
    const target_url =
      'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg' +
      `?picmid=1&rnd=${Math.random()}&g_tk=732560869` +
      '&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8' +
      '&notice=0&platform=yqq.json&needNewCode=0' +
      `&categoryId=${params.filterId}&sortId=5&sin=${params.offset}&ein=${params.limit + params.offset}`;
    const res =   await request(target_url,{})
    if(res?.data){
        const sourceUrl = `https://y.qq.com/n/ryqq/playlist/${params.filterId}`
        const result = res.data.list.map((item:any) => ({
            cover_url: item.imgurl,
            title: htmlDecode(item.dissname),
            name: item.creator?.name || '',
            count:  item.listennum,
            id: item.dissid,
            source_url: sourceUrl,
          }));
           return responseSuccess(result)
    }else {
        responseError('服务错误')
    }
    
}
// 歌单详情
export const classifiedSongDetail = async (id:string='') => {
    const target_url =
    'https://i.y.qq.com/qzone-music/fcg-bin/fcg_ucc_getcdinfo_' +
    'byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0' +
    `&nosign=1&disstid=${id}&g_tk=5381&loginUin=0&hostUin=0` +
    '&format=json&inCharset=GB2312&outCharset=utf-8&notice=0' +
    '&platform=yqq&needNewCode=0';
    const res =   await request(target_url)
    if(res){
      const sourceUrl = `https://y.qq.com/n/ryqq/playlist/${id}`
      const tracks =  res.cdlist[0].songlist.map((data: any) => fixedSongInformation({...data,sourceUrl}));
      return responseSuccess({info:fixedSongBaseInfo(res.cdlist[0]),list:tracks})
    }
    return responseError('未获取数据')
}
// 获取需要播放我url地址
export const playerUrl = async (track: any) => {
    const sound:any = {};
    const songId = track.id;
    const target_url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
    const guid = '10000';
    const songmidList = [songId];
    const uin = '0';
    const fileType = '128';
    const fileConfig = {
      m4a: {
        s: 'C400',
        e: '.m4a',
        bitrate: 'M4A',
      },
      128: {
        s: 'M500',
        e: '.mp3',
        bitrate: '128kbps',
      },
      320: {
        s: 'M800',
        e: '.mp3',
        bitrate: '320kbps',
      },
      ape: {
        s: 'A000',
        e: '.ape',
        bitrate: 'APE',
      },
      flac: {
        s: 'F000',
        e: '.flac',
        bitrate: 'FLAC',
      },
    };
    const fileInfo = fileConfig[fileType];
    const file =
      songmidList.length === 1 &&
      `${fileInfo.s}${songId}${songId}${fileInfo.e}`;

    const reqData = {
      req_0: {
        module: 'vkey.GetVkeyServer',
        method: 'CgiGetVkey',
        param: {
          filename: file ? [file] : [],
          guid,
          songmid: songmidList,
          songtype: [0],
          uin,
          loginflag: 1,
          platform: '20',
        },
      },
      loginUin: uin,
      comm: {
        uin,
        format: 'json',
        ct: 24,
        cv: 0,
      },
    };
    const params = {
      format: 'json',
      data: JSON.stringify(reqData),
    };
    const res =   await request(target_url,{method:'GET',params:params})
    const { data } = res.req_0;
    const { purl } = data.midurlinfo[0];
    if (purl != '') {
        const prefix = purl.slice(0, 4);
        const url = data.sip[0] + purl;
        const found = Object.values(fileConfig).filter((i) => i.s === prefix);
        sound.url = url;
        const bitrate = found.length > 0 ? found[0].bitrate : '';; // 码率
        sound.bitrate = bitrate;
        sound.platform = 'qq';
        return responseSuccess({...track,...sound})
      }
      return responseError('当前播放地址不存在')
}
// 获取歌词
export const getLyric = async (id:string='') => {
    const target_url ='https://i.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?' +
    `songmid=${id}&g_tk=5381&format=json&inCharset=utf8&outCharset=utf-8&nobase64=1`;
    const res =   await request(target_url)
    if(res){
      return responseSuccess(res.lyric)
    }
    return responseError('未获取数据')
}
// 获取排行帮
export const getTopList = async () => {
  // const url =
  //     'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&uin=0&needNewCode=1&platform=h5';
      const params = {
        g_tk: 5381,
        uin: 0,
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        _: new Date().getTime(),
      }
  const res =   await request('https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',{params:params})
  // const res =   await request(url,{})
  if(res) {
    const list = res.data.topList.map((data:any) => topListDataHandle(data))
    return responseSuccess(list)
  }
  return responseError('暂无数据')
}
// 获取专辑信息
export const getAlbumInfo = async (params:any) => {
    const target_url =
            'https://i.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg' +
            `?platform=h5page&albummid=${params.album_id}&g_tk=938407465` +
            '&uin=0&format=json&inCharset=utf-8&outCharset=utf-8' +
            '&notice=0&platform=h5&needNewCode=1&_=1459961045571';
    const res = await request(target_url);
    console.log('res::',res)
    if(res){
      const sourceUrl = `https://y.qq.com/#type=album&mid=${params.album_id}`
      const tracks =  res.data.list.map((data: any) => fixedSongInformation({...data,sourceUrl}));
      return responseSuccess({info:fixedSongBaseInfo(res.data),list:tracks})
    }
    return responseError('未获取数据')
}
// 歌手歌曲
export const getArtistInfo = async (id:string) => {
  const target_url = `https://u.y.qq.com/cgi-bin/musicu.fcg?format=json&loginUin=0&hostUin=0inCharset=utf8&outCharset=utf-8&platform=yqq.json&needNewCode=0&data=${encodeURIComponent(
    JSON.stringify({
      comm: {
        ct: 24,
        cv: 0,
      },
      singer: {
        method: 'get_singer_detail_info',
        param: {
          sort: 5,
          singermid: id,
          sin: 0,
          num: 50,
        },
        module: 'music.web_singer_info_svr',
      },
    })
  )}`;
  const res = await request(target_url);
    if(res){
      const sourceUrl = `https://y.qq.com/#type=singer&mid=${id}`
      const tracks =  res.singer.data.songlist.map((data: any) => fixedSongInformation({...data,sourceUrl}));
      return responseSuccess({info:fixedSongBaseInfo(res.singer.data),list:tracks})
    }
    return responseError('未获取数据')
}
// 
export const getPlayListFilters = async () => {
  const target_url =
  'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg' +
  `?picmid=1&rnd=${Math.random()}&g_tk=732560869` +
  '&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8' +
  '&notice=0&platform=yqq.json&needNewCode=0';
  const res = await request(target_url);
  const { data } = res;
  if(data){
    const all:any = [];
    data.categories.forEach((cate:any) => {
      const result:any = { category: cate.categoryGroupName, filters: [] };
      if (cate.usable === 1) {
        cate.items.forEach((item:any) => {
          result.filters.push({
            id: item.categoryId,
            name: htmlDecode(item.categoryName),
          });
        });
        all.push(result);
      }
    });
    const recommendLimit = 5;
    const recommend = [
      { id: '', name: '全部' },
      ...all[1].filters.slice(0, recommendLimit),
    ];
    return responseSuccess({all,recommend})
  }else {
    return responseError('未获取数据')
  }
}
export const getSearchInfo = async (params:any) => {
  const target_url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
  const searchTypeMapping:any = {0: 0,1: 3,};
  const limit = params.limit || 20;
  const query = {
    comm: {ct: '19',cv: '1859',uin: '0',},
    req: {
      method: 'DoSearchForQQMusicDesktop',
      module: 'music.search.SearchCgiService',
      param: {grp: 1,num_per_page: limit,page_num: parseInt(params.offset / limit + 1, 10),query: params.keywords,search_type: searchTypeMapping[params.searchType],},
    },
  };
  const res = await request(target_url,{method:'POST',data:query});
  
  const tracks =  res.req?.data?.body?.song?.list.map((data: any) => {
    const sourceUrl = `https://y.qq.com/#type=song&mid=${data.mid}&tpl=yqq_song_detail`
    return fixedSongInformation({...data,sourceUrl})
  });
  console.log('res',tracks)
  if(res && tracks){
    return responseSuccess({total:0,songs:tracks})
  }
  return responseError('服务异常，请稍后重试');
  
}
// 名字可能带html
function htmlDecode(value:any) {
    const parser = new DOMParser();
    return parser.parseFromString(value, 'text/html').body.textContent;
}
// 歌曲是否存在
function qqIsPlayable(song:any) {
    const switch_flag = song.switch ? song.switch.toString(2).split('') : song.action.switch.toString(2).split('');
    switch_flag.pop();
    switch_flag.reverse();
    // flag switch table meaning:
    // ["play_lq", "play_hq", "play_sq", "down_lq", "down_hq", "down_sq", "soso",
    //  "fav", "share", "bgm", "ring", "sing", "radio", "try", "give"]
    const play_flag = switch_flag[0];
    const try_flag = switch_flag[13];
    return play_flag === '1' || (play_flag === '1' && try_flag === '1');
}
  // 固定歌曲信息-> list显示，存储等
const fixedSongInformation = (data:any) => {
    return {
      id: data.songmid || data.mid, //  歌曲ID
      name: data.songname || data.name, // 歌曲名字
      artist_list: data.singer,//歌手信息 一首歌可以有多个
      artist_name: htmlDecode(data.singer[0].name),//  歌手名字s
      artist_id: data.singer[0].mid, // 歌手id
      artist_pic: getImageUrl(data.singer[0].mid,'artist'), // 歌手图片
      album: htmlDecode(data.albumname || data.songname || data.album?.name || ''), // 专辑名字
      album_pic: getImageUrl(data.albummid || data.album?.mid || '','album'), // 专辑封面
      album_id: data.albummid || data.album?.mid || '', // 专辑id
      source: 'qq', 
      source_url: data.sourceUrl, // 来源链接
      duration:data.interval * 1000 , // 歌曲时长
    //   url: qqIsPlayable(data) ? '' : undefined,
      is_playable:qqIsPlayable(data) ? '' : undefined,
    }
}
// 歌单头部显示信息
const fixedSongBaseInfo = (data:any={}) =>  {
  return {
    // 歌曲名字 作者的名字等
    name:data.dissname ||  data.singer_info?.name || data.name || '',
    // 歌曲id 专辑id 第二个
    id:data.dissid,
    // 封面
    coverImgUrl: data.logo || getImageUrl(data.mid,'album') || getImageUrl(data.singermid || data.singer_info?.mid,'artist'),
    // 作者
    nickname:data.nickname || data.singer_info?.name || data.singername  || '音乐人',
    // 作者头像
    avatarUrl:data.headurl || getImageUrl(data.singermid || data.singer_info?.mid,'artist') || data.logo ||  '',
    // 描述
    description:data.desc || data.singer_brief,//
    // 表签
    tags:Linq.from(data.tags).select((x:any) => x.name).toArray() || [],
  }
}

// 排行榜
const topListDataHandle = (data:any) => {
  const list = Linq.from(data.songList).select((x:any)=>({first:x.songname,second:x.singername})).toArray()
  return {
    playCount:data.listenCount,
    name:data.topTitle,
    coverImgUrl:data.picUrl,
    songList:list,
    id:data.id,
    source:'qq',
    updateTime:'',
  }
}

function getImageUrl(qqimgid:string, img_type:string) {
    if (qqimgid == null) {
      return '';
    }
    let category = '';
    if (img_type === 'artist') {
      category = 'T001R300x300M000';
    }
    if (img_type === 'album') {
      category = 'T002R300x300M000';
    }
    const s = category + qqimgid;
    const url = `https://y.gtimg.cn/music/photo_new/${s}.jpg`;
    return url;
  }

  export default {
    classifiedSongList,
    classifiedSongDetail,
    playerUrl,
    getLyric,
    getTopList,
    getAlbumInfo,
    getArtistInfo,
    getPlayListFilters,
    getSearchInfo
  }