import { Row } from 'antd';
import React, { useCallback } from 'react'
import styled from 'styled-components';
const RowCon = styled(Row)`
    
`
const CmmDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
    border-radius: 12px;
`
const CloseDiv = styled(CmmDiv)`
    background-color: #F65B58;
    margin-right: 10px;
`
const MinDiv = styled(CmmDiv)`
    background-color: #F9C42D;
    margin-right: 10px;
`
const MaxDiv = styled(CmmDiv)`
    background-color: #3DC93E;

`
const CloseMinMaxView = () => {
    const onClick = useCallback((type:string) => {
        let msg:string = 'window-'+type;
        window?.ipc?.renderer?.send(msg,'detail')
    },[])
  return (
    <Row>
        <CloseDiv onClick={() => onClick('close')}>x</CloseDiv>
        <MinDiv onClick={() => onClick('min')}>-</MinDiv>
        <MaxDiv onClick={() => onClick('max')}>+</MaxDiv>
    </Row>
  )
}

export default CloseMinMaxView