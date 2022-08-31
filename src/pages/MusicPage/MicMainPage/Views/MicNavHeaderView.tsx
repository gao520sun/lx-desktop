import BackNavView from '@/pages/Components/BackNavView'
import THEME from '@/pages/Config/Theme'
import { ClockCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { useModel } from '@umijs/max'

import { Input } from 'antd'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
export const HeaderConDiv = styled.div`
  display: flex;
  position: fixed;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  top: 0;
  z-index: 200;
  left: 289px;
  right: 0;
  background-color:#fff;
  border-bottom: 1px solid #f0f0f0;
  -webkit-app-region: drag;
`
const Search = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #99999930;
  width: 230px;
  height: 36px;
  border-radius: 200px;
  padding: 0px 20px;
  position: absolute;
  left: calc(50% - 115px);
  color:#fff;
  font-size: 14px;
`
const InputView = styled(Input)`
  background:transparent;
  border:0;
  color:#fff;
  .ant-input:focus{
    box-shadow: none;
    border-color: transparent;
  }
  .ant-input:hover{
    border-color: transparent;
  }
`

const NavHeaderView = (props:any) => {
  const {micNavigate} =  useModel('global')
  const [forceUpdate,setForceUpdate] = useState(true);
  const count = typeof micNavigate?.count  == 'function' &&  micNavigate?.count() || 0;
  const [searchValue, setSearchValue] = useState('')
  useEffect(() => {
      let token:any = PubSub.subscribe('micNav:push',(msg,data) =>{
        // TODO vod 上下滑动
        // let headerSearch:HTMLElement | null = document.getElementById('headerSearch');
        // let headerNav:HTMLElement | null = document.getElementById('headerNav');
        // headerSearch ? headerSearch.style.background = '#99999960' : null;
        // headerNav ? headerNav.style.background = '#141516' : null;
        setForceUpdate(!forceUpdate)
      });
        let tokenPop:any = PubSub.subscribe('micNav:pop',(msg,data) =>{
          // TODO vod 上下滑动
        // const doc:any = document.getElementById('vod_list');
        // if(doc?.scrollTop < 100){
        //   let headerSearch:HTMLElement | null = document.getElementById('headerSearch');
        //   let headerNav:HTMLElement | null = document.getElementById('headerNav');
        //   headerNav ? headerNav.style.background='linear-gradient(0deg,#8B8C9310,#21252D45,#21252D80)' : null;
        //   headerSearch ? headerSearch.style.background='#00000010' : null;
        // }
        setForceUpdate(!forceUpdate)
    });
    return () => {
      PubSub.unsubscribe(token)
      PubSub.unsubscribe(tokenPop)
    }
  },[forceUpdate])
  const onFocus = () => {
    const route = micNavigate?.routes()[count - 1];
    if(route?.name != 'searchVod'){
        micNavigate.push('searchVod')
    }
  }
  const onHistoryClick = () => {
    const route = micNavigate?.routes()[count - 1];
    if(route?.name != 'vodHistory'){
        micNavigate.push('vodHistory')
    }
  }
  const onChange = (event:any) => {
    setSearchValue(event.target.value);
  }
  const onKeyDown = (event:any) => {
    if(event.keyCode == 13){
      PubSub.publishSync('input:value',searchValue);
    }
  }
  return (
    <HeaderConDiv id={'headerNav'}>
      {count == 1 ? ''
      :<BackNavView navigate={micNavigate} iconStyle={{color:'#999'}}/>}
      <Search id={'headerSearch'}>
          <SearchOutlined style={{fontSize:16,color:'#999',marginRight:10}}/>
          <InputView placeholder='搜索音乐' value={searchValue} onKeyDown={onKeyDown} onChange={onChange} onFocus={onFocus}/>
      </Search>
      <div style={{marginRight:40}} onClick={onHistoryClick}>
        <ClockCircleOutlined style={{fontSize:16,color:THEME.white}}/>
      </div>
    </HeaderConDiv>
  )
}

export default NavHeaderView