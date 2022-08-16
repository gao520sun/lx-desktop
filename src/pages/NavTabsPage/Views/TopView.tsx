import { Row } from 'antd'
import React from 'react'
import styled from 'styled-components'
const Con = styled.div`
    display: flex;
    height: 44px;
    margin-bottom: 10px;
    -webkit-app-region: drag;
`
function TopView(props:any) {
  const onClick = (type:string) => {
    typeof props.onClick == 'function' && props.onClick(type)
  }
  return (
    <Con style={{width:props.width}}>
    </Con>
  )
}

export default TopView