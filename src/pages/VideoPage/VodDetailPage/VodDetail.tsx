import { getVodDetailById } from '@/services/video';
import { useRequest } from '@umijs/max';
import { useParams } from '@umijs/max'
import React, { useEffect } from 'react'
import ErrorView from '@/pages/Components/ErrorView'
import LoadingView from '@/pages/Components/LoadingView'
import HeaderView from './Views/HeaderView';
import VideoPlayView from './Views/VideoPlayView';
import VodInfoView from './Views/VodInfoView';
import PubSub from 'pubsub-js'
const VodDetail = () => {
  const params = useParams();
  const {data, error, loading } = useRequest(()=>getVodDetailById({id:params.id}),{})
  useEffect(() => {
    // 订阅兄弟组件播放集数
    let token:any = PubSub.subscribe(window.VOD_TYPE.fullScreen,(msg,data) =>{
      window?.ipc?.renderer?.send(window.WIN_TYPE.fullScreen,data);
    });
    return () => {
      PubSub.unsubscribe(token)
    }
  },[])
  if(loading){
    return <LoadingView/>
  }
  if(error) {
    return <ErrorView />
  }
  return (
    <div style={{display:'flex',flexDirection:'column',width:'100vw',height:'100vh',overflow:'hidden'}}>
      <HeaderView value={data}/>
      <div style={{display:'flex',flexDirection:'row',height:'100%',width:'100%',background:'#000',overflow:'hidden'}}>
        <VideoPlayView value={data}/>
        <VodInfoView value={data} />
      </div>
    </div>
  )
}

export default VodDetail