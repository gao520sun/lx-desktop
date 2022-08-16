import React, { useCallback, useEffect, useState } from 'react'
import { Button, Tabs } from 'antd';
import VodList from '@/pages/VideoPage/VodMainPage/VodList';
import McList from '@/pages/MusicPge/McList';
import NlList from '@/pages/NovelPage/NlList';
import styles from './styles.less'
import TopView from './Views/TopView';
import BottomView from './Views/BottomView';
import SwipeableViews from 'react-swipeable-views';
import PubSub from 'pubsub-js'
import NavHeaderView from '@/pages/VideoPage/VodMainPage/Views/NavHeaderView';
import SearchVod from '@/pages/VideoPage/SearchVodPage/SearchVod';
import VodMore from '@/pages/VideoPage/VodMorePage/VodMore';
import { Outlet } from '@umijs/max';
const vodName = '影视'
const mcName = '音乐'
const nlName = '小说'
const leftWidth = 110;
function NavTabsPage() {
  const [activeKey,setActiveKey] = useState('1')
  const [ysIndex,setYsIndex] = useState(0)
  const [vodData,setVodData] = useState(0)
  useEffect(() => {
    let token:any = PubSub.subscribe('input:focus',(msg,data) =>{
      let headerSearch:HTMLElement | null = document.getElementById('headerSearch');
      headerSearch ? headerSearch.style.background = '#99999960' : null;
      setYsIndex(1)
    });
    let token1:any = PubSub.subscribe('nav:back',(msg,data) =>{
      setYsIndex(ysIndex-1)
    });
    let token2:any = PubSub.subscribe('vod:more',(msg,data) =>{
      setVodData(data);
      setYsIndex(2)
    });
    return () => {
      PubSub.unsubscribe(token)
      PubSub.unsubscribe(token1)
      PubSub.unsubscribe(token2)
    }
  },[ysIndex])
  const onChange = (key: string) => {
    setActiveKey(key)
  };
  const onTopClick = useCallback((type:string) => {
    let msg:string = 'window:'+type;
    window?.ipc?.renderer?.send(msg)
  },[])
  const tabItemName = (name:string,key:string) => {
    return (
      <div className={`${styles.item_v} ${activeKey == key ? styles.item_active : ''}`} style={{width:leftWidth}}>
        <div className={styles.item_t}>{name}</div>
      </div>
    )
  }
  const leftView = () => {
    return <TopView width={leftWidth} onClick={onTopClick}/>
  }
  const rightView = () => {
    return <BottomView/>
  }
  return (
    <div className={styles.container}>
      <Tabs defaultActiveKey={activeKey} tabPosition='left' onChange={onChange} tabBarExtraContent={{left:leftView(),right:rightView()}} tabBarStyle={{width:leftWidth,padding:0,background:'#2B2D31'}}>
            <Tabs.TabPane tab={tabItemName(vodName,'1')} key="1">
                <SwipeableViews index={ysIndex}>
                  <div className={styles.content}>
                    <VodList />
                  </div>
                  <div className={styles.content}>
                      {ysIndex == 1 ? <SearchVod/> : null}
                  </div>
                  <div className={styles.content}>
                      {ysIndex == 2 ? <VodMore item={vodData}/> : null}
                  </div>
                </SwipeableViews>
                <NavHeaderView index={ysIndex}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab={tabItemName(mcName,'2')} key="2">
              <div className={styles.content}>
                <McList/>
              </div> 
            </Tabs.TabPane>
            <Tabs.TabPane tab={tabItemName(nlName,'3')} key="3">
                <div className={styles.content}>
                  <NlList/>
                </div>
            </Tabs.TabPane>
        </Tabs>
    </div>
  )
}

export default NavTabsPage