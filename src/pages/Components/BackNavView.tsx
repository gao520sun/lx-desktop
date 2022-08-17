import React from 'react'
import { ChevronLeftOutlined } from '@mui/icons-material'
import THEME from '@/pages/Config/Theme'
const iconStyle = {fontSize:35,color:'#fff',":hover":{color:THEME.theme}};
import { useModel } from '@umijs/max'
const BackNavView = () => {
  const {navigate} =  useModel('global')
    const onBackClick  = () => {
        navigate.pop()
    }
  return (
    <div onClick={onBackClick}><ChevronLeftOutlined sx={iconStyle}/></div>
  )
}

export default BackNavView