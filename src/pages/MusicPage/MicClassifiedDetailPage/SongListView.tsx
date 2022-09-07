import { FlexColumn, FlexRow, Flex, FlexCenter, FlexWidth, FlexText } from '@/globalStyle'
import THEME from '@/pages/Config/Theme'
import { formatTime } from '@/utils/VodDate'
import { PlayArrow, Add, AddCard, DeleteForever } from '@mui/icons-material'
import { message } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import { deleteSingSong } from '../MicModel/SongListModel'
import CreateSongListModalView from '../MicMainPage/Views/CreateSongListModalView';
import { useModel } from '@umijs/max'
import EditSongListModalView from '../MicMainPage/Views/EditSongListModalView'
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
const iconStyle={color:'#999',fontSize:20,":hover":{color:THEME.theme},cursor: 'pointer'}
const SongListView = (props:any) => {
  const {micNavigate} =  useModel('global');
    const [showModal, setShowModal] = useState(false);
    const [saveSong, setSaveSong] = useState([]);
    // 单个播放
    const onPlayClick = (item:any) => {
        PubSub.publishSync(window.MIC_TYPE.oneSongPlay,item)
        altMsg();
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
    // 删除某个单曲歌单
    const onDeleteSongClick = (item:any) => {
        const res = deleteSingSong(props.songInfo?.name,item);
        if(res.status == 0){
            message.success(res.message);
            typeof props.onDeleteSongClick == 'function' && props.onDeleteSongClick()
        }else {
            message.error(res.message)
        }
    }
    const songCellView = (item:any,index:number) => {
        const isShowDelete = props.params.type == 'custom'? true : false;
        const indexStr = index+1 >= 10 ? index+1 : '0' + (index+1)
        return (
          <SongItemDiv key={item.id + item.name +  index}>
            <FlexRow style={{width:'46%',flexShrink:0,cursor:'pointer'}} onClick={() => onPlayClick(item)}>
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
            <FlexRow style={{width:'22%',flexShrink:0,paddingRight:10,cursor:'pointer'}} onClick={() => micNavigate?.push('MicClassifiedDetail',{type:'artist',...item})}>
              <CellText>{item.artist_name}</CellText>
            </FlexRow>
            <FlexRow style={{width:'22%',flexShrink:0,paddingRight:10,cursor:'pointer'}} onClick={() => micNavigate?.push('MicClassifiedDetail',{type:'album',...item})}>
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
                <FlexText style={{color:'#666'}}>歌曲({props.list.length})</FlexText>
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
            {props.list?.map((item:any,index:number) => songCellView(item,index))}
          </SongContentDiv>
        )
      }
  return (
    <FlexColumn>
        {songListView()}
        <CreateSongListModalView showModal = {showModal} saveData={saveSong} onCancel={() => setShowModal(false)}/>
    </FlexColumn>
  )
}

export default SongListView
