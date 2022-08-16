import React from 'react'
import { ChevronLeftOutlined } from '@mui/icons-material'
import THEME from '@/pages/Config/Theme'
const iconStyle = {fontSize:35,color:'#fff',":hover":{color:THEME.theme}};
const BackNavView = () => {
    const onBackClick  = () => {
        PubSub.publishSync('nav:back');
    }
  return (
    <div onClick={onBackClick}><ChevronLeftOutlined sx={iconStyle}/></div>
  )
}

export default BackNavView