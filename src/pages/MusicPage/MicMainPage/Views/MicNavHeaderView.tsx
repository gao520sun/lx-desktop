import { FlexRow, FlexText } from '@/globalStyle'
import BackNavView from '@/pages/Components/BackNavView'
import THEME from '@/pages/Config/Theme'
import { ClockCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { useModel } from '@umijs/max'

import { Input } from 'antd'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { sourceDefKey, sourceList } from '../../MicModel/MicCategory'
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
  width: 200px;
  height: 36px;
  border-radius: 200px;
  padding: 0px 20px;
  position: absolute;
  /* left: calc(50% - 115px); */
  left: 60px;
  color:#fff;
  font-size: 14px;
`
const InputView = styled(Input)`
  background:transparent;
  border:0;
  color:#333;
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
        setForceUpdate(!forceUpdate)
      });
      let tokenPop:any = PubSub.subscribe('micNav:pop',(msg,data) =>{
        setForceUpdate(!forceUpdate)
      });
    return () => {
      PubSub.unsubscribe(token)
      PubSub.unsubscribe(tokenPop)
    }
  },[forceUpdate])
  const onFocus = () => {
    const route = micNavigate?.routes()[count - 1];
    if(route?.name != 'MicSearch'){
        micNavigate.push('MicSearch')
    }
  }
  const onChange = (event:any) => {
    setSearchValue(event.target.value);
  }
  const onKeyDown = (event:any) => {
    if(event.keyCode == 13){
      PubSub.publishSync('mic:input:value',searchValue);
    }
  }
  return (
    <HeaderConDiv id={'headerNav'}>
      {count == 1 ? '':<BackNavView navigate={micNavigate} iconStyle={{color:'#999'}}/>}
      <Search id={'headerSearch'}>
          <SearchOutlined style={{fontSize:16,color:'#999',marginRight:10}}/>
          <InputView placeholder='搜索音乐' value={searchValue} onKeyDown={onKeyDown} onChange={onChange} onFocus={onFocus}/>
      </Search>
    </HeaderConDiv>
  )
}

export default NavHeaderView