import { useRequest } from '@umijs/max'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import ErrorView from '@/pages/Components/ErrorView';
import LoadingView from '@/pages/Components/LoadingView';
import { Flex, FlexCenter, FlexColumn, FlexHeight10, FlexHeight12, FlexImage, FlexRow, FlexText, FlexWidth, FlexWidth10, FlexWidth12 } from '@/globalStyle';
import { PlayArrow, Add, AddCard, PlayArrowRounded, FavoriteBorder, DeleteForever } from '@mui/icons-material';
import THEME from '@/pages/Config/Theme';
import { message, Tooltip, Typography } from 'antd';
import PubSub from 'pubsub-js'
import { deleteSingleSongList, getCollectSingleSongList, getCollectSongList, getSingleSongList, saveNetworkSongList } from '../MicModel/SongListModel';
import { useModel } from '@umijs/max';
import SongListView from './SongListView'
import {classifiedSongDetail, getAlbumInfo, getArtistInfo } from '../MicModel/MicCategory';
const Con = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 60px;
  padding-bottom: 70px;
  overflow-y: scroll;
  background-color: #fff;
  &::-webkit-scrollbar{
        width: 8px;
        background-color: transparent;
  };
  &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #a2a3a448;
  
  }
`
const PlayBtn = styled(FlexCenter)`
  margin-top: 10px;
  color:#fff;
  width:120px;
  height:35px;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  background: linear-gradient(90deg, #ff9800, #ff2a14);
  cursor: pointer;
`
const CollectBtn = styled(FlexCenter)`
  margin-top: 10px;
  color:#222;
  width:110px;
  height:35px;
  border-radius: 50px;
  background:#e6e6e6;
  cursor: pointer;
`
const DeleteBtn = styled(FlexCenter)`
  margin-top: 10px;
  margin-left:10px;
  color:#222;
  padding:0 12px;
  height:35px;
  border-radius: 50px;
  background:#f0f0f0;
  cursor: pointer;
`
const AddSongListBtn = styled(FlexCenter)`
  margin-top: 10px;
  color:#fff;
  width:40px;
  height:35px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  background: #ff2a14;
  cursor: pointer;
  margin-left: 0.5px;
`

const iconStyle={color:'#999',fontSize:20,":hover":{color:THEME.theme},cursor: 'pointer'}
interface IProps  {
  type?:string,// 网络还是自定义歌单
  params?:any,
  sourceKey?:string
}

const MicClassifiedDetail = (props:IProps) => {
  const params = props.params;
  const {micNavigate, micSLSourceKey} =  useModel('global');
  const [updatePage, setUpdatePage] = useState(false);
  const [list, setList] = useState([]);
  const [songInfo, setSongInfo] = useState<any>({});
  const getDataApi:any = () => {
    if(props.params.type == 'album'){
      return getAlbumInfo(params.source);
    }else if(props.params.type == 'artist'){
      return getArtistInfo(params.source)
    }
    return classifiedSongDetail( props.params.source)
  }
  const {run, loading,error} = useRequest(getDataApi(),{
    manual:true,
    onSuccess:(res:any,params:any) => {
      if(res.status == 0){
        setSongInfo(res.data.info || {});
        setList(res.data.list)
      }else {
        message.error(res.message)
      }
    }
  })
  useEffect(() => {
    if(props.params.type == 'custom'){
      const slDic = getSingleSongList(params.name);
      slDic && setList(slDic.list);
      slDic && setSongInfo(slDic.info)
    }else if(props.params.type == 'collect'){
      const slDic = getCollectSingleSongList(params.name);
      slDic && setList(slDic.list);
      slDic && setSongInfo(slDic.info)
    }else if(props.params.type == 'album'){
      run({album_id:props.params.album_id,offset:0,limit:100})
    }else if(props.params.type == 'artist'){
      run(props.params.artist_id)
    }else {
      run(params.id)
    }
    
  },[updatePage])
  // 立即播放->清空当前播放列表
  const onPalyClick = () => {
    if(!list.length){message.error('当前没有数据'); return;}
    PubSub.publishSync(window.MIC_TYPE.songPlay,list)
    altMsg()
  }
  // 加入当前不播放列表 -> 不清空当前列表
  const onAddCurrentPlayerListClick = () => {
    if(!list.length){message.error('当前没有数据'); return;}
    PubSub.publishSync(window.MIC_TYPE.addSongPlay,list);
    altMsg()
  }
  const altMsg = (msg?:string) => {
    message.success(msg || '添加至当前播放列表')
  }
  // 收藏歌单
  const onCollectSongList = () => {
    const res = saveNetworkSongList(songInfo,list);
    if(res.status == 0){
      message.success(res.message)
    }else {
      message.error(res.message)
    }
  }
  // 删除歌单
  const onDeleteSongList = () => {
    const res =  deleteSingleSongList(songInfo.name,props.params.type);
    if(res.status == 0){
      message.success(res.message);
      micNavigate.pop();
    }else {
      message.error(res.message)
    }
  }
  if(loading){
    return <LoadingView textStyle={{color:'#99999970'}}/>
  }
  if(error){
    return <ErrorView/>
  }
  const headerView = () => {
    const isShowDelete = props.params.type == 'custom' ||  props.params.type == 'collect'? true : false
    return (
      <FlexRow style={{padding:12}}>
        <FlexImage style={{width:170,height:170}} src={songInfo.coverImgUrl}/>
        <FlexWidth12/>
        <FlexColumn>
          <FlexText color={'#222'} fontSize='20px' style={{}}>{songInfo.name}</FlexText>
          <FlexHeight10/>
          <FlexRow style={{alignItems:'center'}}>
            <FlexImage style={{width:30, height:30}} src={songInfo.avatarUrl}/>
            <FlexText numberOfLine={1} style={{color:'#666',fontSize:14, marginLeft:8}}>{songInfo.nickname}</FlexText>
            <FlexRow>
              {songInfo.tags?.map((item:string) => <FlexText key={item} numberOfLine={1} style={{color:'#999',fontSize:12, marginLeft:8}}>#{item}</FlexText>)}
            </FlexRow>
          </FlexRow>
          <FlexHeight12/>
          <Typography.Paragraph  ellipsis={{ rows: 2, expandable: true, symbol: '更多' }} style={{color:'#666',fontSize:14, marginBottom:0}}>{songInfo.description}</Typography.Paragraph>
         <FlexRow>
            <FlexRow>
              <PlayBtn onClick={onPalyClick}>
                  <PlayArrowRounded sx={{fontSize:24}}/>
                  <div>立即播放</div>
              </PlayBtn>
              <AddSongListBtn onClick={onAddCurrentPlayerListClick}>
                <Add sx={{fontSize:24}}/>
              </AddSongListBtn>
            </FlexRow>
            <FlexWidth10/>
            <CollectBtn onClick={onCollectSongList}>
                <FavoriteBorder sx={{fontSize:20,color:'#222'}}/>
                <div style={{marginLeft:5}}>收藏歌单</div>
            </CollectBtn>
            {isShowDelete ? <DeleteBtn onClick={onDeleteSongList}>
                <DeleteForever sx={{fontSize:20,color:'#222'}}/>
                <div style={{marginLeft:5}}>删除收藏歌单</div>
            </DeleteBtn> : null}
         </FlexRow>
        </FlexColumn>
      </FlexRow>
    )
  }
  return (
    <Con>
      {headerView()}
      <SongListView list={list} songInfo={songInfo} params={props.params} onDeleteSongClick={() => setUpdatePage(!updatePage)}/>
      {!loading && !list.length ? <ErrorView textStyle={{color:'#333'}} msg='暂无数据'/>:null}
    </Con>
  )
}

export default MicClassifiedDetail