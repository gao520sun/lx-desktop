import { FlexImage, FlexRow } from '@/globalStyle'
import TextView from '@/pages/Components/TextView';
import THEME from '@/pages/Config/Theme';
import { getDateStr } from '@/utils/DateFormat';
import { httpImgUrl } from '@/utils/VodUrl'
import React from 'react'
import styled from 'styled-components';
const Con = styled.div`
  display: flex;
  flex-direction: column;
  flex:1;
  padding-bottom: 10px;
  position:relative;
`
const InfoAbsoluteDiv = styled.div`
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  display: flex;
  flex-direction: column;
  padding: 4px 12px;
`;
const YyDiv = styled.div`
  background:linear-gradient(180deg,#8B8C9320,#21252D95,#21252D,#21252D,#21252D);
  position:absolute;
  bottom:0;
  left:0;
  right:0;
  height:80px;
  border-bottom-left-radius:10px;
  border-bottom-right-radius:10px;
`;
const typeDic:any = {1:'电影',2:'电视剧',3:'综艺',4:'动漫'}
const typeColor:any = {1:'#ff4757',2:'#ff6348',3:'#ffa502',4:'#3742fa'}
const ListCell = (props:any) => {
    const data = props.value;
  return (
    <Con>
        <FlexImage className='historyUrlImg' src={httpImgUrl(data.vod_pic)}/>
        <InfoAbsoluteDiv >
            <YyDiv/>
            <div style={{flex:1}}/>
            <TextView style={{color:'#fff', fontSize:16, fontWeight:500}} numberOfLine={1}>{data.vod_name}</TextView>
            <TextView style={{color:'#8B8C93', fontSize:12,marginTop:2}} numberOfLine={1}>{'观看至' + data.name}</TextView>
            <FlexRow style={{alignItems:'baseline'}}>
                <TextView style={{color:typeColor[data.type_id], fontSize:12,marginRight:10}} numberOfLine={1}>{typeDic[data.type_id]}</TextView>
                <TextView style={{color:'#8B8C93', fontSize:12,marginTop:2}} numberOfLine={1}>{getDateStr(data.time,'MM/dd hh:mm')}</TextView>
            </FlexRow>
        </InfoAbsoluteDiv>
    </Con>
  )
}

export default ListCell