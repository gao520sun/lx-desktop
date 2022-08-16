import { Col } from 'antd'
import React, { useCallback, useEffect } from 'react'
import HeightStyleView from './HeightStyleView'
import TitleView from './TitleView'
import styles from './ListStyles.less'
import styled from 'styled-components';
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
const NextView:any = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 40px;
  bottom: 0;
  width: 80px;
  font-size:28px;
  color:#ffffff;
  background:linear-gradient(90deg,#00000010,#00000020,#00000060);
  :hover {
    display: flex;
    color:#ff4757;
  }
`;
const LeftView = styled(NextView)`
  left:0;
`;
const RightView = styled(NextView)`
  right:0;
`;

const Con = styled.div`
    display: flex;
    position: relative;
    flex-direction: row;
    overflow-x: scroll;
    padding: 0px 20px;
    &::-webkit-scrollbar {
        display: none;
    };
    /* TODO 重点 ~ ， 以后需要理解 & ~ & &+& 等*/
    &:hover ~ ${LeftView} {
      display: flex;
    };
    &:hover ~ ${RightView} {
      display: flex;
    };
`;

interface IProps {
  type?:number,
  title?:string,
  data?:any,
}
function ListItemCell(props:{value:IProps}) {
  const onVodItem = useCallback((item:any) => {
    window.ipc.renderer.send('vod:detail',item)
  },[])
  const onVodMoreTypeItem = useCallback((item:any) => {
    window.ipc.renderer.send('vod:more',item)
  },[])
  const onSide = useCallback((type:string) => {
    let conDom:any = document.getElementById('con'+props.value.type) || {};
    if(type == 'left'){
      const oLeft = conDom.scrollLeft - conDom.offsetWidth;
      conDom.scrollLeft =  oLeft < 0 ? 0 : oLeft
    }else if(type == 'right'){
      const oRight = conDom.scrollLeft + conDom.offsetWidth;;
      conDom.scrollLeft = oRight;
    }
  },[])
  return (
    <Col style={{marginTop:10,position:'relative'}}>
      <TitleView value={props.value}/>
      <Con id={'con'+props.value.type}>
        {props.value.data.map((item:any, index:any) => {
          return <div key={index} style={{marginRight:16}} onClick={() => onVodItem(item)}><HeightStyleView value={item}/></div>
        })}
      </Con>
      <LeftView onClick={() => {onSide('left')}}>
        <LeftOutlined />
      </LeftView>
      <RightView onClick={() => {onSide('right')}}>
        <RightOutlined />
      </RightView>
      
    </Col>
  )
}

export default ListItemCell