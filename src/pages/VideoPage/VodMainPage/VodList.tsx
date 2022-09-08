
import { getVodList } from '@/services/video'
import { useRequest } from '@umijs/max'
import React, { useCallback, useEffect, useState } from 'react'
import ErrorView from '@/pages/Components/ErrorView'
import LoadingView from '@/pages/Components/LoadingView'
import CarouselView from './Views/CarouselView'
import { Col } from 'antd'
import ListItemCell from './Views/ListItemView'
import NavHeaderView from './Views/NavHeaderView'
import styled from 'styled-components'
import { clearStore, getStoreItem, removeStoreItem, setStoreItem } from '@/utils/Storage'
const Con = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    position: relative;
    overflow:scroll;
    &::-webkit-scrollbar{
      display: none;
    }
`
function VodList(props:any) {
  const [list, setList] = useState([])
  const {run,loading,error} = useRequest(getVodList,{
    manual:true,
    onSuccess:(res:any) => {
      setStoreItem(window.VOD_TYPE.homeList,{time:new Date().getTime(),list:res});
      setList(res)
    },
    
  });
  useEffect(() => {
    const hDic:any = getStoreItem(window.VOD_TYPE.homeList);
    if(hDic){
      const oldTime = hDic.time + (6 * 60 * 60 * 1000);
      const newTime = new Date().getTime();
      setList(hDic.list || []);
      if(oldTime < newTime){run()}
    }else {
      run()
    }
  },[])
  // TODO vod 上下滑动
  // const scroll = useCallback((event: any) => {
  //   const scrollTop = event.srcElement.scrollTop;
  //   let headerNav:HTMLElement | null = document.getElementById('headerNav');
  //   let headerSearch:HTMLElement | null = document.getElementById('headerSearch');
  //   if(scrollTop > 100){
  //       headerNav ? headerNav.style.background = '#141516' : null;
  //       headerSearch ? headerSearch.style.background = '#99999960' : null;
  //   }else {
  //       headerNav ? headerNav.style.background='linear-gradient(0deg,#8B8C9310,#21252D45,#21252D80)' : null;
  //       headerSearch ? headerSearch.style.background='#00000010' : null;
  //   }
  // },[])
  // useEffect(() => {
  //   const doc = document.getElementById('vod_list');
  //   doc?.addEventListener('scroll',scroll);
  //   return ()  => {
  //     doc?.removeEventListener('scroll',()=>{})
  //   }
  // },[scroll,loading])
  if(loading){
    return <LoadingView/>
  }
  if(error) {
    return <ErrorView/>
  }
  return (
    <Con id={'vod_list'}>
      {/* <CarouselView/> */}
      <Col style={{paddingTop: 50}}>
        {list.map((item:any,index:number) => {
          return <ListItemCell key={index} value={item}/>
        })}
      </Col>
      {/* <NavHeaderView/> */}
    </Con>
  )
}

export default VodList