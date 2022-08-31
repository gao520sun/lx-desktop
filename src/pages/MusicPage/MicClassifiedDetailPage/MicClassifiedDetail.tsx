import { useRequest } from '@umijs/max'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { classifiedSongDetail, getAlbumInfo, getArtistInfo } from '@/services/netease';
import ErrorView from '@/pages/Components/ErrorView';
import LoadingView from '@/pages/Components/LoadingView';
import { Flex, FlexCenter, FlexColumn, FlexHeight10, FlexHeight12, FlexImage, FlexRow, FlexText, FlexWidth, FlexWidth10, FlexWidth12 } from '@/globalStyle';
import { PlayArrow, Add, AddCard, PlayArrowRounded, FavoriteBorder, DeleteForever } from '@mui/icons-material';
import THEME from '@/pages/Config/Theme';
import { formatTime } from '@/utils/VodDate';
import { message, Tooltip, Typography } from 'antd';
import PubSub from 'pubsub-js'
import CreateSongListModalView from '../MicMainPage/Views/CreateSongListModalView';
import { deleteSingleSongList,deleteSingSong, getCollectSingleSongList, getCollectSongList, getSingleSongList, saveNetworkSongList } from '../MicMainPage/SongListModel';
import { useModel } from '@umijs/max';
const Con = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 60px;
  padding-bottom: 60px;
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
const SongContentDiv = styled(FlexColumn)`
  padding: 12px;
  padding-top: 0;
`
const SongTopDiv = styled(FlexRow)`
  width:100%;
  height:50px;
  padding:0 12px;
  background-color:#fff;
  align-items: center;
 
`
const SongItemDiv = styled(SongTopDiv)`
  width:100%;
  height:50px;
  padding:0 12px;
  background-color:#fff;
  align-items: center;
  &:hover{
    background-color:#f0f0f0;
  };
`
const SongItemToolDiv = styled(FlexRow)`
  margin-right: 12px;
  display: none;
  ${SongItemDiv}:hover &{// ${SongItemDiv}:hover 必须连起来一起写  & 表示当前的组件
    display: flex;
  }
`
const CellText = styled(FlexText).attrs({
  numberOfLine:1,
})`
  font-size:14px;
  color:#333;
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
  params?:any
}

const MicClassifiedDetail = (props:IProps) => {
  const params = props.params;
  // console.log('params::',params)
  const {micNavigate} =  useModel('global');
  const [showModal, setShowModal] = useState(false);
  const [updatePage, setUpdatePage] = useState(false);
  const [saveSong, setSaveSong] = useState([]);
  const [list, setList] = useState([]);
  const [songInfo, setSongInfo] = useState<any>({});
  const getDataApi:any = () => {
    if(props.params.type == 'album'){
      return getAlbumInfo;
    }else if(props.params.type == 'artist'){
      return getArtistInfo
    }
    return classifiedSongDetail
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
  // 单个播放
  const onPlayClick = (item:any) => {
    PubSub.publishSync(window.MIC_TYPE.oneSongPlay,item)
  }
  // 添加到当前播放列表
  const onAddPlayerListClick = (item:any) => {
    PubSub.publishSync(window.MIC_TYPE.addSongPlay,[item]);
    altMsg();
  }
  const altMsg = (msg?:string) => {
    message.success(msg || '添加至当前播放列表')
  }
  // 添加到歌单中
  const onAddSongListClick = (item:any) => {
    setSaveSong([item]);
    setShowModal(true);
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
  // 删除某个单曲歌单
  const onDeleteSongClick = (item:any) => {
    const res = deleteSingSong(songInfo.name,item);
    if(res.status == 0){
      message.success(res.message);
      setUpdatePage(!updatePage)
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
  const songCellView = (item:any,index:number) => {
    const isShowDelete = props.params.type == 'custom'? true : false;
    const indexStr = index+1 >= 10 ? index+1 : '0' + (index+1)
    return (
      <SongItemDiv key={item.id}>
        <FlexRow style={{width:'46%',flexShrink:0}}>
          <CellText>{`${indexStr}. ${item.name}`}</CellText>
          <Flex/>
          <SongItemToolDiv>
            <FlexCenter onClick={() => onPlayClick(item)}><PlayArrow sx={iconStyle}/></FlexCenter>
            <FlexWidth/>
            <FlexCenter onClick={() => onAddPlayerListClick(item)}><Add sx={iconStyle}/></FlexCenter>
            <FlexWidth/>
            <FlexCenter onClick={() => onAddSongListClick(item)}><AddCard sx={iconStyle}/></FlexCenter>
            <FlexWidth/>
            {isShowDelete ? <>
              <FlexCenter onClick={() => onDeleteSongClick(item)}><DeleteForever sx={iconStyle}/></FlexCenter>
              <FlexWidth/>
            </> : null}
          </SongItemToolDiv>
        </FlexRow>
        <FlexRow style={{width:'22%',flexShrink:0,paddingRight:10}}>
          <CellText>{item.artist_name}</CellText>
        </FlexRow>
        <FlexRow style={{width:'22%',flexShrink:0,paddingRight:10}}>
          <CellText>{item.album}</CellText>
        </FlexRow>
        <FlexRow style={{width:'10%',flexShrink:0}}>
          <CellText>{formatTime(item.duration / 1000)}</CellText>
        </FlexRow>
      </SongItemDiv>
    )
  }
  const songListView = () => {
    return (
      <SongContentDiv>
        <SongTopDiv style={{height:30}}>
          <FlexRow style={{width:'46%',flexShrink:0}}>
            <FlexText style={{color:'#666'}}>歌曲({list.length})</FlexText>
          </FlexRow>
          <FlexRow style={{width:'22%',flexShrink:0,paddingRight:10}}>
            <FlexText style={{color:'#666'}}>歌手</FlexText>
          </FlexRow>
          <FlexRow style={{width:'22%',flexShrink:0,paddingRight:10}}>
            <FlexText style={{color:'#666'}}>专辑</FlexText>
          </FlexRow>
          <FlexRow style={{width:'10%',flexShrink:0}}>
          <FlexText style={{color:'#666'}}>时长</FlexText>
          </FlexRow>
        </SongTopDiv>
        {list?.map((item,index:number) => songCellView(item,index))}
      </SongContentDiv>
    )
  }
  return (
    <Con>
      {headerView()}
      {songListView()}
      {!loading && !list.length ? <ErrorView textStyle={{color:'#333'}} msg='暂无数据'/>:null}
      <CreateSongListModalView showModal = {showModal} saveData={saveSong} onCancel={() => setShowModal(false)}/>
    </Con>
  )
}

export default MicClassifiedDetail