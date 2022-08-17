import React, { useCallback, useEffect, useState } from 'react'
import { Button, Tabs } from 'antd';
import VodList from '@/pages/VideoPage/VodMainPage/VodList';
import McList from '@/pages/MusicPge/McList';
import NlList from '@/pages/NovelPage/NlList';
import styles from './styles.less'
import TopView from './Views/TopView';
import BottomView from './Views/BottomView';
import PubSub from 'pubsub-js'
import NavHeaderView from '@/pages/VideoPage/VodMainPage/Views/NavHeaderView';
import NavigationView from './NavigationView';

const vodName = '影视'
const mcName = '音乐'
const nlName = '小说'
const leftWidth = 110;
function NavTabsPage() {
  const [activeKey,setActiveKey] = useState('1')
  const onChange = (key: string) => { setActiveKey(key)};
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
            <NavHeaderView/>
              <div className={styles.content}>
                <NavigationView/>
              </div>
                
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