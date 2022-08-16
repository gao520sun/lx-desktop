
import THEME from '@/pages/Config/Theme';
import { formatTime } from '@/utils/VodDate';
import { PauseCircleOutlined, PlayCircleOutlined, StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';;
import { Popover, Row, Slider, Tooltip } from 'antd';
import React, { useCallback, useState } from 'react'
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import CropFreeOutlinedIcon from '@mui/icons-material/CropFreeOutlined';
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import SkipNextOutlinedIcon from '@mui/icons-material/SkipNextOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import styled from 'styled-components';
import { useDebounceFn } from 'ahooks';
import PubSub from 'pubsub-js'
const Con = styled.div`
  display: flex;
  flex-direction: column;
  height: 84px;
  background-color: #2B2D31;
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
const DivRight = styled.div`
  display: flex;
  margin-right: 16px;
`
const DivLeft = styled.div`
  display: flex;
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
interface IProps {
  player?:any,
  playing?:boolean
  duration?:number,
  progress?:number,
  playbackRate?:number,
  volume?:number,
  onSliderSeek?:(value:number)=>{},
  onSliderAfterSeek?:(value:number)=>{},
  onVolumeChange?:(value:number)=>{},
  onPlaying?:(value:boolean)=>{},
  onPlaybackRate?:(value:number)=>{},

}
const iconStyle = {fontSize:25,color:'#fff',":hover":{color:THEME.theme}};
const BsDiv = styled.div`
  margin-right: 16px;
  :hover {
    color:${(props:any) => props.hColor}
  }
`
const VodBottom = (props:IProps) => {
  const [playbackRate, setPlaybackRate] = useState(props.playbackRate);
  const [hovered, setHovered] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [volumeHovered, setVolumeHovered] = useState(false);
  const hideSlider = useDebounceFn(() => {
    setHovered(false)
    setVolumeHovered(false);
  },{wait:3000})
  const onSliderChange = useCallback((value:number) => {
    hideSlider.run()
    typeof props.onSliderSeek == 'function' && props.onSliderSeek(value);
  },[])
  const onAfterChange = (value:number)  => {
    hideSlider.run()
    typeof props.onSliderAfterSeek == 'function' && props.onSliderAfterSeek(value);
  }
  const onVolumeChange = useCallback((value:number) =>  {
    hideSlider.run()
    typeof props.onVolumeChange == 'function' && props.onVolumeChange(value);
  },[])
  const onPlayAanPause = (() => {
    typeof props.onPlaying == 'function' && props.onPlaying(!props.playing);
  })
  const onFullScreen = () => {
    console.log('!isFullScreen::',isFullScreen)
    PubSub.publishSync('vod:fullScreen',!isFullScreen);
    setIsFullScreen(!isFullScreen)
  }
  const content = () => {
    const rates = [2.0,1.5,1.25,1.0,0.75,0.5];
    return (
      <div style={{color:THEME.white}}>
        {rates.map(item => {
          return <div key={item} style={{color:playbackRate==item?THEME.theme:THEME.white,marginBottom:10}}
          onClick={() => {
            setPlaybackRate(item);
            setHovered(false);
            typeof props.onPlaying == 'function' && props.onPlaybackRate(item);
          }}>{item}X</div>
        })}
      </div>
    )
  };
  const volumeContent= () => {
    return(
      <SliderDiv style={{height:140}}>
         <Slider tipFormatter={null} vertical value={(props.volume || 0) * 100} max={100} onChange={onVolumeChange}/>
      </SliderDiv>
    )
  }
  return (
    <Con>
        <div style={{width:'100%'}}>
          <Slider className='slider' value={props.progress || 0} max={props.duration || 0} onAfterChange={onAfterChange} tipFormatter={null} onChange={onSliderChange}/>
        </div>
        <Row style={{marginLeft:16,alignItems:'center',color:THEME.white}}>
           <div style={{display:'flex'}} onClick={onPlayAanPause}>
            {!props.playing ? 
              <PlayArrowIcon sx={iconStyle}/> :
              <PauseOutlinedIcon sx={iconStyle}/>
            }
           </div>
           <DivLeft >
              <SkipNextOutlinedIcon sx={iconStyle}/>
           </DivLeft>
           <div style={{marginLeft:16}}>{formatTime(props.progress)} / {formatTime(props.duration)}</div>
           <div style={{flex:1}}/>
           <Popover placement='top' color={THEME.c2B2D31} content={content()} trigger="hover" visible={hovered}>
            <BsDiv hColor={THEME.theme} style={{color:hovered?THEME.theme:'#fff'}} onClick={()=>{setHovered(!hovered);hideSlider.run()}}>倍速</BsDiv>
           </Popover>
           <Popover placement='top' color={THEME.c2B2D31} content={volumeContent()} trigger="hover" visible={volumeHovered}>
            <DivRight onClick={()=>{setVolumeHovered(!volumeHovered);hideSlider.run();}}>
                <VolumeUpOutlinedIcon sx={iconStyle}/>
            </DivRight>
           </Popover>
           <DivRight onClick={onFullScreen}>
            <CropFreeOutlinedIcon sx={iconStyle}/>
           </DivRight>
        </Row>
    </Con>
  )
}

export default VodBottom