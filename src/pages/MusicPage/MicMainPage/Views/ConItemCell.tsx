import { FlexCenter, FlexColumn, FlexImage, FlexText } from '@/globalStyle';
import THEME from '@/pages/Config/Theme';
import { PlayCircle } from '@mui/icons-material';
import { useModel } from '@umijs/max';
import { useDebounceFn } from 'ahooks';
import React, { useCallback } from 'react'
import styled from 'styled-components';
const Con = styled.div`
  display: flex;
  flex-direction: column;
  flex:1;
  padding-bottom: 10px;
  cursor: pointer;
`
const ImageDiv = styled(FlexImage)`
object-fit: cover;
`
const BorderDiv = styled(FlexCenter)`
  right:20px;bottom:20px;
  position: absolute;
  z-index: 100;
  border-radius: 5px;
  display: none;
  ${Con} :hover &{ // TODO & 当前组件组件 ${Con}这里感觉必须是最顶层不然不生效
    display: flex;
  }
`

const iconVolStyle = {fontSize:40,color:'#fff',":hover":{color:THEME.theme},cursor: 'pointer'};
const ConItemCell = (props:any) => {
  const data = props.value;
  const {micNavigate} =  useModel('global');
  const onItemPlayClick = () => {
  }
  const onPlayDetailClick = useCallback(() => {
    console.log('onPlayDetailClick', props)
    props.navigate?.push('MicClassifiedDetail',data)
  },[props.navigate])
  return (
    <Con onClick={onPlayDetailClick}>
        <FlexColumn style={{position: 'relative'}}>
          <ImageDiv className='urlImg' src={data.cover_url}/>
          <BorderDiv className='b_v'>
            <FlexCenter onClick={onItemPlayClick}><PlayCircle sx={iconVolStyle}/></FlexCenter>
          </BorderDiv>
        </FlexColumn>
        <FlexText numberOfLine={2} style={{color:'#333', marginTop:6}}>{data.title}</FlexText>
        <FlexText numberOfLine={1} style={{color:'#999', fontSize:12}}>{data.name}</FlexText>
    </Con>
  )
}

export default ConItemCell