import React from 'react'
import { Button, Tabs } from 'antd';
import VodList from '@/pages/VideoPage/VodList';
import McList from '@/pages/MusicPge/McList';
import NlList from '@/pages/NovelPage/NlList';
import styles from './styles.less'
function NavTabsPage() {
  const leftView = () => {
    return (
      <Button type='primary' style={{marginTop:20}}>aaa</Button>
    )
  }
  const tabItemName = () => {
    return (
      <div>aaaa</div>
    )
  }
  return (
    <div className={styles.container}>
      <Tabs defaultActiveKey="1" tabPosition='left' tabBarExtraContent={{left:leftView()}} tabBarStyle={{width:128}}>
            <Tabs.TabPane tab={tabItemName()} key="1">
              <VodList />
            </Tabs.TabPane>
            <Tabs.TabPane tab="音乐" key="2">
                <McList/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="小说" key="3" style={{display:'flex',height:'100vh',width:'100%',overflow:'scroll'}}>
                <div >
                  <NlList/>
                </div>
            </Tabs.TabPane>
        </Tabs>
    </div>
  )
}

export default NavTabsPage