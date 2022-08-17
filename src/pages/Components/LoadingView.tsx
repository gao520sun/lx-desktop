import { LoadingOutlined, SyncOutlined } from '@ant-design/icons'
import React from 'react'
interface IProps {
  iconStyle?:object,
  textStyle?:object,
}
function LoadingView(props:IProps) {
  return (
    <div style={{display:'flex',flexDirection:'row',width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
        <LoadingOutlined style={{color:'#ff4757',...props.iconStyle|| {}}}/>
        <div style={{color:'#ffffff50',marginLeft:10,...props.textStyle|| {}}}>精彩内容马上呈现...</div>
    </div>
  )
}

export default LoadingView