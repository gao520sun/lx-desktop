import { FlexColumn, FlexImage, FlexText, FlexRow, FlexWidth12, FlexHeight12, FlexHeight, Flex } from '@/globalStyle'
import { uuid } from '@/utils/format'
import { Button, Input, message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { createSongList, getSongList, saveHasSongList } from '../../MicModel/SongListModel'
const Con = styled(FlexColumn)`
 
`
const ModalDiv = styled(Modal)`
.ant-modal-content{
    background-color: transparent;
  }
`
const CellView = styled(FlexColumn)`
  max-height: 300px;
  flex-shrink: 0;
  overflow: scroll;
  margin-top: 12px;
  &::-webkit-scrollbar{
        width: 8px;
        background-color: transparent;
  };
  &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #a2a3a448;
  }
`
const CellItemView = styled(FlexRow)`
  :hover {
    background-color: #f0f0f0;
    cursor: pointer;
  }
`
const CreateSongListModalView = (props:any) => {
  const [isNewSong, setIsNewSong] = useState(props.isNewSong|| false)
  const [inputValue, setInputValue] = useState('');
  const [songList, setSongList] = useState([]);
  useEffect(() => {
    const list = getSongList();
    setSongList(list)
  },[props.showModal])
  const onNewSongOkClick = () => {
    const res = createSongList({name:inputValue,id:uuid()},props.saveData);
    if(res.status !=0){message.error(res.message);return};
    message.success('已添加至歌单中')
    typeof props.onCancel == 'function' && props.onCancel()
  }
  const onNewSongClick = () => {
    setIsNewSong(true)
  }
  // 加入已有的歌单
  const onSelectSongList = (item:any) => {
    console.log('item::',item,props.saveData)
    const res = saveHasSongList({name:item.info?.name},props.saveData || []);
    if(res.status !=0){message.error(res.message);return};
    message.success('已添加至歌单中');
    typeof props.onCancel == 'function' && props.onCancel()
  }
  const onCancel = () => {
    typeof props.onCancel == 'function' && props.onCancel()
  }
  return (
    <Con>
      <ModalDiv visible={props.showModal} onCancel={onCancel} maskStyle={{background:'transparent'}} footer={null} bodyStyle={{background:'#fff',padding:12,borderRadius:10}}>
        <FlexColumn>
          <FlexText color={'#333'}>添加到我的歌单</FlexText>
          {!isNewSong ? <CellView>
            <CellItemView style={{marginBottom:10}} onClick = {() => onNewSongClick()}>
              <FlexImage width={60} height={60} src={''}/>
              <FlexWidth12/>
              <FlexText numberOfLine={1} color={'#333'}>新建歌单</FlexText>
            </CellItemView>
           {songList.map((item:any) => {
            let pic = item.info?.coverImgUrl;
            if(item.list?.length  && !pic){
              pic =  item.list[0].album_pic
            }
            return(
              <CellItemView key={item.info?.name} style={{marginBottom:10}} onClick = {() => onSelectSongList(item)}>
                <FlexImage width={60} height={60} src={pic}/>
                <FlexWidth12/>
                <FlexColumn>
                  <FlexText numberOfLine={1} color={'#333'} fontSize={'14px'}>{item.info?.name}</FlexText>
                  <Flex/>
                  <FlexText numberOfLine={1} color={'#999'} fontSize={'12px'}>已添加（{item.list?.length}）个歌曲</FlexText>
                </FlexColumn>
              </CellItemView>
            )
           })}
          </CellView> : null}
          {isNewSong ? 
            <FlexColumn>
              <FlexHeight12/>
                <Input placeholder='请输入新歌单名称,15字以内' maxLength={15} value={inputValue} onChange={(e) =>setInputValue(e.target.value)}/>
                <FlexHeight12/>
                <FlexRow style={{justifyContent:'center'}}>
                  <Button onClick={() => props.isNewSong ? onCancel()  :setIsNewSong(false)} >取消</Button>
                  <FlexWidth12/>
                  <Button disabled={!inputValue.length} onClick={() => onNewSongOkClick()}>确定</Button>
                </FlexRow>
            </FlexColumn>:null}
        </FlexColumn>
      </ModalDiv>
    </Con>
  )
}

export default CreateSongListModalView