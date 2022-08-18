import { FlexRow, FlexText } from '@/globalStyle';
import styled from 'styled-components'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactAudioPlayer from 'react-audio-player';
import { Loop, PauseCircleFilledOutlined, PlayCircleFilledOutlined, Repeat, RepeatOne, Shuffle, SkipNext, SkipPrevious, Sync } from '@mui/icons-material';
import THEME from '@/pages/Config/Theme';
import Linq from 'linq'
import _ from 'lodash';
const Con = styled(FlexRow)`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    border-top: 1px solid #e9e9e9;
    background-color: #ffffff;
`
const iconStyle = {fontSize:40,color:THEME.theme};
const iconSkipStyle = {fontSize:30,color:'#000'};
const iconXHStyle = {fontSize:20,color:'#949494'};
const listAudio = [
  {name:'测试 1',url:'http://96.ierge.cn/15/238/476559.mp3'},
  {name:'测试 2',url:'http://96.ierge.cn/15/237/474403.mp3'},
  {name:'测试 3',url:'http://96.ierge.cn/15/238/476567.mp3'},
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
    useEffect(() => {
      const audioDic = audioData[0];
      setCurrentUrlData(audioDic)
      console.log('audioShuffleData::',audioShuffleData)
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
    // 播放结束
    const onEnded = () => {
      onNextPlay();
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
    const playerView = () => {
      return (
        <FlexRow style={{alignItems:'center'}}>
          <div  onClick={onPreviousPlay}><SkipPrevious sx={iconSkipStyle}/> </div>
          <div style={{margin:'0 10px'}} onClick={onPlayAndPause}> 
            {isPlay ? <PauseCircleFilledOutlined sx={iconStyle}/> :<PlayCircleFilledOutlined sx={iconStyle}/> }
          </div>
          <div onClick={onNextPlay} style={{marginRight:10}}><SkipNext sx={iconSkipStyle}/></div>
          {repeatType == sequenceKey ? <div onClick={() => onRepeatRandom(randomKey)}><Repeat sx={iconXHStyle}/></div> : null}
          {repeatType == randomKey ? <div onClick={() => onRepeatRandom(repeatKey)}><Shuffle sx={iconXHStyle}/></div> : null}
          {repeatType == repeatKey ? <div onClick={() => onRepeatRandom(sequenceKey)}><RepeatOne sx={iconXHStyle}/></div> : null}
          <FlexText style={{color:'#000'}}>{currentUrlData.name}</FlexText>
        </FlexRow>
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
              onEnded={onEnded}
          />
        {playerView()}
      </Con>
    )
}

export default AudioView