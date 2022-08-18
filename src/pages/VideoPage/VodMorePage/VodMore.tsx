import { FlexColumn, FlexRow } from '@/globalStyle'
import ErrorView from '@/pages/Components/ErrorView';
import LoadingFooterView from '@/pages/Components/LoadingFooterView';
import LoadingView from '@/pages/Components/LoadingView';
import THEME from '@/pages/Config/Theme'
import { vodSearchMoreList } from '@/services/video';
import { useRequest } from '@umijs/max';
import { useDebounceFn, useThrottleFn } from 'ahooks';
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import ListCell from './Views/ListCell';
import {dataType, initSelectData} from './VodModal';
const Con = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 60px;
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
let isDownLoading = false;
let hasMore = true;
const maxWidth = 210;
const limit = 50
const VodMore = (props:any={}) => {
    const item = props.params || {};
    const dataTypes = dataType(item.type);
    const [currentTypes,setCurrentTypes] = useState<any>(initSelectData)
    const [list, setList] = useState([]);
    const {run, loading} = useRequest(vodSearchMoreList,{
        manual:true,
        defaultParams:[{}],
        onSuccess:(res:any,params:any) => {
            const par = params[0]
            let oldList:any = par.offset == 0 ? [] : [...list];
            const newList:any = oldList.concat(res.list||[]);
            hasMore = res.list.length >= limit ? true : false;
            isDownLoading = false;
            setList(newList);
            setTimeout(() => {
                resize()
            }, 0);
        }
    })
    
    useEffect(() => {
         isDownLoading = false;
         hasMore = true;
        run({type_id: item.type,limit:limit,offset:0,...currentTypeHandle(currentTypes)});
        // 上下滑动
        const doc = document.getElementById('vodList');
        doc?.addEventListener('scroll',onScrollEvent);
        // 监听窗口变化
        window?.ipc?.renderer?.on(window.WIN_TYPE.resized,(data:any) => {
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
    // 节流上拉加载
    const onScrollEvent = (e:any) => {
        console.log('hasMore::',isDownLoading)
        const loadHeight = 65;
        let scrollTop = 0,scrollHeight=0,clientHeight=0
        scrollTop = e.target?.scrollTop;
        scrollHeight = e.target?.scrollHeight;
        clientHeight = e.target?.clientHeight;
        if(scrollTop + clientHeight > scrollHeight - loadHeight){
            if(!isDownLoading && hasMore){
                isDownLoading = true
                scrollThrottle.run();
            }
          }
    }
    const scrollThrottle = useThrottleFn(() => {
        onLoadMore();
    },{wait:500})
    // 加载更多
    const onLoadMore = useCallback(() => {
        run({type_id: item.type,limit:limit,offset:list.length,...currentTypeHandle(currentTypes)});
    },[list])
    // 防抖刷选
    const debounceFn  = useDebounceFn((cuType) => {
        const params  =  {type_id: item.type,limit:limit,offset:0,...currentTypeHandle(cuType)}
        run(params);
    },{wait:100})
    // 
    const currentTypeHandle = (cuType:any) => {
        const vod_class = cuType[0] == '全部剧情' ? '' : cuType[0];
        const  vod_area = cuType[1] == '全部地区' ? '' : cuType[1];
        const vod_lang = cuType[2] == '全部语言' ? '' : cuType[2];
        const vod_year = cuType[3] == '全部时间' ? '' : cuType[3];
        return {vod_area,vod_class,vod_lang,vod_year}
    }
    // 选项
    const onItemClick = (item:any,index:number) => {
        let cuType = [...currentTypes];
        cuType[index] = item;
        setCurrentTypes(cuType);
        hasMore = true;
        isDownLoading = false
        debounceFn.run(cuType)
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
                {!loading || list.length ? list.map((item:any, index:number) => {
                    return <FlexColumn className='itemName' style={{marginRight:14,marginBottom:10}} key={item.vod_id}>
                                <ListCell value={item}/>
                            </FlexColumn>
                }):<LoadingView/>}
                {!loading || list.length ? <LoadingFooterView isMore={hasMore} isLoading={isDownLoading}/> : null}
                {!loading && !list.length ? <ErrorView msg='暂无数据, 请选择其他类型'/>:null}
            </ContentView>
        </Con>
    )
}

export default VodMore