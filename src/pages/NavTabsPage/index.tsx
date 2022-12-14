import React, { useCallback, useEffect, useState } from 'react'
import { Button, Tabs } from 'antd';
import VodList from '@/pages/VideoPage/VodMainPage/VodList';
import McList from '@/pages/MusicPage/MicMainPage/McList';
import NlList from '@/pages/NovelPage/NlList';
import styles from './styles.less'
import TopView from './Views/TopView';
import BottomView from './Views/BottomView';
import PubSub from 'pubsub-js'
import NavHeaderView from '@/pages/VideoPage/VodMainPage/Views/NavHeaderView';
import MicNavHeaderView from '@/pages/MusicPage/MicMainPage/Views/MicNavHeaderView';
import MicToolView from '@/pages/MusicPage/MicMainPage/Views/MicToolView';
import AudioView from '@/pages/MusicPage/MicMainPage/Views/AudioView';
import VodNavigationView from './VodNavigationView';
import MicNavigationView from './MicNavigationView';
import styled from 'styled-components';
import { FlexColumn, FlexRow } from '@/globalStyle';

const vodKey = 'vod'
const micKey = 'mic'
const nolKey = 'nol'
const tabData:any  = {
  vod:{name:'影视',key:vodKey,leftBgColor:'#2B2D31',rightBgColor:'#141516'},
  mic:{name:'音乐',key:micKey,leftBgColor:'#2B2D31',rightBgColor:'#f0f0f0'},
  nol:{name:'小说',key:nolKey,leftBgColor:'#2B2D31',rightBgColor:'blue'}
}
const leftWidth = 110;
const ContentDiv:any = styled.div`
  display:flex;
  height:100vh;
  width:100%;
  overflow: hidden;
  background-color: ${(props:any) => props.rightBgColor};
`
const MicContentDiv:any = styled(ContentDiv)`
  flex-direction: row;
  position: relative;
`
function NavTabsPage() {
  const [activeKey,setActiveKey] = useState(micKey)
  const onChange = (key: string) => { setActiveKey(key)};
  const onTopClick = useCallback((type:string) => {
    let msg:string = 'window:'+type;
    window?.ipc?.renderer?.send(msg)
  },[])
  const tabItemName = (item:any) => {
    return (
      <div className={`${styles.item_v} ${activeKey == item.key ? styles.item_active : ''}`} style={{width:leftWidth}}>
        <div className={styles.item_t}>{item.name}</div>
      </div>
    )
  }
  const leftView = () => {
    return <TopView width={leftWidth} onClick={onTopClick}/>
  }
  const rightView = () => {
    return <BottomView/>
  }
  const tabDic = tabData[activeKey];
  return (
    <div className={styles.container}>
      <Tabs defaultActiveKey={activeKey} tabPosition='left' onChange={onChange} tabBarExtraContent={{left:leftView(),right:rightView()}} tabBarStyle={{width:leftWidth,padding:0,background:tabData[activeKey].leftBgColor}}>
            <Tabs.TabPane tab={tabItemName(tabData[vodKey])} key={vodKey}>
              <NavHeaderView/>
              <ContentDiv rightBgColor={tabDic.rightBgColor}>
                <VodNavigationView/>
              </ContentDiv>
            </Tabs.TabPane>
            <Tabs.TabPane tab={tabItemName(tabData[micKey])} key={micKey}>
              <MicContentDiv rightBgColor={tabDic.rightBgColor}>
                <MicToolView/>
                <FlexColumn style={{position:'relative',width:'100%',height:'100%'}}>
                  <MicNavHeaderView/>
                  <MicNavigationView/>
                </FlexColumn> 
                <AudioView/>
              </MicContentDiv>
            </Tabs.TabPane>
            <Tabs.TabPane tab={tabItemName(tabData[nolKey])} key={nolKey}>
                <ContentDiv rightBgColor={tabDic.rightBgColor}>
                  <NlList/>
                </ContentDiv>
            </Tabs.TabPane>
        </Tabs>
    </div>
  )
}

export default NavTabsPage