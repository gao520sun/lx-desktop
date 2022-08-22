import React from 'react'
import { ChevronLeftOutlined } from '@mui/icons-material'
import THEME from '@/pages/Config/Theme'
const iconStyle = {fontSize:35,color:'#fff',":hover":{color:THEME.theme}};
import { useModel } from '@umijs/max'
const BackNavView = (props:any) => {
    const onBackClick  = () => {
      if(props.onGoBack){
        props.onGoBack()
      }else {
        props.navigate.pop()
      }
    }
  return (
    <div onClick={onBackClick}><ChevronLeftOutlined sx={{...iconStyle,...props.iconStyle}}/></div>
  )
}

export default BackNavView