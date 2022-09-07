import { FlexCenter, FlexColumn, FlexHeight, FlexImage, FlexRow, FlexText, FlexWidth } from '@/globalStyle'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CSSTransition} from 'react-transition-group'
import './styles.css'
import { formatTime } from '@/utils/VodDate'
import Linq from 'linq'
import THEME from '@/pages/Config/Theme'
import { ExpandMore } from '@mui/icons-material'
import { useModel } from '@umijs/max';
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
let jumpData = '';
const LyricView = (props:any) => {
    const {micNavigate} =  useModel('global');
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
        if(!showMessage ){return}
        const time = formatTime(props.progress);
        const dic:any = Linq.from(lyricHandle).firstOrDefault((x:string) => x.indexOf(time) != -1 ? true : false);
        const fraction = 0.5;
        if(dic) {
            const lyricDoc:any = document.getElementById('lyric') || {};
            Linq.from(lyricDoc.children).forEach((x:any) => {x.style.color = '#666';x.style.fontSize = '14px'})
            const childDoc:any = document.getElementById(dic) || {};
            if(childDoc && childDoc.style){
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
            
        }
        return () => {
        }
    },[formatTime(props.progress),showMessage])
    const lyricHandle = useMemo(() => {
        const lyric = data.lyric ||'';
        const lyricArr = lyric ? lyric.split('\n') : [];
        return lyricArr;
    },[data.lyric])
    // 点击专辑
    const onAlbumClick = () => {
        jumpData = 'album';
        setShowMessage(false);
    }
    // 点击歌手
    const onArtistClick = () => {
        jumpData = 'artist'
        setShowMessage(false);
    }
    const onExitedCallback = useCallback(() => {
        console.log('退出完成1',jumpData,data)
        if(jumpData){
            micNavigate?.push('MicClassifiedDetail',{type:jumpData,...data})
        }
    },[showMessage,jumpData])
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
                        <FlexCenter onClick={onArtistClick} style={{cursor:'pointer'}}><FlexText style={{fontSize:14,color:'#333'}} >{data.artist_name}</FlexText></FlexCenter>
                        <FlexWidth width='50px'/>
                        <FlexText style={{fontSize:14,color:'#999'}}>专辑：</FlexText>
                        <FlexCenter  onClick={onAlbumClick} style={{cursor:'pointer'}}><FlexText numberOfLine={1} style={{fontSize:14,color:'#333'}}>{data.album}</FlexText></FlexCenter>
                        
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
                {lyricHandle.map((item:any,index:number)=> {
                    let str = item.slice(item.indexOf("]") + 1)
                    return <div id={item} key={item + index} style={{fontSize:14,color:'#666',flexShrink:0, marginBottom:12}}>{str}</div>
                })}
            </ConLyricDiv>
        )
    },[data.lyric])
    return (
            <CssTran in={showMessage}
                classNames="box"
                timeout={300}
                unmountOnExit={true}
                onEnter={ (el: any)=>{jumpData = ''}}
                onEntering={ (el: any) => console.log('正在进入')}
                onEntered={ (el: any) => console.log('进入完成')}
                onExit={  (el: any) => console.log('开始退出')}
                onExiting={  (el: any) => console.log('正在退出')}
                onExited={  (el: any) => onExitedCallback()}>
                <Con>
                    {contentView()}
                </Con>
        </CssTran>
    
    )
}

export default LyricView