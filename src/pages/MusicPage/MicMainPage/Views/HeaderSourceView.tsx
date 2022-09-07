import { FlexColumn, FlexRow, FlexText, FlexWidth } from '@/globalStyle'
import THEME from '@/pages/Config/Theme'
import { ArrowForward, ArrowForwardIosOutlined } from '@mui/icons-material'
import { Popover } from 'antd'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
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
import {sourceList } from '../../MicModel/MicCategory'

const HeaderSourceView = (props:any) => {
  const [visible,setVisible] = useState(false)
    const onSourceItemClick = (item:any) => {
      if(item.key == props.sourceKey){return}
        typeof props.onSourceClick == 'function' && props.onSourceClick(item.key)
    }
    const onFilterItem = (item:any) => {
      if(item.id == props.filter.id){return}
      setVisible(false)
      typeof props.onSourceClick == 'function' && props.onFilterItem(item)
    }
    const moreContentView = () => {
      return (
        <FlexColumn style={{padding:'12px'}}>
          {props.filters?.all?.map((item:any)=>{
            return (
              <FlexRow key={item.category} style={{marginBottom:20}}>
                <FlexText color='#282828' fontSize='20px' style={{lineHeight:'26px'}}>{item.category}</FlexText>
                <FlexWidth width={'20px'}/>
                <FlexRow style={{flexWrap:'wrap'}}>
                  {item.filters.map((fItem:any)=>{
                    return (
                      <FlexRow key={fItem.name} onClick={() =>onFilterItem(fItem)}>
                        <FlexText  fontSize='14px' style={{cursor:'pointer',marginLeft:20,marginBottom:16,color:props.filter.name == fItem.name ? THEME.theme:'#666'}}>{fItem.name}</FlexText>
                      </FlexRow>
                    )
                  })}
                </FlexRow>
              </FlexRow>
            )
          })}
        </FlexColumn>
      )
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
            <FlexRow>
              {props.filters?.recommend?.map((item:{id:string,name:string},index:number) => {
                  return (
                    <FlexRow key={item.id+item.name} style={{alignItems:'center',cursor:'pointer'}} onClick={() =>onFilterItem(item)}>
                        <FlexText style={{fontSize:12,color:props.filter.name == item.name ? THEME.theme:'#666'}}>{item.name}</FlexText>
                        {<div style={{width:1,height:10,background:'#f0f0f0',margin:'0 10px'}}/>}
                    </FlexRow>
                  )
              })}
              <Popover placement="bottomRight" visible={visible} overlayStyle={{width:'60%',paddingBottom:0}} content={moreContentView} trigger="click">
                  <FlexRow style={{alignItems:'center',cursor:'pointer'}} onClick={() => setVisible(!visible)}>
                    <FlexText style={{color:'#666',fontSize:12}}>更多</FlexText>
                  </FlexRow>
              </Popover>
            </FlexRow>
          </HeaderView>
        )
    }
    useEffect(() => {
      document.onmouseup= () => {
        if(visible){
          setVisible(false)
        }
      }
    },[visible]) 
  return (
    <div>
        {headerView()}
    </div>
  )
}

export default HeaderSourceView