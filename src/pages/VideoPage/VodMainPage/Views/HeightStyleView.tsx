import TextView from '@/pages/Components/TextView';
import { httpImgUrl } from '@/utils/VodUrl';
import { Col, Image } from 'antd';
import React from 'react'
import styled from 'styled-components';
import Linq from 'linq'
const Con = styled.div`
  display:flex;
  position:relative;
  background-color: transparent;
  border-radius:10px;
  padding-bottom: 5px;
`;
const InfoAbsoluteDiv = styled.div`
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  display: flex;
  flex-direction: column;
  padding: 12px 12px;
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
const ImgPic  = styled(Image)`
  width:${props => props.width};
  height:${props => props.height};
  border-radius: 10px;
  object-fit: cover;
`
function HeightStyleView({value,width,height}:any) {
  const desc = Linq.from(value.vod_sub || value.vod_blurb ).where((item,index)=>index<10).toJoinedString('');
  return (
    <Col>
      <Con>
        <ImgPic width={width || '163px'} height={height || '246px'} preview={false} src={httpImgUrl(value.vod_pic)}/>
        <InfoAbsoluteDiv >
            <YyDiv/>
            <div style={{flex:1}}/>
            <TextView style={{color:'#fff', fontSize:16, fontWeight:500}} numberOfLine={1}>{value.vod_name}</TextView>
            <TextView style={{color:'#8B8C93', fontSize:12}} numberOfLine={1}>{value.vod_remarks}</TextView>
            <TextView style={{color:'#8B8C93', fontSize:12}} numberOfLine={1}>{desc}</TextView>
        </InfoAbsoluteDiv>
      </Con>
    </Col>
  )
}

export default HeightStyleView