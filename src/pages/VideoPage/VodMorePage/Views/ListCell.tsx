import { FlexImage } from '@/globalStyle'
import TextView from '@/pages/Components/TextView';
import { httpImgUrl } from '@/utils/VodUrl'
import React from 'react'
import styled from 'styled-components';
const Con = styled.div`
  display: flex;
  flex-direction: column;
  flex:1;
  padding-bottom: 10px;
`
const ListCell = (props:any) => {
    const data = props.value;
    const itemWidth = props.itemWidth;
    // 最大172 228
    // 最小 148 196
  return (
    <Con>
        <FlexImage width={'100%'} height={'100%'} src={httpImgUrl(data.vod_pic)}/>
        <TextView style={{color:'#fff', fontSize:14}} numberOfLine={1}>{itemWidth}</TextView>
    </Con>
  )
}

export default ListCell