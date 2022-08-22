import { FlexCenter, FlexColumn, FlexImage, FlexRow, FlexText, FlexWidth12 } from '@/globalStyle';
import styled from 'styled-components'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactAudioPlayer from 'react-audio-player';
import { PauseCircleFilledOutlined, PlayCircleFilledOutlined, Repeat, RepeatOne, Shuffle, SkipNext, SkipPrevious, VolumeOff, VolumeUp } from '@mui/icons-material';
import THEME from '@/pages/Config/Theme';
import Linq from 'linq'
import _ from 'lodash';
import { message, Popover, Slider } from 'antd';
import { useDebounceFn } from 'ahooks';
import { formatTime } from '@/utils/VodDate';
import { LoadingOutlined } from '@ant-design/icons';
import PlayerMenuListView from './PlayerMenuListView';
const Con = styled(FlexRow)`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    border-top: 1px solid #e9e9e9;
    background-color: #ffffff;
    .ant-slider{
      margin: 0;
      padding: 0;
    }
    .ant-slider-handle{
      border: 2px solid #ff4757;
      height: 10px;
      width: 10px;
      margin-top: -4px;
    };
    .ant-slider-rail {
      background-color: transparent;
    }
    .ant-slider-track {
      background-color: #ff4757;
      height: 2px;
    };
    .ant-slider:hover .ant-slider-track {
      background-color: #ff4757;
    }
    .ant-slider:hover .ant-slider-handle:not(.ant-tooltip-open) {
      border-color: #ff4757;
    }
`
const DivRight = styled.div`
  display: flex;
  margin-right: 16px;
  margin-left: 16px;
`
const SliderDiv = styled.div`
  height: 120px;
  .ant-slider-handle{
    border: 2px solid #ff4757
  };
  .ant-slider-track {
    background-color: #ff4757;
  };
  .ant-slider:hover .ant-slider-track {
    background-color: #ff4757;
  }
  .ant-slider:hover .ant-slider-handle:not(.ant-tooltip-open) {
    border-color: #ff4757;
  }
`
const iconStyle = {fontSize:40,color:THEME.theme};
const iconSkipStyle = {fontSize:30,color:'#000',":hover":{color:THEME.theme}};
const iconXHStyle = {fontSize:20,color:'#949494',":hover":{color:THEME.theme}};
const iconVolStyle = {fontSize:20,color:'#9a9a9a',":hover":{color:THEME.theme}};
const listAudio = [
  {name:'测试 1',url:'http://96.ierge.cn/15/238/476559.mp3',img:'',author:'1111'},
  {name:'测试 2',url:'http://96.ierge.cn/15/237/474403.mp3',img:'',author:'1111'},
  {name:'测试 3',url:'http://96.ierge.cn/15/238/476567.mp3',img:'',author:'1111'},
]
const sequenceKey = 'sequence'
const randomKey = 'random'
const repeatKey = 'repeat'
const AudioView = () => {
    const audioRef:any = useRef();
    const audioElRef:any = useRef();
    const [audioData, setAudioData] = useState(listAudio);
    const [audioShuffleData, setAudioShuffleData] = useState(_.shuffle(listAudio));
    const [currentUrlData, setCurrentUrlData] = useState<any>({});
    const [isPlay, setIsPlay] = useState(false);
    const [repeatType, setRepeatType] = useState<string>(sequenceKey); // sequence random repeat
    const [volumeHovered, setVolumeHovered] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [progress, setProgress] = useState(0);
    const [isLoadingPlay, setIsLoadingPlay] = useState(true); // 是否可以播放视频
    useEffect(() => {
      console.log('audioRef::',[audioElRef.current])
      const audioDic = audioData[0];
      setCurrentUrlData(audioDic)
    },[])
    // 播放
    const onPlayAndPause = () => {
      if(isPlay){
        audioElRef.current.pause();
      }else {
        audioElRef.current.play();
      }
      setIsPlay(!isPlay)
    }
    // 上一首
    const onPreviousPlay = () => {
      const list = currentAudioData();
      let indexUrl = Linq.from(list).indexOf(x =>x.url == currentUrlData.url);
      indexUrl = indexUrl == 0 ? list.length : indexUrl
      const audioDic = audioData[indexUrl - 1];
      setCurrentUrlData(audioDic)
    }
    // 下一首
    const onNextPlay = () => {
      let indexUrl = Linq.from(currentAudioData()).indexOf(x =>x.url == currentUrlData.url);
      indexUrl = indexUrl == audioData.length - 1 ? -1 : indexUrl
      const audioDic = audioData[indexUrl + 1];
      setCurrentUrlData(audioDic)
    }
    // 是否可以播放
    const onCanPlay = (event:any) => {
      console.log('onCanPlay->event::',event);
      setIsLoadingPlay(false)
    }
    // 切换原
    const onAbort = () => {
      setProgress(0)
      setIsLoadingPlay(true)
    }
    // 不可以播放的时候调用
    // const onCanPlayThrough = (event) => {
    //   console.log('onCanPlayThrough->event::',event);
    //   setIsLoadingPlay(true)
    // }
    // 播放结束
    const onEnded = () => {
      onNextPlay();
    }
    // 播放失败
    const onError = () => {
      message.error('当前音频播放失败！自动跳转到下一首歌曲',2,()=>{onNextPlay()})
    }
    // 音频播放每毫秒调用一次
    const onListen = (value:number) => {
      setProgress(value)
    }
    // 循序还是随机
    const onRepeatRandom = (key:string) => {
      setRepeatType(key)
      if(key == randomKey){
        setAudioShuffleData(_.shuffle(listAudio));
      }
    }
    // 当前要播放的原
    const currentAudioData = useCallback(() => {
      if(repeatType == randomKey) {
        return audioShuffleData
      } 
      return audioData
    },[repeatType])
    // 音量控制
    const onVolumeChange = (value:number) => {
      hideSlider.run()
      setVolume(value / 100)
    }
    // 进度拖拽实时
    const onSliderChange = useCallback((value:number) => {
      setProgress(value)
    },[])
    // 拖拽后进度
    const onAfterChange = (value:number)  => {
      audioElRef.current.currentTime = value;
    }
    const hideSlider = useDebounceFn(() => {
      setVolumeHovered(false);
    },{wait:3000})
    // 音频信息
    const songInfoView = () => {
      return (
        <FlexRow style={{paddingLeft:28,flexShrink:0,width:318}}>
           <FlexImage width={40} height={40} src={currentUrlData.img}/>
           <FlexWidth12/>
           <FlexColumn>
              <FlexText style={{color:'#222',fontSize:14}}>{currentUrlData.name}</FlexText>
              <FlexText style={{color:'#999',fontSize:12}}>{currentUrlData.author}</FlexText>
           </FlexColumn>
        </FlexRow>
      )
    }
    // 播放按钮 播放 暂停 等
    const playerView = () => {
      return (
        <FlexRow style={{alignItems:'center',flex:1,justifyContent:'center'}}>
          <div  onClick={onPreviousPlay}><SkipPrevious sx={iconSkipStyle}/> </div>
          <div style={{margin:'0 10px',position:'relative'}} onClick={onPlayAndPause}> 
            {isPlay ? <PauseCircleFilledOutlined sx={iconStyle}/> :<PlayCircleFilledOutlined sx={iconStyle}/> }
            {isLoadingPlay && <FlexCenter style={{position:'absolute',left:0, right:0, top:0, bottom:0,margin:'auto'}}><LoadingOutlined style={{color:'#fff',fontSize:28,marginBottom:4}}/></FlexCenter>}
          </div>
          <div onClick={onNextPlay} style={{marginRight:10}}><SkipNext sx={iconSkipStyle}/></div>
          {repeatType == sequenceKey ? <div onClick={() => onRepeatRandom(randomKey)}><Repeat sx={iconXHStyle}/></div> : null}
          {repeatType == randomKey ? <div onClick={() => onRepeatRandom(repeatKey)}><Shuffle sx={iconXHStyle}/></div> : null}
          {repeatType == repeatKey ? <div onClick={() => onRepeatRandom(sequenceKey)}><RepeatOne sx={iconXHStyle}/></div> : null}
        </FlexRow>
      )
    }
    // 音量
    const volumeContent= () => {
      return(
        <SliderDiv style={{height:140}}>
           <Slider tipFormatter={null} vertical value={volume * 100} max={100} onChange={onVolumeChange}/>
        </SliderDiv>
      )
    }
    // 播放显示信息
    const playerToolView = () => {
     return (
      <FlexRow style={{flexShrink:0,width:318,paddingRight:12,alignItems:'center',justifyContent:'flex-end'}}>
           <FlexText numberOfLine={1} style={{color:'#9a9a9a',fontSize:12,textAlign:'center',lineHeight:20}}>{formatTime(progress)} / {formatTime(audioElRef?.current?.duration || 0)}</FlexText>
           <Popover placement='top' color={THEME.c2B2D31} content={volumeContent()} trigger="hover" visible={volumeHovered}>
            <DivRight onClick={()=>{setVolumeHovered(!volumeHovered);hideSlider.run();}}>
                {volume!=0 && <FlexCenter><VolumeUp sx={iconVolStyle} /></FlexCenter>}
                {volume==0 && <FlexCenter><VolumeOff sx={iconVolStyle} /></FlexCenter>}
            </DivRight>
           </Popover>
           <PlayerMenuListView />
      </FlexRow>
     )
    }
    const sliderProgressView = () => {
      return (
        <div style={{width:'100%',position:'absolute',top:-2,margin:'0 0px'}}>
          <Slider className='slider' value={progress || 0} max={audioElRef?.current?.duration || 0} onAfterChange={onAfterChange} tipFormatter={null} onChange={onSliderChange}/>
        </div>
      )
    }
    return (
      <Con style={{}}>
          <ReactAudioPlayer
              ref = {(ele:any) =>{ 
                audioRef.current = ele;
                audioElRef.current = audioRef.current?.audioEl?.current || {};}}
              src={currentUrlData.url}
              loop = {repeatType == repeatKey}
              autoPlay = {isPlay}
              controls={false}
              volume={volume}
              onEnded={onEnded}
              onError={onError}
              onListen={onListen}
              listenInterval={1000}
              onCanPlay={onCanPlay}
              onAbort={onAbort}
              // onCanPlayThrough={onCanPlayThrough}
          />
          <FlexRow style={{alignItems:"center",position:'relative',width:'100%'}}>
            {songInfoView()}
            {playerView()}
            {playerToolView()}
          </FlexRow>
          {sliderProgressView()}
      </Con>
    )
}

export default AudioView