import ErrorView from '@/pages/Components/ErrorView'
import { getStoreItem } from '@/utils/Storage'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FlexColumn, FlexRow, FlexText } from '@/globalStyle'
import HistoryCell from './View/HistoryCell'
const Con = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 60px;
  overflow-y: scroll;
  background-color: #141516;
  &::-webkit-scrollbar{
    background-color: transparent;
  };
  &::-webkit-scrollbar-thumb {
        border: 5px solid #000;
        border-radius: 20px;
        background-color: #595A5B;
  }
`
const ContentView = styled(FlexRow)`
    flex-wrap: wrap;
    margin-left: 20px;
`
const maxWidth = 210;
const VodHistory = () => {
    const [list, setList] = useState([])
    useEffect(() => {
        const vodHistory = getStoreItem(window.STORE_TYPE.vodHistory) || [];
        console.log('vodHistory::',vodHistory)
        setList(vodHistory);
        setTimeout(() => {
            resize()
        }, 100);
        // 监听窗口变化
        window?.ipc?.renderer?.on(window.WIN_TYPE.resized,(data:any) => {
            resize()
        })
        return ()  => {
        }
    },[])
    const resize = () =>{
        const dom = document.getElementById('historyContent');
        if(dom){
            let clientWidth:any = dom.clientWidth;
            let itemWidth = clientWidth / Math.ceil(clientWidth / maxWidth);
            let items:any = document.getElementsByClassName('historyItem');
            let urlImg:any = document.getElementsByClassName('historyUrlImg');
            if(items){
                for(let i = 0, len = items.length; i < len; i++) {
                    items[i].style.width = (itemWidth - 14) + 'px';
                    urlImg[i].style.height = ((itemWidth - 14)/3 * 4) + 'px';
                }
            }
        }
    }
    const onPalyClick = (item:any) => {
        window.ipc.renderer.send(window.VOD_TYPE.detail,item)
      }
  return (
    <Con id={'vodHistoryList'}>
        {list.length ? <FlexText style={{fontSize:20,marginLeft:20,marginBottom:20,flexShrink:0}}>观看历史</FlexText> : null}
         <ContentView className='historyContent' id={'historyContent'}>
                {list.map((item:any, index:number) => {
                    return <FlexColumn className='historyItem' style={{marginRight:14,marginBottom:10}} key={item.vod_id} onClick={() =>onPalyClick(item)}>
                                <HistoryCell value={item}/>
                            </FlexColumn>
                })}
              {!list.length && <ErrorView msg={'暂无历史数据'} textStyle={{color:'#fff'}}/>}
            </ContentView>
        
    </Con>
  )
}

export default VodHistory