import { FlexCenter, FlexColumn, FlexImage, FlexRow, FlexText, FlexWidth12 } from '@/globalStyle';
import styled from 'styled-components'
import React, { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactAudioPlayer from 'react-audio-player';
import { KeyboardDoubleArrowDown, KeyboardDoubleArrowUp, PauseCircleFilledOutlined, PlayCircleFilledOutlined, Repeat, RepeatOne, Shuffle, SkipNext, SkipPrevious, VolumeOff, VolumeUp } from '@mui/icons-material';
import THEME from '@/pages/Config/Theme';
import Linq from 'linq'
import _ from 'lodash';
import { message, Popover, Slider } from 'antd';
import PubSub from 'pubsub-js'
import { useDebounceFn } from 'ahooks';
import { formatTime } from '@/utils/VodDate';
import { LoadingOutlined } from '@ant-design/icons';
import PlayerMenuListView from './PlayerMenuListView';
import { useRequest ,useModel } from '@umijs/max';
import {playerUrl, getLyric, sourceList} from '../../MicModel/MicCategory'
import LyricView from './LyricView';
import { getStoreItem, setStoreItem } from '@/utils/Storage';
const Con = styled(FlexRow)`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    z-index: 1000;
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
const AlbumPicDiv = styled(FlexCenter)``
const ArrowDiv = styled(FlexCenter)`
  position:absolute;
  width:100%;
  height:100%;
  background:#00000090;
  display: none;
  ${AlbumPicDiv}:hover &{ // TODO & ?????????????????? ${Con}?????????????????????????????????????????????
    display: flex;
  }
`
const iconStyle = {fontSize:40,color:THEME.theme};
const iconSkipStyle = {fontSize:30,color:'#000',":hover":{color:THEME.theme}};
const iconXHStyle = {fontSize:20,color:'#949494',":hover":{color:THEME.theme}};
const iconVolStyle = {fontSize:20,color:'#9a9a9a',":hover":{color:THEME.theme}};

const sequenceKey = 'sequence'
const randomKey = 'random'
const repeatKey = 'repeat'
const AudioView = () => {
    const audioRef:any = useRef();
    const audioElRef:any = useRef();
    const [audioData, setAudioData] = useState([]);
    const [audioShuffleData, setAudioShuffleData] = useState([]);
    const [currentUrlData, setCurrentUrlData] = useState<any>({});
    const [isPlay, setIsPlay] = useState(false);
    const [repeatType, setRepeatType] = useState<string>(sequenceKey); // sequence random repeat
    const [volumeHovered, setVolumeHovered] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [progress, setProgress] = useState(0);
    const [isLoadingPlay, setIsLoadingPlay] = useState(false); // ????????????????????????
    const {run:playerRun} = useRequest(playerUrl(currentUrlData.source),{
      manual:true,
      onSuccess:(res:any) => {
        if(res.status == 0){
          let dic:any = Linq.from(audioData).firstOrDefault((x:any) => x.id == res.data.id,{});
          dic = Object.assign(dic || {},res.data)
          setCurrentUrlData(dic);
        }else {
          isPlay && audioElRef.current.pause();
          setIsPlay(false)
          message.error(res.message);
          // setTimeout(() => {
          //   message.error('?????????????????????');
          //   onNextPlay()
          // }, 2000);
        }
      },
      onError:() => {
        message.error('????????????');
      }
    })
    const {run:lyricRun} = useRequest(getLyric(currentUrlData.source),{
      manual:true,
      onSuccess:((res:any) => {
        if(res.status == 0){
          const cData = _.cloneDeep(currentUrlData);
          cData.lyric = res.data;
          setCurrentUrlData(cData);
        }
      })
    })
    useEffect(() => {
      const pl = getStoreItem(window.STORE_TYPE.playList);
      setPlayerListHandle(pl||[],'local');
    },[])
    useEffect(() => {
      // ????????????->????????????????????????
      let token:any = PubSub.subscribe(window.MIC_TYPE.songPlay,(msg,data) =>{
        setPlayerListHandle(data,'play')
      });
      // ???????????????????????? -> ?????????????????????
      let token1:any = PubSub.subscribe(window.MIC_TYPE.addSongPlay,(msg,value:any = []) =>{
        let data:any = audioData.concat(value);
        data = Linq.from(data).distinct((x:any) => x.id).toArray();// ????????????
        setPlayerListHandle(data,'add')
      });
      // ????????????->???????????????????????????
      let token2:any = PubSub.subscribe(window.MIC_TYPE.oneSongPlay,(msg,value:any = []) =>{
        // ?????????
        const songDic:any = Linq.from(audioData).firstOrDefault((x:any) => x.id == value.id);
        if(songDic){
          playerRunHandle(songDic)
          return;
        }
        // ???????????????????????????????????????
        let list = [...audioData];
        let index =  Linq.from(list).indexOf((x:any) => x.id == currentUrlData.id);
        index = index == -1 ? 0 : index;
        list.splice(index,0,value);
        setPlayerListHandle(list,'add')
        playerRunHandle(value)
      });
      // ????????????????????????
      let token3:any = PubSub.subscribe(window.MIC_TYPE.clearSongPlay,(msg,value:any = []) =>{
        setAudioShuffleData([])
        setAudioData([])
        setCurrentUrlData({})
        setIsPlay(false)
        setProgress(0)
        audioElRef.current.pause();
      });
      // ???????????????
      setStoreItem(window.STORE_TYPE.playList,audioData)
      return () => {
        PubSub.unsubscribe(token)
        PubSub.unsubscribe(token1)
        PubSub.unsubscribe(token2)
        PubSub.unsubscribe(token3)
      }
    },[audioData])
    // ???????????????????????????
    const setPlayerListHandle = useCallback((data:any,type:string) => {
      let list = data || [];
      setAudioData(data);
      if(repeatType == randomKey){ // ?????? ??????????????????
        list = _.shuffle(list);
        setAudioShuffleData(list);
      }
      setTimeout(() => {
        if(!list.length) return;
        const playDic = list[0];
        if(type == 'play'){ // ????????????????????????
          playerRunHandle(playDic)
          playingHandle();
        }else if(type == 'add'){
          if(!currentUrlData.url){
            playerRunHandle(playDic)
          }
        }else if(type == 'local'){
          if(!currentUrlData.url){
            playerRunHandle(playDic)
          }
        }
      },10)
    },[audioData])
    useEffect(() => {
      if(JSON.stringify(currentUrlData) == '{}'){return}
      if(!currentUrlData.url){playerRun(currentUrlData)}
      lyricRun(currentUrlData.id)
      setProgress(0)
      // setIsPlay(true)
      // audioElRef.current.play();
    },[currentUrlData.source,currentUrlData.id])
    // ?????????????????????
    const playerRunHandle = useCallback((playDic:any) => {
      setCurrentUrlData(playDic);
    },[audioData])
    // ??????????????????
    const onPlayAndPause = () => {
      if(!audioData.length){message.error('?????????????????????'); return;}
      if(isPlay){
        audioElRef.current.pause();
      }else {
        audioElRef.current.play();
      }
      setIsPlay(!isPlay)
    }
    const playingHandle = () => {
      setTimeout(() => {
        setIsPlay(true)
        audioElRef.current.play();
      },500)
    }
    // ?????????
    const onPreviousPlay = () => {
      if(!audioData.length){message.error('?????????????????????'); return;}
      const list:any = currentAudioData();
      let indexUrl = Linq.from(list).indexOf((x:any) =>x.id == currentUrlData.id);
      indexUrl = indexUrl == 0 ? list.length : indexUrl
      const audioDic:any = audioData[indexUrl - 1];
      playerRunHandle(audioDic)
      playingHandle()
    }
    // ?????????
    const onNextPlay = () => {
      if(!audioData.length){message.error('?????????????????????'); return;}
      const list:any = currentAudioData();
      let indexUrl = Linq.from(list).indexOf((x:any) =>x.id == currentUrlData.id);
      indexUrl = indexUrl == audioData.length - 1 ? -1 : indexUrl
      const audioDic:any = audioData[indexUrl + 1];
      playerRunHandle(audioDic)
    }
    // ??????????????????
    const onCanPlay = (event:any) => {
      console.log('onCanPlay->event::',event);
      setIsLoadingPlay(false)
      playingHandle()
    }
    // ?????????
    const onAbort = () => {
      setProgress(0)
      setIsLoadingPlay(true)
    }
    // ??????????????????????????????
    // const onCanPlayThrough = (event) => {
    //   console.log('onCanPlayThrough->event::',event);
    //   setIsLoadingPlay(true)
    // }
    // ????????????
    const onEnded = () => {
      onNextPlay();
    }
    // ????????????
    const onError = () => {
      message.error('?????????????????????????????????????????????????????????',2,()=>{onNextPlay()})
    }
    // ?????????????????????????????????
    const onListen = (value:number) => {
      setProgress(value)
    }
    // ??????????????????
    const onRepeatRandom = useCallback((key:string) => {
      if(key == randomKey){
        setAudioShuffleData(_.shuffle(audioData));
      }
      setRepeatType(key);
    },[repeatType,audioData,audioShuffleData])
    // ?????????????????????
    const currentAudioData = useCallback(() => {
      if(repeatType == randomKey) {
        return audioShuffleData
      } 
      return audioData
    },[repeatType,audioData,audioShuffleData])
    // ????????????
    const onVolumeChange = (value:number) => {
      hideSlider.run()
      setVolume(value / 100)
    }
    // ??????????????????
    const onSliderChange = useCallback((value:number) => {
      setProgress(value)
    },[])
    // ???????????????
    const onAfterChange = (value:number)  => {
      audioElRef.current.currentTime = value;
    }
    // ??????????????????
    const onGoLyricPage = () => {
      window.PubSub.publishSync(window.MIC_TYPE.showLyric,{isShow:true})
    }
    const hideSlider = useDebounceFn(() => {
      setVolumeHovered(false);
    },{wait:3000})
    // ????????????
    const songInfoView = useMemo(() => {
      const cDic:any = Linq.from(sourceList).firstOrDefault((x:any)=>x.key == currentUrlData.source);
      return (
        <FlexRow style={{paddingLeft:28,flexShrink:0,width:318}}>
           {currentUrlData.artist_pic && <AlbumPicDiv style={{position:'relative'}}>
              <FlexImage style={{flexShrink:0,width:40,height:40}} width={40} height={40} src={currentUrlData.album_pic}/>
              <ArrowDiv onClick={() => {onGoLyricPage()}}><KeyboardDoubleArrowUp sx={{color:'#fff',fontSize:24}}/></ArrowDiv>
            </AlbumPicDiv>}
           <FlexWidth12/>
           <FlexColumn>
              <FlexText numberOfLine={1} style={{color:'#222',fontSize:14}}>{currentUrlData.name}</FlexText>
              {currentUrlData.name && <FlexRow>
                <FlexText style={{color:'#999',fontSize:12}}>?????????{currentUrlData.artist_name}</FlexText>
                <FlexText style={{color:'#999',fontSize:12,marginLeft:15}}>{'?????????'+ cDic.title}</FlexText>
              </FlexRow>}
           </FlexColumn>
        </FlexRow>
      )
    },[currentUrlData?.url])
    // ???????????? ?????? ?????? ???
    const playerView = useMemo(() => {
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
    },[currentUrlData?.url,isPlay,isLoadingPlay,repeatType])
    // ??????
    const volumeContent= () => {
      return(
        <SliderDiv style={{height:140}}>
           <Slider tipFormatter={null} vertical value={volume * 100} max={100} onChange={onVolumeChange}/>
        </SliderDiv>
      )
    }
    // ??????????????????
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
           <PlayerMenuListView data={audioData} currentData={currentUrlData}/>
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
            {songInfoView}
            {playerView}
            {playerToolView()}
          </FlexRow>
          {sliderProgressView()}
          <LyricView value = {currentUrlData} progress={progress}/>
      </Con>
    )
}

export default AudioView