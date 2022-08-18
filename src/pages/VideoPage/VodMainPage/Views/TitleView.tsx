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
  const {title, type} = props.value;
  const {navigate} =  useModel('global')
  const dnFn =  useDebounceFn((item:any) => {
    navigate.push('vodMore',item)
  },{wait:100})
  const onMoreClick = (item:any) => {
    dnFn.run(item)
  }
  return (
    <Row style={{justifyContent:'space-between',padding:'12px 20px'}}>
      <div style={{color:'#fff',fontSize:20}}>{title}</div>
      {type != 'like' ? <div style={{color:'#999',fontSize:14,cursor:'pointer'}}  onClick={() => onMoreClick(props.value)}>更多{title}<RightOutlined/></div> : null}
      <Outlet/>
    </Row>
  )
}

export default TitleView