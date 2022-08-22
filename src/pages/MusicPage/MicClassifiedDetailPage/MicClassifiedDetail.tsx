import { useRequest } from '@umijs/max'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { classifiedSongDetail } from '@/services/netease';
import ErrorView from '@/pages/Components/ErrorView';
import LoadingView from '@/pages/Components/LoadingView';
import { Flex, FlexColumn, FlexHeight10, FlexHeight12, FlexImage, FlexRow, FlexText, FlexWidth12 } from '@/globalStyle';
import { PlayArrow, Add, AddCard } from '@mui/icons-material';
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
const SongItemDiv = styled(FlexRow)`
  width:100%;
  height:50px;
  padding:0 12px;
  background-color:#fff;
  align-items: center;
  &:hover{
    background-color:#f0f0f0;
  };
`
const CellText = styled(FlexText).attrs({
  numberOfLine:1,
})`
  font-size:14px;
  color:#333;
`
const MicClassifiedDetail = (props:any) => {
  console.log('props::',props)
  const params = props.params
  const [list, setList] = useState([]);
  const [songInfo, seSongInfo] = useState<any>({});
  const {run, loading,error} = useRequest(classifiedSongDetail,{
    manual:true,
    onSuccess:(res:any,params:any) => {
      console.log('res:::',res)
      seSongInfo(res.info || {});
      setList(res.list)
    }
  })
  useEffect(() => {
    run(params.id)
  },[])
  if(loading){
    return <LoadingView textStyle={{color:'#99999970'}}/>
  }
  if(error){
    return <ErrorView/>
  }
  // 差一个播放按钮
  const headerView = () => {
    return (
      <FlexRow style={{padding:12}}>
        <FlexImage style={{width:170,height:170}} src={songInfo.coverImgUrl}/>
        <FlexWidth12/>
        <FlexColumn>
          <FlexText color={'#222'} fontSize='20px' style={{}}>{songInfo.name}</FlexText>
          <FlexHeight10/>
          <FlexRow style={{alignItems:'center'}}>
            <FlexImage style={{width:30, height:30}} src={songInfo.creator?.avatarUrl}/>
            <FlexText numberOfLine={1} style={{color:'#666',fontSize:14, marginLeft:8}}>{songInfo.creator?.nickname}</FlexText>
            <FlexRow>
              {songInfo.tags?.map((item:string) => <FlexText numberOfLine={1} style={{color:'#999',fontSize:12, marginLeft:8}}>#{item}</FlexText>)}
            </FlexRow>
          </FlexRow>
          <FlexHeight12/>
          <FlexRow><div style={{color:'#666',fontSize:14}}>{songInfo.description}</div></FlexRow>
        </FlexColumn>
      </FlexRow>
    )
  }
  const songCellView = (item:any) => {
    return (
      <SongItemDiv >
        <FlexRow style={{width:'46%',flexShrink:0}}>
          <CellText>{item.title}</CellText>
        </FlexRow>
        <FlexRow style={{width:'27%',flexShrink:0}}>
          <CellText>{item.artist}</CellText>
          <Flex/>
          <FlexRow>
            <PlayArrow/>
            <Add/>
            <AddCard/>
          </FlexRow>
        </FlexRow>
        <FlexRow style={{width:'27%',flexShrink:0}}>
          <CellText>{item.album}</CellText>
        </FlexRow>
        {/* <FlexRow ></FlexRow> */}
      </SongItemDiv>
    )
  }
  const songListView = () => {
    return (
      <SongContentDiv>
        {list.map(item => songCellView(item))}
      </SongContentDiv>
    )
  }
  return (
    <Con>
      {headerView()}
      {songListView()}
      {!loading && !list.length ? <ErrorView msg='暂无数据, 请选择其他类型'/>:null}
    </Con>
  )
}

export default MicClassifiedDetail