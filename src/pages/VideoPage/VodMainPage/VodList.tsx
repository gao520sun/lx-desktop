
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
function VodList() {
  const { data, error, loading } = useRequest(()=>getVodList({}));
  const scroll = useCallback((event: any) => {
    const scrollTop = event.srcElement.scrollTop;
    let headerNav:HTMLElement | null = document.getElementById('headerNav');
    let headerSearch:HTMLElement | null = document.getElementById('headerSearch');
    if(scrollTop > 100){
        headerNav ? headerNav.style.background = '#141516' : null;
        headerSearch ? headerSearch.style.background = '#99999960' : null;
    }else {
        headerNav ? headerNav.style.background='linear-gradient(0deg,#8B8C9310,#21252D45,#21252D80)' : null;
        headerSearch ? headerSearch.style.background='#00000010' : null;
    }
  },[])
  useEffect(() => {
    const doc = document.getElementById('vod_list');
    doc?.addEventListener('scroll',scroll);
    return ()  => {
      doc?.removeEventListener('scroll',()=>{})
    }
  },[scroll,loading])
  
  if(loading){
    return <LoadingView/>
  }
  if(error) {
    return <ErrorView/>
  }
  return (
    <Con id={'vod_list'}>
      <CarouselView/>
      <Col>
        {data.map((item:any,index:number) => {
          return <ListItemCell key={index} value={item}/>
        })}
      </Col>
      {/* <NavHeaderView/> */}
    </Con>
  )
}

export default VodList