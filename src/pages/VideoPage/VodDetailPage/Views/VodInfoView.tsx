import THEME from '@/pages/Config/Theme';
import { vodMergeData } from '@/utils/VodUrl';
import { Col, Row, Tabs, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components';
import PubSub from 'pubsub-js'
import { getStoreItem } from '@/utils/Storage';
import Linq from 'linq'
const Con =styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
    background-color: #1C1C20;
    margin: 1px;
    box-sizing: border-box;
    overflow-y: scroll;
    &::-webkit-scrollbar{
      display: none;
    }
`
const Title=styled.div`
  color :#ffffff;
  font-size: 16px;
`
const Desc = styled.div`
  color :#ffffff;
  font-size: 12px;
  margin-left: 10px;
`
const ColDiv = styled(Col)`
  .ant-tabs-top > .ant-tabs-nav .ant-tabs-ink-bar {
    display: none;
    width: 0;
  }
  .ant-tabs-top > .ant-tabs-nav::before{
    border-bottom:1px solid #f0f0f060
  }
  .ant-tabs > .ant-tabs-nav .ant-tabs-nav-operations{
    display: none;
  }
  .ant-tabs-tab + .ant-tabs-tab{
    margin: 0 0 0 10px;
  }
`
const TabItem = styled.div`
  display: flex;
  /* height: 38px;
  width: 38px; */
  padding:12px;
  margin-bottom: 6px;
  align-items: center;
  justify-content: center;
  color:#fff;
  font-size: 16px;
  &.item_active{
    color:#ff4757;
    font-size: 20px;
    background: linear-gradient(0deg,#FF475781,#FF9EA622,#FFF7F710);
  }
`
const ConItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  background-color: #2A2A2C;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  /* 525255 */
`
const ContentDiv = styled.div`
  display: flex;
  margin-left: 12px;
  flex-direction: row;
  flex-wrap: wrap;
`
const VodInfoView = (props:any) => {
  const data = props.value;
  const vodUrlData = vodMergeData(data.vod_play_from,data.vod_play_url);
  const [activeKey,setActiveKey] = useState('')
  const [currentPlayValue,setCurrentPlayValue] = useState({from:'',name:'',url:''})
  useEffect(() => {
    const vodHistory = getStoreItem(window.STORE_TYPE.vodHistory) || [];
    let hisDic:any =  Linq.from(vodHistory).firstOrDefault((x:any) => x.vod_id == data.vod_id)
    if(hisDic){
      onJsUrl(hisDic)
    }else {
      const jUrlDic = vodUrlData[0].data[0];
      const jFrom = vodUrlData[0].from;
      onJsUrl({from:jFrom,...jUrlDic})
    }
  },[])
  const onTabsChange = (key: string) => {
    setActiveKey(key)
  };
  const onJsUrl = (item:{name:string,url:string,from:string}) => {
    setCurrentPlayValue(item)
    onTabsChange(item.from)
    PubSub.publishSync(window.VOD_TYPE.js,item); // 发送集数数据
  }
  const tabItemName = (name:string,key:string) => {
    return (
      <TabItem className={activeKey == key ? 'item_active':''}>
        <div>{name}</div>
      </TabItem>
    )
  }
  const contentView = useCallback((value:any) => {
    const {name,from,url} = currentPlayValue;
    return (
      <ContentDiv>
        {value.data.map((itemData:any) => {// {name:string,url:string}
          const item = {...itemData}
          const color = value.from == from && name == item.name ? THEME.theme : '#fff';
          return (
            <ConItem key={item.url} style={{color:color}} onClick={() => onJsUrl({name:item.name,url:item.url,from:value.from})}>{item.name}</ConItem>
          )
        })}
      </ContentDiv>
    )
  },[currentPlayValue,activeKey])
  return (
    <Con>
        <Row style={{alignItems:'baseline',margin:12}}>
          <Title>{data.vod_name}</Title>
          <Desc>{data.vod_remarks}</Desc>
        </Row>
        <Col style={{alignItems:'baseline',margin:12,flexShrink:0}}>
          <Typography.Paragraph style={{color:'#fff',fontSize:12}}  ellipsis={{ rows: 2, expandable: true, symbol: '更多' }}>{data.vod_content}</Typography.Paragraph>
        </Col>
        <ColDiv>
          <Tabs activeKey={activeKey} tabBarStyle={{padding:'0 12px',height:40}} moreIcon={null} onChange={onTabsChange}>
            {vodUrlData.map((item:any) => {
                return (
                  <Tabs.TabPane  tab={tabItemName(item.from,item.from)} key={item.from} >
                    <div style={{display:'flex',maxHeight:'100%'}}>
                      {contentView(item)}
                    </div>
                  </Tabs.TabPane>
                )
              })}
          </Tabs>
        </ColDiv>
    </Con>
  )
}

export default VodInfoView