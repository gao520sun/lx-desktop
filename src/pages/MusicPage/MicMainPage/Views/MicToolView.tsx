import { Flex, FlexCenter, FlexColumn, FlexRow, FlexText, FlexHeight10 } from '@/globalStyle'
import { AddAlarm, AddCircle } from '@mui/icons-material'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import CreateSongListModalView from './CreateSongListModalView'
import { createSongList, getCollectSongList, getSongList, saveHasSongList } from '../../MicModel/SongListModel'
import PubSub from 'pubsub-js'
import { useModel } from '@umijs/max'
import THEME from '@/pages/Config/Theme'
const Con = styled(FlexColumn)`
  width: 180px;
  height: 100%;
  flex-shrink: 0;
  &::-webkit-scrollbar{
        width: 8px;
        background-color: transparent;
  };
  &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #a2a3a448;
  }
`
const CellView = styled(FlexRow)`
  height:38px;
  align-items: center;
  padding:0 16px;
  &:hover {
    background-color: #e2e2e2;
  };
`
const YyDiv = styled(FlexColumn)`
  -webkit-app-region: drag;
  padding:12px;
`
const MicToolView = () => {
  const {micNavigate} = useModel('global')
  const [showModal, setShowModal] = useState(false);
  const [songList, setSongList] = useState([]);
  const [isNewSong] = useState(true);
  const [collectSongList, setCollectSongList] = useState([]);
  useEffect(() => {
    // clearStore();
    getSongListHandle();
    let token:any = PubSub.subscribe(window.MIC_TYPE.createSongList,(msg,data) =>{
      getSongListHandle()
    });
    return () => {
      PubSub.unsubscribe(token)
    }
  },[])
  const getSongListHandle = () => {
    const list = getSongList();
    setSongList(list)
    const cList = getCollectSongList();
    setCollectSongList(cList)
  }
  const onClassifiedDetailClick = (item:any,type:string='') => {
    micNavigate?.push('MicClassifiedDetail',{type:type,name:item.info?.name})
  }
  const platformSongListView = () => {
    return (
      <FlexColumn>
        <FlexRow style={{alignItems:'center', paddingRight:10}}>
          <FlexText color={'#999'} fontSize={12} style={{marginLeft:10}}>平台聚合</FlexText>
        </FlexRow>
          <CellView onClick={()=>micNavigate.popToTop()}>
                  <FlexText numberOfLine={1} color={'#333'}>{'精选歌单'}</FlexText>
          </CellView>
          <CellView onClick={()=>micNavigate.push('MicTopList')}>
                  <FlexText numberOfLine={1} color={'#333'}>{'排行榜'}</FlexText>
          </CellView>
      </FlexColumn>
    )
  }
  const createSongListView = () => {
    return (
      <FlexColumn>
        <FlexRow style={{alignItems:'center', paddingRight:10}}>
          <FlexText color={'#999'} fontSize={12} style={{marginLeft:10}} onClick={() => setShowModal(true)}>创建歌单</FlexText>
          <Flex/>
          <FlexCenter onClick={()=>setShowModal(true)}><AddCircle sx={{color:'#999',fontSize:20}}/></FlexCenter>
        </FlexRow>
        {songList.map((item:any) => {
          return (
            <CellView key={item.info?.name} onClick={()=>onClassifiedDetailClick(item,'custom')}>
                <FlexText numberOfLine={1} color={'#333'}>{item.info?.name}</FlexText>
            </CellView>
          )
        })}
      </FlexColumn>
    )
  }
  const collectSongListView = () => {
    return (
      <FlexColumn>
        <FlexRow style={{alignItems:'center', paddingRight:10}}>
          <FlexText color={'#999'} fontSize={12} style={{marginLeft:10}}>收藏歌单</FlexText>
        </FlexRow>
        {collectSongList.map((item:any) => {
          return (
            <CellView key={item.info?.name} onClick={()=>onClassifiedDetailClick(item,'collect')}>
                <FlexText numberOfLine={1} color={'#333'}>{item.info?.name}</FlexText>
            </CellView>
          )
        })}
      </FlexColumn>
    )
  }
  return (
    <Con>
      <YyDiv>
        <FlexText style={{color:THEME.theme,fontSize:16}}>凌川音乐</FlexText>
      </YyDiv>
      <FlexHeight10 height={'20px'}/>
      {platformSongListView()}
      <FlexHeight10 height={'20px'}/>
      {createSongListView()}
      <FlexHeight10 height={'30px'}/>
      {collectSongListView()}
      <CreateSongListModalView showModal = {showModal} isNewSong={isNewSong} onCancel={() => setShowModal(false)}/>
    </Con>
  )
}

export default MicToolView