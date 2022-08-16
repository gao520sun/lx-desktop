import { FlexColumn, FlexRow } from '@/globalStyle'
import THEME from '@/pages/Config/Theme'
import { vodSearchMoreList } from '@/services/video';
import { useRequest } from '@umijs/max';
import { useThrottleFn } from 'ahooks';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import ListCell from './Views/ListCell';
import {dataType, initSelectData} from './VodModal';
const Con = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 60px;
  overflow-y: scroll;
  background-color: #141516;
  &::-webkit-scrollbar{
    background-color: transparent;
  };
  &::-webkit-scrollbar-thumb {
        border: 5px solid #000;
        border-radius: 20px;
        background-color: #595A5B;
  }
`
const TypeView = styled.div`
    color:#fff;
    font-size: 12px;
    flex-shrink: 0;
    margin-right: 20px;
    line-height: 2.5;
    cursor: pointer;
    &.active_color {
        color:${THEME.theme};
    }
`
const TypeContentView = styled(FlexRow)`
    flex-wrap: wrap;
    color:#fff;
    font-size: 12px;
    margin-bottom: 10px;
    .item_un{
        margin-right: 12px;
        line-height: 2.5;
        cursor: pointer;
    }
    .active_color {
        line-height: 2.5;
        margin-right: 12px;
        color:${THEME.theme};
    }
`
const ContentView = styled(FlexRow)`
    flex-wrap: wrap;
    margin-left: 20px;
`
let lastScrollTop = 0
let isDownLoading = false;
const leftWidth = 110;
const maxWidth = 210;
const VodMore = (props:any={}) => {
    const item = props.item || {};
    const dataTypes = dataType(item.type);
    const [currentTypes,setCurrentTypes] = useState<any>(initSelectData)
    // 上拉刷新
    const [isLoadingMore, setIsLoadingMore] = useState(true);
    const [list, setList] = useState([]);
    const {run, loading} = useRequest(vodSearchMoreList,{
        manual:true,
        defaultParams:[{}],
        onSuccess:(res) => {
            setList(res.list)
            resize()
        }
    })
    
    useEffect(() => {
        run({type_id: props.item.type,limit:50});
        const doc = document.getElementById('vodList');
        // doc?.addEventListener('scroll',onScrollEvent);
        // 监听窗口变化
        window?.ipc?.renderer?.on('win:resized',(data:any) => {
            resize()
        })
        return ()  => {
          doc?.removeEventListener('scroll',()=>{})
        }
    },[])
    const resize = () =>{
        const dom = document.getElementById('contentName');
        if(dom){
            let clientWidth:any = dom.clientWidth;
            let itemWidth = clientWidth / Math.ceil(clientWidth / maxWidth);
            let items = document.getElementsByClassName('itemName');
            let urlImg = document.getElementsByClassName('urlImg');
            if(items){
                for(let i = 0, len = items.length; i < len; i++) {
                    items[i].style.width = (itemWidth - 14) + 'px';
                    urlImg[i].style.height = ((itemWidth - 14)/3 * 4) + 'px';
                }
            }
        }
        
      }
    const s  = useThrottleFn(() => {

    },{})
    const onScrollEvent = (e:any) => {
        const loadHeight = 35;
        let scrollTop = 0,scrollHeight=0,clientHeight=0
        // scrollTop = (e.srcElement ? e.srcElement?.documentElement?.scrollTop : false)|| window.pageYOffset|| (e.srcElement ? e.srcElement?.body?.scrollTop : 0);
        // scrollHeight = e.srcElement?.documentElement?.scrollHeight;
        // clientHeight = e.srcElement?.documentElement?.clientHeight;
        scrollTop = e.target?.scrollTop;
        scrollHeight = e.target?.scrollHeight;
        clientHeight = e.target?.clientHeight;
        console.log('scrollTop..',scrollTop,scrollHeight,clientHeight)
        if(scrollTop + clientHeight > scrollHeight - loadHeight){
            console.log('more')
            // 这里需要判断 到底了 调用接口
            // const pullDown = scrollTop - lastScrollTop > 0;
            // if (pullDown && !isDownLoading && isLoadingMore) {
            //   isDownLoading = true;
            //   console.log('more');
            // //   loadMoreData();
            // }
          }
        //   lastScrollTop = scrollTop
    }
    // 选项
    const onItemClick = (item:any,index:number) => {
        let cuType = [...currentTypes];
        cuType[index] = item;
        setCurrentTypes(cuType)
    }
    const XxTypeView = () => {
        return (
            <FlexColumn style={{margin:20}}>
                {dataTypes.map((item,index) => {
                    return (
                        <FlexRow key={item.title}>
                            <TypeView className={currentTypes.indexOf(item.title) != -1 ? 'active_color':''} onClick={() =>onItemClick(item.title,index)}>{item.title}</TypeView>
                            <TypeContentView>
                                {item.data.map(cItem => {
                                    return <div className={currentTypes.indexOf(cItem) != -1 ? 'active_color':'item_un'} key={cItem} onClick={() =>onItemClick(cItem,index)}>{cItem}</div>
                                })}
                            </TypeContentView>
                        </FlexRow>
                    )
                })}
            </FlexColumn>
        )
    }
    return (
        <Con id={'vodList'}>
            {XxTypeView()}
            <ContentView className='contentName' id={'contentName'}>
                {list.map((item:any, index:number) => {
                    return <FlexColumn className='itemName' style={{marginRight:14,marginBottom:10}} key={item.vod_id}>
                                <ListCell value={item}/>
                            </FlexColumn>
                })}
            </ContentView>
        </Con>
    )
}

export default VodMore