import { FlexColumn, FlexRow, FlexText } from '@/globalStyle'
import ErrorView from '@/pages/Components/ErrorView';
import LoadingFooterView from '@/pages/Components/LoadingFooterView';
import LoadingView from '@/pages/Components/LoadingView';
import THEME from '@/pages/Config/Theme'
import { useRequest } from '@umijs/max';
import { useDebounceFn, useThrottleFn } from 'ahooks';
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import Linq from 'linq';
import ConItemCell from './ConItemCell';
import { classifiedSongList, classifiedSongDetail, sourceDefKey, sourceList, getPlayListFilters } from '../../MicModel/MicCategory';
import { message } from 'antd';
import HeaderSourceView from './HeaderSourceView';
const ConDiv = styled.div`
 display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`
const Con = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 10px;
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
const ContentView = styled(FlexRow)`
    flex:1;
    flex-wrap: wrap;
    margin-left: 20px;
`
let isDownLoading = false;
let hasMore = true;
const maxWidth = 240;
const limit = 29;
const defFilter = {id:'',name:'全部'}
const MicContentView = (props:any) => {
  const [list, setList] = useState([]);
  const [sourceKey, setSourceKey] = useState(sourceDefKey)
  const [filter, setFilter] = useState(defFilter);
  const [filtersData, setFiltersData] = useState({})
  const {run, loading} = useRequest(classifiedSongList(sourceKey),{
    manual:true,
    onSuccess:(res:any,params:any) => {
      if(res.status == 0){
        const par = params[0]
        let oldList:any = par?.offset == 0 ? [] : [...list];
        const newList:any = oldList.concat(res.data||[]);
        hasMore = res.data.length >= limit ? true : false;
        isDownLoading = false;
        setList(newList);
        setTimeout(() => {
            resize()
        }, 0);
      }else {
        message.error(res.message)
      }
       
    }
  })
  const {run:detailRun} = useRequest(classifiedSongDetail(sourceKey),{
    manual:true,
    onSuccess:(res:any,params:any) => {
     if(res.status == 0){
      window.PubSub.publishSync(window.MIC_TYPE.songPlay,res.data.list)
     }else {
      message.error(res.message)
     }
    }
  })
  const {run:filtersRun} = useRequest(getPlayListFilters(sourceKey),{
    manual:true,
    onSuccess:(res:any) => {
      if(res.status == 0){
        setFiltersData(res.data)
      }
     }
  })
  useEffect(() => {
    filtersRun();
    isDownLoading = false;
    hasMore = true;
    run({offset:0,limit:limit,order:'hot',filterId:filter?.id || '10000000',cat:filter?.id})
  },[sourceKey,filter.id])
  useEffect(() => {
    // 上下滑动 
    const doc = document.getElementById('cList');
    doc?.addEventListener('scroll',onScrollEvent);
    // 监听窗口变化
    resize()
    window?.ipc?.renderer?.on(window.WIN_TYPE.resized,(data:any) => {
        resize()
    }) 
    return ()  => {
      doc?.removeEventListener('scroll',()=>{})
    }
  },[])
  const resize = () =>{
    const dom = document.getElementById('contentName');
    if(dom){
        let clientWidth:any = dom.clientWidth;
        let itemWidth = clientWidth / Math.ceil(clientWidth / maxWidth);
        let items = document.getElementsByClassName('itemName');
        let urlImg = document.getElementsByClassName('urlImg');
        if(items){
            for(let i = 0, len = items.length; i < len; i++) {
                items[i].style.width = (itemWidth - 14) + 'px';
                urlImg[i].style.height = ((itemWidth - 14)) + 'px';
            }
        }
    }
    
  }
  // 节流上拉加载
  const onScrollEvent = (e:any) => {
      const loadHeight = 65;
      let scrollTop = 0,scrollHeight=0,clientHeight=0
      scrollTop = e.target?.scrollTop;
      scrollHeight = e.target?.scrollHeight;
      clientHeight = e.target?.clientHeight;
      if(scrollTop + clientHeight > scrollHeight - loadHeight){
          if(!isDownLoading && hasMore){
              isDownLoading = true
              scrollThrottle.run();
          }
        }
  }
  const scrollThrottle = useThrottleFn(() => {
      onLoadMore();
  },{wait:500})
  // 加载更多
  const onLoadMore = useCallback(() => {
      run({offset:list.length,limit:limit,order:'hot',filterId:'10000000',cat:filter?.id});
  },[list])
  // 播放歌单
  const onItemPlayClick = (item:any) => {
    detailRun(item.id)
  }
  
  return (
    <ConDiv>
      <HeaderSourceView filters={filtersData} 
                sourceKey={sourceKey} 
                filter={filter}  
                onSourceClick = {(key:string) => {setSourceKey(key);setFilter(defFilter)}}
                onFilterItem = {(value:any) => setFilter(value)}
      />
      <Con id={'cList'}>
        <ContentView className='contentName' id={'contentName'}>
            {!loading || list.length ? list.map((item:any, index:number) => {
                return <FlexColumn className='itemName' style={{marginRight:14,marginBottom:10}} key={item.cover_url+item.title}>
                            <ConItemCell value={item} sourceKey={sourceKey} navigate={props.navigate} onItemPlayClick={onItemPlayClick}/>
                        </FlexColumn>
            }):<LoadingView textStyle={{color:'#9999'}}/>}
            {!loading || list.length ? <LoadingFooterView textStyle={{color:'#666'}} isMore={hasMore} isLoading={isDownLoading}/> : null}
            {!loading && !list.length ? <ErrorView msg='暂无数据, 请选择其他类型'/>:null}
        </ContentView>
      </Con>
    </ConDiv>
    
  )
}

export default MicContentView