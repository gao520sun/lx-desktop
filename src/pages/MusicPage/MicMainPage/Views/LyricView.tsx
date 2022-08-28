import { FlexCenter, FlexColumn, FlexHeight, FlexImage, FlexRow, FlexText, FlexWidth } from '@/globalStyle'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CSSTransition} from 'react-transition-group'
import './styles.css'
import { formatTime } from '@/utils/VodDate'
import Linq from 'linq'
import THEME from '@/pages/Config/Theme'
import { ExpandMore } from '@mui/icons-material'
const Con = styled(FlexColumn)`
    position: fixed;
    top:0;
    left: 110px;
    right: 0px;
    bottom: 70px;
    flex-shrink: 0;
    background: #fff;
    overflow: hidden;
`
const CssTran = styled(CSSTransition)``
const ConLyricDiv = styled(FlexColumn)`
    width:450px;
    height:70%;
    overflow-y: scroll;
    &::-webkit-scrollbar{
        width: 8px;
        background-color: transparent;
  };
  &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #a2a3a448;
  }

`;
const iconDownStyle = {fontSize:30,color:'#9a9a9a',":hover":{color:THEME.theme}};
const LyricView = (props:any) => {
    const [showMessage, setShowMessage] = useState(false);
    const data = props.value;
    useEffect(() => {
        let token:any =  window.PubSub.subscribe(window.MIC_TYPE.showLyric,(msg,data) =>{
            setShowMessage(!showMessage)
        });
        let token1:any =  window.PubSub.subscribe(window.MIC_TYPE.dataLyric,(msg,data) =>{
        });
        return () => {
            window.PubSub.unsubscribe(token)
            window.PubSub.unsubscribe(token1)
        }
    },[showMessage])
    useEffect(() => {
        if(!showMessage){return}
        const time = formatTime(props.progress);
        const dic:any = Linq.from(lyricHandle).firstOrDefault((x:string) => x.indexOf(time) != -1 ? true : false);
        const fraction = 0.5;
        if(dic) {
            const lyricDoc:any = document.getElementById('lyric') || {};
            Linq.from(lyricDoc.children).forEach((x:any) => {x.style.color = '#666';x.style.fontSize = '14px'})
            const childDoc:any = document.getElementById(dic) || {};
            childDoc.style.color = THEME.theme;
            childDoc.style.fontSize ='16px';
            const childOffsetTop =  childDoc.offsetTop - childDoc.parentNode.offsetTop;
            const centerHeight = lyricDoc.clientHeight * fraction;
            const currentTextTop = childOffsetTop - lyricDoc.scrollTop;
            if( currentTextTop > centerHeight){
                lyricDoc.scrollTop += Math.ceil(currentTextTop - centerHeight);
            }
            else if (currentTextTop <centerHeight && lyricDoc.scrollTop != 0) {
                lyricDoc.scrollTop -= Math.ceil(centerHeight - (currentTextTop));
            }
        }
    },[formatTime(props.progress),showMessage])
    const lyricHandle = useMemo(() => {
        const lyric = data.lyric?.lrc?.lyric;
        const lyricArr = lyric ? lyric.split('\n') : [];
        return lyricArr;
    },[data.lyric?.lrc?.lyric])
    const contentView = () => {
        return (
            <FlexRow style={{justifyContent:'center',paddingTop:100,height:'100%'}}>
                <FlexImage width={'270px'} height={'270px'} src={data.album_pic}/>
                <FlexWidth width='90px'/>
                <FlexColumn>
                    <FlexText style={{fontSize:20,color:'#333'}}>{data.name}</FlexText>
                    <FlexHeight/>
                    <FlexRow style={{borderBottom:'1px solid #f0f0f0',paddingBottom:10}}>
                        <FlexText style={{fontSize:14,color:'#999'}}>歌手：</FlexText>
                        <FlexText style={{fontSize:14,color:'#333'}}>{data.artist_name}</FlexText>
                        <FlexWidth width='50px'/>
                        <FlexText style={{fontSize:14,color:'#999'}}>专辑：</FlexText>
                        <FlexText numberOfLine={1} style={{fontSize:14,color:'#333'}}>{data.album}</FlexText>
                    </FlexRow>
                    <FlexHeight/>
                    {lyricContentView}
                </FlexColumn>
                <FlexCenter style={{position:'absolute',top:20,left:20}} onClick={() => setShowMessage(false)}><ExpandMore sx={iconDownStyle}/></FlexCenter>
            </FlexRow>
        )
    }
    const lyricContentView = useMemo(() => {
        if(!lyricHandle.length){
            return <div >当前歌曲未找到歌曲</div>
        }
        return (
            <ConLyricDiv id='lyric'>
                {lyricHandle.map((item:any)=> {
                    let str = item.slice(item.indexOf("]") + 1)
                    return <div id={item} key={item} style={{fontSize:14,color:'#666',flexShrink:0, marginBottom:12}}>{str}</div>
                })}
            </ConLyricDiv>
        )
    },[data.lyric?.lrc?.lyric])
    return (
            <CssTran in={showMessage}
                classNames="box"
                timeout={1000}
                unmountOnExit={true}
                onEnter={ (el: any)=>console.log('开始进入')}
                onEntering={ (el: any) => console.log('正在进入')}
                onEntered={ (el: any) => console.log('进入完成')}
                onExit={  (el: any) => console.log('开始退出')}
                onExiting={  (el: any) => console.log('正在退出')}
                onExited={  (el: any) => console.log('退出完成')}>
                <Con>
                    {contentView()}
                </Con>
        </CssTran>
    
    )
}

export default LyricView