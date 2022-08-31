import { Flex, FlexCenter, FlexColumn, FlexConScroll, FlexImage, FlexRow, FlexText } from '@/globalStyle'
import { classifiedSongDetail, getTopList } from '@/services/netease'
import { useRequest, useModel } from '@umijs/max'
import THEME from '@/pages/Config/Theme';
import ErrorView from '@/pages/Components/ErrorView';
import LoadingView from '@/pages/Components/LoadingView';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { message } from 'antd';
import Linq from 'linq'
import { numberPlayCountFormat } from '@/utils/format';
import { PlayCircle } from '@mui/icons-material';
const Con = styled(FlexConScroll)`
  padding-top: 60px;
  padding-bottom: 70px;
`
const TopCon = styled(FlexRow)`
    width:100%;
    flex-wrap: wrap;
    padding:0 12px;
`
const TopCell = styled(FlexRow)`
    min-width: 420px;
    flex:1;
    margin-top: 12px;
    background-color: #efefef;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    :nth-child(2n-1) {
        margin-right: 12px;
    }
    @media (max-width: 1170px){
        margin-right: 0;
        :nth-child(n) {
            margin-right:0;
        }
    };
`
const TopListCell = styled(FlexRow)`
    margin-top: 12px;
    margin-right: 10px;
`
const CellRC = styled(FlexColumn)`
    width: 100%;
    height: 100%;
    padding: 0 12px;
`
const FImg = styled(FlexImage)``
const BorderDiv = styled(FlexCenter)`
  right:20px;
  bottom:20px;
  position: absolute;
  z-index: 100;
  border-radius: 5px;
  display: none;
  ${TopCell}:hover &{
    display: flex;
  }
`
const iconVolStyle = {fontSize:40,color:'#fff',":hover":{color:THEME.theme},cursor: 'pointer'};
const maxWidth = 160;
const MicTopList = () => {
    const {micNavigate} =  useModel('global');
    const [list, setList] = useState([])
    const [topList, setTopList] = useState([])
    const {run,loading, error} = useRequest(getTopList,{
        manual:true,
        onSuccess:(res) => {
            if(res.status == 0){
                const top4 = Linq.from(res.data.list).where((x:any) => ['飙升榜','新歌榜','原创榜','热歌榜'].indexOf(x.name)!= -1).toArray()
                const listS = Linq.from(res.data.list).where((x:any) => ['飙升榜','新歌榜','原创榜','热歌榜'].indexOf(x.name)== -1).toArray()
                setList(listS)
                setTopList(top4)
            }else {
                message.error(res.message)
            }
        }
    })
    const {run:detailRun} = useRequest(classifiedSongDetail,{
        manual:true,
        onSuccess:(res:any,params:any) => {
         if(res.status == 0){
          window.PubSub.publishSync(window.MIC_TYPE.songPlay,res.data.list)
         }else {
          message.error(res.message)
         }
        }
      })
    useEffect(()  => {
        run()
    },[])
    useEffect(() => {
      resize()
      window?.ipc?.renderer?.on(window.WIN_TYPE.resized,(data:any) => {
          resize()
      })
      return ()  => {}
    },[list])
    const resize = () =>{
      const dom = document.getElementById('contentNameTop');
      if(dom){
          let clientWidth:any = dom.clientWidth - 0;
          let itemWidth = clientWidth / Math.ceil(clientWidth / maxWidth);
          let items:any = document.getElementsByClassName('itemNameTop');
          let urlImg:any = document.getElementsByClassName('urlImgTop');
          let bj = 14;
          if(urlImg){
              for(let i = 0, len = items.length; i < len; i++) {
                  items[i].style.width = (itemWidth - bj) + 'px';
                  items[i].style.height = (itemWidth - bj) + 'px';
                  urlImg[i].style.width = ((itemWidth - bj)) + 'px';
                  urlImg[i].style.height = ((itemWidth - bj)) + 'px';
              }
          }
      }
      
    }
    const onItemPlayClick = (event:any,item:any) => {
        event && event.stopPropagation();
        detailRun(item.id)
    }
    const onGoToDetail = (item:any) => {
        micNavigate.push('MicClassifiedDetail',item)
    }
    if(loading){
        return <LoadingView textStyle={{color:'#99999970'}}/>
    }
    if(error){
        return <ErrorView/>
    }
    const topCellView = (item:any) => {
        const ts0 = {color:'#333',fontSize:18, marginTop:18};
        const ts1 = {color:'#777',fontSize:14,flexShrink:0,marginRight:8};
        const ts2 = {color:'#999',fontSize:12};
        return (
            <TopCell key={item.id} onClick={() => onGoToDetail(item)}>
                <FlexCenter style={{position:'relative'}}>
                    <FImg width={160} height={160} src={item.coverImgUrl}/>
                    <BorderDiv className='b_v'>
                        <FlexCenter onClick={(e) => onItemPlayClick(e,item)}><PlayCircle sx={iconVolStyle}/></FlexCenter>
                    </BorderDiv>
                </FlexCenter>
                <CellRC >
                    <FlexText style={ts0}>{item.name}</FlexText>
                    {item.tracks.map((item:any,index:number) => {
                        return (
                            <FlexRow key={item.first} style={{marginTop:10,alignItems:'center'}} >
                                <FlexText style={ts1}>{index+1} {item.first}</FlexText>
                                <Flex/>
                                <FlexText numberOfLine={1} style={ts2}>{item.second}</FlexText>
                            </FlexRow>
                        )
                    })}
                </CellRC>
            </TopCell>
        )
    }
    const otherCellView = (item:any) => {
        const npcf = numberPlayCountFormat(item.playCount,0);
        return (
            <TopListCell key={item.id} className='itemNameTop' onClick={() => onGoToDetail(item)}>
                <FlexCenter style={{position:'relative'}}>
                    <FlexImage className='urlImgTop'  src={item.coverImgUrl}/>
                    <FlexText style={{position:"absolute",top:6,right:6}}>{npcf.value + npcf.unit}</FlexText>
                </FlexCenter>
            </TopListCell>
        )
    }
    return (
        <Con>
            <TopCon>
                {topList.map((item:any) => topCellView(item))}
            </TopCon>
           <TopCon id='contentNameTop' style={{flex:1,width:'100%',paddingBottom:10}}>
                {list.map((item:any) => otherCellView(item))}
            </TopCon>
        </Con>
    )
    
}

export default MicTopList