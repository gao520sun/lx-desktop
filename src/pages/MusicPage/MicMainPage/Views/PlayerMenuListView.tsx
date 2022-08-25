import { Flex, FlexCenter, FlexColumn, FlexHeight10, FlexImage, FlexRow, FlexText, FlexWidth, FlexWidth10, FlexWidth12 } from '@/globalStyle';
import { Drawer, DrawerProps } from 'antd'
import React, { useState } from 'react'
import Linq from 'linq';
import styled from 'styled-components';
import THEME from '@/pages/Config/Theme';
import { AddCard, Delete, FormatListNumberedRtl } from '@mui/icons-material';
import { formatTime } from '@/utils/VodDate';
import PubSub from 'pubsub-js'
interface IProps {
}
const Con = styled.div`
    overflow: hidden;
    height: 100%;
`
const ContentListDiv = styled(FlexColumn)`
    height: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar{
        width: 8px;
        background-color: transparent;
    };
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #a2a3a448;
  }
`
const CellDiv = styled(FlexRow)`
    height: 60px;
    width: 100%;
    flex-shrink: 0;
    border-bottom: 1px solid #f0f0f0;
    align-items: center;
    &:hover{
        background-color:#f0f0f0;
        cursor: pointer;
    };
`
const iconVolStyle = {fontSize:20,color:'#9a9a9a',":hover":{color:THEME.theme}};
const iconItemStyle = {...iconVolStyle,fontSize:18};
const PlayerMenuListView = (props:any) => {
    const [visible, setVisible] = useState(false); // 显示菜单
    const [placement] = useState<DrawerProps['placement']>('right');
    const onClose = () => {
        setVisible(false)
    }
    const onItemCellClick = (item:any) => {
        PubSub.publishSync(window.MIC_TYPE.oneSongPlay,item)
    }
    const onAddSongListClick = () => {

    }
    const onDeletePlayerListClick = () => {
        
    }
    const headerView = () => {
        const textStyle = {color:'#333', fontSize:12,lineHeight:'20px'};
        const lineWidth = '6px'
        return (
            <FlexColumn style={{marginTop:60}}>
                <FlexText style={{fontSize:20,color:'#333'}}>播放列表</FlexText>
                <FlexHeight10/>
                <FlexRow style={{alignItems:'center',}}>
                    <FlexText style={textStyle}>共{props.data?.length || 0}首歌曲</FlexText>
                    <Flex/>
                    <FlexRow onClick={onAddSongListClick}>
                        <FlexCenter ><AddCard sx={iconItemStyle}/></FlexCenter>
                        <FlexWidth width={lineWidth}/>
                        <FlexText style={textStyle}>添加全部歌单</FlexText>
                        <FlexWidth10/>
                    </FlexRow>
                    <FlexRow onClick={onDeletePlayerListClick}>
                        <FlexCenter><Delete sx={iconItemStyle}/></FlexCenter>
                        <FlexWidth width={lineWidth}/>
                        <FlexText style={textStyle}>清空列表</FlexText>
                    </FlexRow>
                    <FlexWidth12/>
                </FlexRow>
            </FlexColumn>
        )
    }
    const itemCellView = (item:any) => {
        const isSelect = item.id == props.currentData.id;
        return (
            <CellDiv key={item.id} onClick={() => onItemCellClick(item)}>
                <FlexImage style={{width:40,height:40}} src={item.album_pic}/>
                <FlexWidth width='12px'/>
                <FlexColumn style={{width:'100%'}}>
                    <FlexText numberOfLine={1} color={isSelect?THEME.theme:'#333'}>{item.name}</FlexText>
                    <FlexRow style={{alignItems:'center'}}>
                        <FlexText numberOfLine={1} fontSize={'12px'} color={isSelect?THEME.theme:'#333'}>{item.artist_name}</FlexText>
                        <Flex/>
                        <FlexText fontSize={'12px'} color={isSelect?THEME.theme:'#333'}>{formatTime(item.duration / 1000)}</FlexText>
                        <FlexWidth12/>
                    </FlexRow>
                </FlexColumn>
            </CellDiv>
        )
    }
    const listContentView = () => {
        const list = Linq.range(1,100).toArray();
        return (
            <ContentListDiv>
                {props.data?.map((item:any) => {
                    return itemCellView(item)
                })}
            </ContentListDiv>
        )
    }
    return (
        <Con>
            <FlexCenter style={{marginRight:10}} onClick={() => {setVisible(true)}}><FormatListNumberedRtl sx={iconVolStyle}/></FlexCenter>
            <Drawer
                title=""
                placement={placement}
                closable={false}
                onClose={onClose}
                visible={visible}
                key={placement}
                contentWrapperStyle={{width:320}}
                bodyStyle={{padding:12,paddingRight:0}}
                maskStyle={{background:'transparent'}}
            >
                <FlexColumn style={{overflow:'hidden',height:'100%'}}>
                    {headerView()}
                    <FlexHeight10/>
                    {listContentView()}
                </FlexColumn>
            </Drawer>
        </Con>
    )
}

export default PlayerMenuListView