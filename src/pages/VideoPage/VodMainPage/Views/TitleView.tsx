import { RightOutlined } from '@ant-design/icons'
import { useDebounceFn } from 'ahooks';
import { Row } from 'antd'
import React from 'react'
import styled from 'styled-components';
import PubSub from 'pubsub-js'
import { Link } from '@umijs/max';
import { Outlet } from '@umijs/max';
import { useModel } from '@umijs/max';

function TitleView(props:any) {
  const {title} = props.value;
  const {navigate} =  useModel('global')
  const dnFn =  useDebounceFn((item:any) => {
    navigate.push('vodMore',item)
  },{wait:100})
  const onMoreClick = (item:any) => {
    dnFn.run(item)
  }
  return (
    <Row style={{justifyContent:'space-between',padding:'12px 20px'}} onClick={() => onMoreClick(props.value)}>
      <div style={{color:'#fff',fontSize:18}}>{title}</div>
      <div style={{color:'#999',fontSize:14,cursor:'pointer'}}>更多{title}<RightOutlined/></div>
      <Outlet/>
    </Row>
  )
}

export default TitleView