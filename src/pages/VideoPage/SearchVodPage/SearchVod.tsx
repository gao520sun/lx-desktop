import React, { useEffect, useMemo, useState } from 'react'
import PubSub from 'pubsub-js'
import { useRequest } from '@umijs/max'
import { vodSearchList } from '@/services/video'
import LoadingView from '@/pages/Components/LoadingView'
import styled from 'styled-components'
import { useModel } from '@umijs/max'
import { FlexCenter, FlexColumn, FlexImage, FlexRow } from '@/globalStyle'
import TextView from '@/pages/Components/TextView'
import { httpImgUrl } from '@/utils/VodUrl'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { Pagination } from 'antd'
import THEME from '@/pages/Config/Theme'
const Con = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 60px;
  background-color: #141516;
  overflow-y: scroll;
  &::-webkit-scrollbar{
    background-color: transparent;
  };
  &::-webkit-scrollbar-thumb {
        border: 5px solid #000;
        border-radius: 20px;
        background-color: #595A5B;
  }
`
const TypeDiv = styled.div`
  padding: 3px 6px;
  background-color: ${(props:any) => props.bgColor || '#eaedf1'};
  color:#333;
  border-radius: 8px;
  margin-right: 10px;
  margin-top: 10px;
`
const CellBg = styled(FlexRow)`
  height:100%;
  margin-bottom:10px;
  color:#fff;
  background:#1A1C1C;
  padding:12px;
  border-radius: 5px;
  position: relative;
`
const PlayBtn = styled(FlexCenter)`
  margin-top: 10px;
  color:#fff;
  width:120px;
  height:35px;
  border-radius:50px;
  background: linear-gradient(90deg, #ff9800, #ff2a14);
  cursor: pointer;
  
`
const JsAbsView = styled(FlexCenter)`
  position: absolute;
  top:0;
  right:0;
  padding: 4px 12px;
  background: #eaedf1;
  border-radius: 0 10px 0 10px;
  color:#1A1C1C;
  font-size:12px;
`
const PaView = styled(FlexRow)`
  flex-shrink:0;
  color:#fff;
  justify-content:flex-end;
  margin-top: 10px;
  margin-bottom: 24px;
  .ant-pagination-item a{
    color: #fff
  }
  .ant-pagination-item-active{
    background: transparent;
    border-color:#ff4757;
  }
  .ant-pagination-item-active a{
    color:#ff4757;
    
  }
  .anticon {
    color:#fff
  }
  .ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-ellipsis{
    color:#fff
  }
  .ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-ellipsis{
    color:#fff
  }
  .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-ellipsis{
    color:#fff
  }
  .ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-link-icon{
    color:#ff4757;
  }
  .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-link-icon{
    color:#ff4757;
  }
  
`
const typeDic:any = {1:'电影',2:'电视剧',3:'综艺',4:'动漫'}
const SearchVod = () => {
  const [searchValue, setSearchValue] = useState('')
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const {run, loading} = useRequest(vodSearchList,{
    manual:true,
    defaultParams:[{types:'all'}],
    onSuccess:(res) => {
      setList(res.list)
      setTotal(res.total)
    }
  })
  useEffect(() => {
    let token:any = PubSub.subscribe('input:value',(msg,data) => {
      if(!data){return}
      setSearchValue(data)
      run({title:data})
    })
    return () => {
      PubSub.unsubscribe(token)
    }
  },[list,searchValue])
  const onPalyClick = (item:any) => {
    window.ipc.renderer.send('vod:detail',item)
  }
  // 切换页数
  const onPaginationChange = (page:number) => {
    setCurrent(page)
    run({title:searchValue,offset:(current - 1) * 10})
  }
  const renderCell = (item:any) => {
      return (
        <CellBg key={item.vod_id}>
          <FlexRow>
            <FlexImage width={150} height={210} src={httpImgUrl(item.vod_pic)}/>
          </FlexRow>
          <FlexColumn style={{marginLeft:24}}>
              <TextView style={{fontSize:18}}>{item.vod_name}</TextView>
              <FlexRow>
                  <TypeDiv bgColor={'#fef0e5'}>{typeDic[item.type_id]}</TypeDiv>
                  <TypeDiv>{item.vod_year}</TypeDiv>
                  <TypeDiv>{item.vod_area}</TypeDiv>
              </FlexRow>
              <FlexRow style={{marginTop:10,color:'#888888'}}>
                <div style={{flexShrink:0,fontWeight:'bold'}}>导演：</div>
                <TextView numberOfLine={1}>{item.vod_director.replace(',',' / ')}</TextView>
              </FlexRow>
              <FlexRow style={{marginTop:6,color:'#888888'}}>
                <div style={{flexShrink:0,fontWeight:'bold'}}>主演：</div>
                <TextView numberOfLine={1}>{item.vod_actor.replace(',',' / ')}</TextView>
              </FlexRow>
              <FlexRow style={{marginTop:6,color:'#888888'}}>
                <div style={{flexShrink:0,fontWeight:'bold'}}>剧情：</div>
                <TextView numberOfLine={1}>{item.vod_content}</TextView>
              </FlexRow>
              <div style={{flex:1}}/>
              <PlayBtn onClick={() => onPalyClick(item)}>
                  <PlayArrowRoundedIcon sx={{fontSize:20}}/>
                  <div>立即播放</div>
              </PlayBtn>
          </FlexColumn>
          <JsAbsView>{item.vod_remarks}</JsAbsView>
        </CellBg>
      )
    }
  return (
    <Con>
      <FlexCenter style={{color:'#fff',flexShrink:0,height:200,flexDirection:'column'}}>
        <span style={{fontSize:30,fontWeight:'bold'}}>{searchValue}</span>
        <FlexRow>搜索{searchValue}，找到<div style={{color:THEME.theme}}>{total}</div>个影视作品</FlexRow>
      </FlexCenter>
      {!loading ? <FlexColumn style={{width:'100%',padding:'0 12px'}}>
        {list.map((item) =>  {
          return renderCell(item)
        })}
      </FlexColumn> : <LoadingView/>}
      <PaView>
        <Pagination size='small' current={current} pageSize={10} hideOnSinglePage={true} showSizeChanger={false} total={total} style={{padding:12}} onChange={onPaginationChange}/>
      </PaView>
    </Con> 
  )
}

export default SearchVod