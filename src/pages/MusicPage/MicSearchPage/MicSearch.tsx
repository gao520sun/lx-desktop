import { FlexColumn, FlexConScroll, FlexRow } from '@/globalStyle'
import ErrorView from '@/pages/Components/ErrorView'
import LoadingFooterView from '@/pages/Components/LoadingFooterView'
import LoadingView from '@/pages/Components/LoadingView'
import { getSearchInfo } from '@/services/netease'
import { useRequest } from '@umijs/max'
import { useDebounceFn, useThrottleFn } from 'ahooks'
import { message } from 'antd'
import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import SongListView from '../MicClassifiedDetailPage/SongListView'
const Con = styled(FlexColumn)`
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 60px;
  padding-bottom: 70px;
`
const FScroll = styled(FlexConScroll)`
`
let isDownLoading = false;
let hasMore = true;
const MicSearch = (props:any) => {
  const [searchValue, setSearchValue] = useState('')
  const [list, setList] = useState([]);
  const {run,loading} = useRequest(getSearchInfo,{
    manual:true,
    onSuccess:(res,params) => {
      console.log('res::',res)
      if(res.status == 0){
        const par = params[0]
        let oldList:any = par?.offset == 0 ? [] : [...list];
        const newList:any = oldList.concat(res.data.songs||[]);
        hasMore = newList.length <= res.data.total ? true : false;
        isDownLoading = false;
        setList(newList);
      }else {
        message.error(res.message)
      }
    }
  })
  useEffect(() => {
    isDownLoading = false;
    hasMore = true;
    // 上下滑动
    const doc = document.getElementById('sList');
    doc?.addEventListener('scroll',onScrollEvent);
    const token = window.PubSub.subscribe('mic:input:value',(msg, data) => {
      setSearchValue(data);
      run({offset:0,keywords:data,type:1})
    })
    return () =>  {
      window.PubSub.unsubscribe(token)
    }
  },[])
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
      run({offset:list.length,keywords:searchValue,type:1})
  },[list,searchValue])
  return (
    <Con>
      <FScroll id={'sList'}>
        {list.length ? <SongListView list={list} songInfo={{}} params={props.params}/> : null}
        {list.length ?  <LoadingFooterView textStyle={{color:'#666'}} isMore={hasMore} isLoading={isDownLoading}/> : null}
      </FScroll>
    </Con>
  )
}

export default MicSearch