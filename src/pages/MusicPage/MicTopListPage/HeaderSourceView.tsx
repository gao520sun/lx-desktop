import { FlexColumn, FlexRow, FlexText, FlexWidth } from '@/globalStyle'
import THEME from '@/pages/Config/Theme'
import { ArrowForward, ArrowForwardIosOutlined } from '@mui/icons-material'
import { Popover } from 'antd'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { sourceList } from '../MicModel/MicCategory'
const HeaderView = styled(FlexRow)`
  padding: 12px;
  padding-left: 16px;
  justify-content: space-between;
  align-items: center;
`
const SourceText = styled(FlexText)`
  cursor:pointer;
  color:#666;
  font-size:14px;
  :hover &{
    color: ${() => THEME.theme};
  }
`
const HeaderSourceView = (props:any) => {
    const onSourceItemClick = (item:any) => {
      if(item.key == props.sourceKey){return}
        typeof props.onSourceClick == 'function' && props.onSourceClick(item.key)
    }   
    const headerView = () => {
        return (
          <HeaderView>
            <FlexRow>
              {sourceList.map((item:any,index:number)=> {
                  return (
                    <FlexRow key={item.key} style={{alignItems:'center'}} onClick={() => onSourceItemClick(item)}>
                      <SourceText style={{color:props.sourceKey == item.key ? THEME.theme:'#666'}}>{item.title}</SourceText>
                      {index !== sourceList.length-1 ? <div style={{width:1,height:10,background:'#f0f0f0',margin:'0 10px'}}/>:null}
                    </FlexRow>
                  )
              })}
            </FlexRow>
          </HeaderView>
        )
    }
  return (
    <div>
        {headerView()}
    </div>
  )
}

export default HeaderSourceView