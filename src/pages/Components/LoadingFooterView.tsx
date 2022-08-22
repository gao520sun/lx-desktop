import { LoadingOutlined, SyncOutlined } from '@ant-design/icons'
import React from 'react'
interface IProps {
    iconStyle?:object,
    textStyle?:object,
    isLoading:boolean,
    isMore?:boolean,
  }
const LoadingFooterView = (props:IProps) => {
  return (
    <div style={{display:'flex',flexShrink:0,flexDirection:'row',width:'100%',height:60,alignItems:'center',justifyContent:'center'}}>
        {!props.isLoading && !props.isMore ? null :<LoadingOutlined style={{color:'#ff4757',...props.iconStyle|| {}}}/>}
        {props.isLoading || props.isMore ? <div style={{fontSize:12,color:'#ffffff50',marginLeft:10,...props.textStyle|| {}}}>正在加载中...</div> : null}
        {!props.isLoading && !props.isMore ? <div style={{fontSize:12,color:'#ffffff50',marginLeft:10,...props.textStyle|| {}}}>全部加载完成</div> : null}
        
    </div>
  )
}

export default LoadingFooterView