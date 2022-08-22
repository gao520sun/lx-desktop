import { Flex, FlexCenter, FlexColumn, FlexHeight10, FlexImage, FlexRow, FlexText, FlexWidth, FlexWidth10, FlexWidth12 } from '@/globalStyle';
import { Drawer, DrawerProps } from 'antd'
import React, { useState } from 'react'
import Linq from 'linq';
import styled from 'styled-components';
import THEME from '@/pages/Config/Theme';
import { AddCard, Delete, FormatListNumberedRtl } from '@mui/icons-material';
import { formatTime } from '@/utils/VodDate';
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
`
const iconVolStyle = {fontSize:20,color:'#9a9a9a',":hover":{color:THEME.theme}};
const iconItemStyle = {...iconVolStyle,fontSize:18};
const PlayerMenuListView = (props:IProps) => {
    const [visible, setVisible] = useState(false); // 显示菜单
    const [placement] = useState<DrawerProps['placement']>('right');
    const onClose = () => {
        setVisible(false)
    }
    const onItemCellClick = (item:any) => {
        console.log('item::',item)
    }
    const headerView = () => {
        const textStyle = {color:'#333', fontSize:12,lineHeight:'20px'};
        const lineWidth = '6px'
        return (
            <FlexColumn>
                <FlexText style={{fontSize:20,color:'#333'}}>播放列表</FlexText>
                <FlexHeight10/>
                <FlexRow style={{alignItems:'center',}}>
                    <FlexText style={textStyle}>共{1222}首歌曲</FlexText>
                    <Flex/>
                    <FlexCenter ><AddCard sx={iconItemStyle}/></FlexCenter>
                    <FlexWidth width={lineWidth}/>
                    <FlexText style={textStyle}>收藏全部</FlexText>
                    <FlexWidth10/>
                    <FlexCenter><Delete sx={iconItemStyle}/></FlexCenter>
                    <FlexWidth width={lineWidth}/>
                    <FlexText style={textStyle}>清空列表</FlexText>
                    <FlexWidth12/>
                </FlexRow>
            </FlexColumn>
        )
    }
    const itemCellView = (item:any) => {
        return (
            <CellDiv key={item} onClick={() => onItemCellClick(item)}>
                <FlexImage style={{width:40,height:40}} src=''/>
                <FlexWidth width='12px'/>
                <FlexColumn style={{width:'100%'}}>
                    <FlexText numberOfLine={1} color={'#333'}>回到过去</FlexText>
                    <FlexRow style={{alignItems:'center'}}>
                        <FlexText numberOfLine={1} color={'#333'}>周杰伦</FlexText>
                        <Flex/>
                        <FlexText fontSize={'12px'} color={'#333'}>{formatTime(1332)}</FlexText>
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
                {list.map((item:any) => {
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