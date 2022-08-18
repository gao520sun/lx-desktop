import React, { ReactElement } from 'react'
interface IProps {
  msg?:string | ReactElement,
  textStyle?:object
}
function ErrorView(props:IProps) {
  return (
    <div className='con_center'>
        <div style={{color:'#ffffff50',marginLeft:10,...props.textStyle}}>{props.msg || '数据发生错误,点击重试'}</div>
    </div>
  )
}

export default ErrorView