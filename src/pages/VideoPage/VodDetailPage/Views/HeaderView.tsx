import CloseMinMaxView from '@/pages/Components/CloseMinMaxView';
import TextView from '@/pages/Components/TextView';
import { HomeOutlined } from '@ant-design/icons';
import { Row } from 'antd';
import React from 'react'
import styled from 'styled-components';
const Con = styled.div`
  display: flex;
  flex-direction: row;
  height: 58px;
  background-color: #2B2D31;
  align-items: center;
  padding: 0 24px 0 24px;
  -webkit-app-region: drag;
`
const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
`
const HeaderView = (props:any) => {
  return (
    <div>
      <Con>
          <Row style={{color:'#fff',marginLeft:70}}>
            <HomeOutlined style={{fontSize:20,marginRight:10}}/>
            <TextView>打开主界面</TextView>
          </Row>
          <TextView style={{color:'#fff',maxWidth:'60%', position:'absolute', left:'50%'}}>{props.value.vod_name}</TextView>
      </Con>
    </div>
  )
}

export default HeaderView