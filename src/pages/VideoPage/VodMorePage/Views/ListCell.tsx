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
  return (
    <Con>
        <FlexImage className='urlImg' src={httpImgUrl(data.vod_pic)}/>
        <TextView style={{color:'#fff', fontSize:14, marginTop:6}} numberOfLine={1}>{data.vod_name}</TextView>
    </Con>
  )
}

export default ListCell