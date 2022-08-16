import LoadingView from '@/pages/Components/LoadingView';
import React, { useEffect, useRef, useState } from 'react'
import { useCallback } from 'react';
import ReactPlayer from 'react-player'
import styled from 'styled-components';
import VodBottom from './VodBottom';
import PubSub from 'pubsub-js'
const LoadingDiv = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 84px;
  align-items: center;
  justify-content: center;
`
const VideoPlayView = (props:any) => {
  const playerRef:any = useRef(null)
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [playing, setPlaying] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [url, setUrl] = useState('');
  useEffect(() => {
    // 订阅兄弟组件播放集数
    let token:any = PubSub.subscribe('vod:js',(msg,data) =>{
      setUrl(data.url)
    });
    return () => {
      PubSub.unsubscribe(token)
    }
  },[])
  // 视频加载
  const onReady = useCallback((player:ReactPlayer) => {
    setLoading(false)
  },[])
  // 视频总时长
  const onDuration = useCallback((duration:number) => {
    setDuration(duration);
  },[])
  // 播放进度
  const onProgress = ((e:any) => {
    setProgress(e.playedSeconds)
  })
  // 拖拽中进度
  const onSliderSeek = ((value:number) => {
    setProgress(value)
  })
  // 拖拽后
  const onSliderAfterSeek = ((value:number) => {
    playerRef?.current?.seekTo(value)
  })
  // 设置声音大小
  const onVolumeChange = (value:number)  =>  {
    setVolume(value / 100)
  }
  // 倍数播放
  const onPlaybackRate = ((value:number) => {
    setPlaybackRate(value)
  })
  // 播放 & 暂停
  const onPlaying = useCallback((value:boolean) => {
    setPlaying(value)
  },[])
  // 开始缓冲
  const onBuffer = useCallback(() => {
    setLoading(true)
  },[])
  // 结束缓冲
  const onBufferEnd = useCallback(() => {
    setLoading(false)
  },[])
  // 报错
  const onError = useCallback(() => {
    setLoading(true)
  },[])
  // 当媒体使用seconds参数搜索时调用
  const onSeek = useCallback((event:any) => {
    setLoading(false)
  },[])
  return (
    <div style={{display:'flex',flexDirection:'column',flex:1,position:'relative'}}>
      <div style={{display:'flex',flex:1}}>
        <ReactPlayer
            ref={refs => {playerRef.current = refs}}
            url={url}
            playing = {playing}
            playbackRate={playbackRate}//倍数
            controls={false}
            muted={false}
            volume={volume}
            width='100%'
            height='100%'
            config={{ file: {forceHLS: true,}}}
            onReady={onReady}
            onStart={() => console.log('onStart')}
            onPlay={() => console.log('播放开始走这里：onPlay')}
            onPause={() => console.log('暂停走这里：onPlay')}
            onBuffer={onBuffer}
            onBufferEnd={onBufferEnd}
            onError={onError}
            onSeek={onSeek}
            onProgress={onProgress}
            onDuration={onDuration}
          />
      </div>
      {loading ? <LoadingDiv>
        <LoadingView iconStyle={{fontSize:30}}/>
      </LoadingDiv> : null}
      <VodBottom player={playerRef} playing={playing} duration={duration} volume={volume} progress={progress} playbackRate={playbackRate}
                  onPlaying={onPlaying}
                  onSliderSeek={onSliderSeek}
                  onSliderAfterSeek={onSliderAfterSeek}
                  onVolumeChange={onVolumeChange}
                  onPlaybackRate={onPlaybackRate}
        />
    </div>
  )
}

export default VideoPlayView