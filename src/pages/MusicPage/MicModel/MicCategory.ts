

import netease from '@/services/netease';
import qq from '@/services/qq';
export const sourceDefKey = 'netease'
export const sourceList = [
    {
      key: 'netease',
      title: '网易云音乐',
    },
    {
      key: 'qq',
      title: 'QQ音乐',
    },
    {
        key: 'kugou',
      title: '酷狗音乐',
    },
    {
        key: 'kuwo',
      title: '酷我音乐',
    },
    {
        key: 'bilibili',
      title: '哔哩哔哩',
    },
    {
        key: 'migu',
      title: '咪咕音乐',
    },
    {
        key: 'taihe',
      title: '千千音乐',
    },
];

export const classifiedSongList = (micSLSourceKey:string = sourceDefKey) => {
  if(micSLSourceKey == 'netease'){
    return netease.classifiedSongList;
  }else if(micSLSourceKey == 'qq'){
    return qq.classifiedSongList;
  }
  return new Promise((res,ref) => {res(statusHandle)})
}
export const classifiedSongDetail =  (micSLSourceKey:string = sourceDefKey) => {
  if(micSLSourceKey == 'netease'){
    return netease.classifiedSongDetail;
  }else if(micSLSourceKey == 'qq'){
    return qq.classifiedSongDetail;
  }
  return new Promise((res,ref) => {res(statusHandle)})
}
export const playerUrl =  (micSLSourceKey:string = sourceDefKey) => {
  if(micSLSourceKey == 'netease'){
    return netease.playerUrl;
  }else if(micSLSourceKey == 'qq'){
    return qq.playerUrl;
  }
  return new Promise((res,ref) => {res(statusHandle)})
}
export const getLyric =  (micSLSourceKey:string = sourceDefKey) => {
  if(micSLSourceKey == 'netease'){
    return netease.getLyric;
  }else if(micSLSourceKey == 'qq'){
    return qq.getLyric;
  }
  return new Promise((res,ref) => {res(statusHandle)})
}
export const getAlbumInfo =  (micSLSourceKey:string = sourceDefKey) => {
  if(micSLSourceKey == 'netease'){
    return netease.getAlbumInfo;
  }else if(micSLSourceKey == 'qq'){
    return qq.getAlbumInfo;
  }
  return new Promise((res,ref) => {res(statusHandle)})
}
export const getArtistInfo =  (micSLSourceKey:string = sourceDefKey) => {
  if(micSLSourceKey == 'netease'){
    return netease.getArtistInfo;
  }else if(micSLSourceKey == 'qq'){
    return qq.getArtistInfo;
  }
  return new Promise((res,ref) => {res(statusHandle)})
}
export const getTopList =  (micSLSourceKey:string = sourceDefKey) => {
  if(micSLSourceKey == 'netease'){
    return netease.getTopList;
  }else if(micSLSourceKey == 'qq'){
    return qq.getTopList;
  }
  return new Promise((res,ref) => {res(statusHandle)})
}
export const getPlayListFilters =  (micSLSourceKey:string = sourceDefKey) => {
  if(micSLSourceKey == 'netease'){
    return netease.getPlayListFilters;
  }else if(micSLSourceKey == 'qq'){
    return qq.getPlayListFilters;
  }
  return new Promise((res,ref) => {res(statusHandle)})
}


const statusHandle = {
  status:-1,
  message:'未找到音频来源'
}