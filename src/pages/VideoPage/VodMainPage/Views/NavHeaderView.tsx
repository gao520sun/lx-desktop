import BackNavView from '@/pages/Components/BackNavView'
import THEME from '@/pages/Config/Theme'
import { ClockCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { useModel } from '@umijs/max'

import { Input } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
export const HeaderConDiv = styled.div`
  display: flex;
  position: fixed;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  top: 0;
  left: 109px;
  /* left: 0px; */
  right: 0;
  background: linear-gradient(0deg,#8B8C9310,#21252D45,#21252D80);
  -webkit-app-region: drag;
`
const Search = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #00000010;
  width: 230px;
  height: 40px;
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

const NavHeaderView = (props:{index:number}) => {
  const [searchValue, setSearchValue] = useState('')

  const onFocus = () => {
    PubSub.publishSync('input:focus');
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
      {props.index == 0 ? <div style={{color:THEME.theme,fontSize:16,marginLeft:20}}>凌川视频</div>
      :<BackNavView />}
      <Search id={'headerSearch'}>
          <InputView placeholder='搜索' value={searchValue} onKeyDown={onKeyDown} onChange={onChange} onFocus={onFocus}/>
          <SearchOutlined style={{fontSize:16,color:THEME.white,marginRight:-10}}/>
      </Search>
      <div style={{marginRight:40}}>
        <ClockCircleOutlined style={{fontSize:16,color:THEME.white}}/>
      </div>
    </HeaderConDiv>
  )
}

export default NavHeaderView