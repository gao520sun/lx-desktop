import { FlexColumn, FlexImage, FlexText, FlexRow, FlexWidth12, FlexHeight12, FlexHeight, Flex } from '@/globalStyle'
import { Button, Input, message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { createSongList, getSongList, saveHasSongList } from '../../MicModel/SongListModel'
import Linq from 'linq'
import { setStoreItem } from '@/utils/Storage'
const Con = styled(FlexColumn)`
 
`
const ModalDiv = styled(Modal)`
.ant-modal-content{
    background-color: transparent;
  }
`
const EditSongListModalView = (props:any) => {
  const [isNewSong, setIsNewSong] = useState(props.isNewSong|| false)
  const [inputValue, setInputValue] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [description, setDescription] = useState('');
  const [songList, setSongList] = useState([]);
  useEffect(() => {
    const list = getSongList();
    setSongList(list)
    const sl = props.songInfo
    setInputValue(sl.name)
    setCoverUrl(sl.coverImgUrl)
    setName(sl.nickname)
    setAvatarUrl(sl.avatarUrl)
    setDescription(sl.description)
  },[props.showModal])
  const onEditSongOkClick = () => {
    let sList = [...songList];
    console.log('sList::',sList)
    const dic:any = Linq.from(sList).firstOrDefault((x:any) => x.info.id == props.songInfo.id)
    dic.info.name = inputValue;
    dic.info.coverImgUrl = coverUrl;
    dic.info.nickname = name;
    dic.info.avatarUrl = avatarUrl;
    dic.info.description = description;
    setStoreItem(window.STORE_TYPE.micSongList,sList)
    window.PubSub.publishSync(window.MIC_TYPE.createSongList)
    typeof props.onCancel == 'function' && props.onCancel()
  }
  const onCancel = () => {
    typeof props.onCancel == 'function' && props.onCancel()
  }
  return (
    <Con>
      <ModalDiv visible={props.showModal} onCancel={onCancel} maskStyle={{background:'transparent'}} footer={null} bodyStyle={{background:'#fff',padding:12,borderRadius:10}}>
        <FlexColumn>
          <FlexText color={'#333'}>??????????????????</FlexText>
          <FlexColumn style={{padding:12}}>
              <FlexHeight12/>
                <FlexRow style={{alignItems:'center'}}>
                    <FlexText color={'#333'} style={{width:60}}>??????</FlexText>
                    <Input placeholder='????????????????????????,15?????????' maxLength={15} value={inputValue} onChange={(e) =>setInputValue(e.target.value)}/>
                </FlexRow>
                <FlexHeight12/>
                    <FlexRow style={{alignItems:'center'}}>
                        <FlexText color={'#333'} style={{width:60}}>??????URL</FlexText>
                        <Input placeholder='???????????????URL'  value={coverUrl} onChange={(e) =>setCoverUrl(e.target.value)}/>
                    </FlexRow>
                <FlexHeight12/>
                    <FlexRow style={{alignItems:'center'}}>
                        <FlexText color={'#333'} style={{width:60}}>??????</FlexText>
                        <Input placeholder='???????????????'  value={name} onChange={(e) =>setName(e.target.value)}/>
                    </FlexRow>
                <FlexHeight12/>
                <FlexRow style={{alignItems:'center'}}>
                    <FlexText color={'#333'} style={{width:60}}>??????URL</FlexText>
                    <Input placeholder='???????????????URL'  value={avatarUrl} onChange={(e) =>setAvatarUrl(e.target.value)}/>
                </FlexRow>
                <FlexHeight12/>
                <FlexRow style={{alignItems:'center'}}>
                    <FlexText color={'#333'} style={{width:60}}>??????</FlexText>
                    <Input.TextArea placeholder='???????????????URL' style={{minHeight:120}}  value={description} onChange={(e) =>setDescription(e.target.value)}/>
                </FlexRow>
                <FlexHeight12/>
                <FlexRow style={{justifyContent:'center'}}>
                  <Button onClick={() => onCancel()} >??????</Button>
                  <FlexWidth12/>
                  <Button disabled={!inputValue} onClick={() => onEditSongOkClick()}>??????</Button>
                </FlexRow>
            </FlexColumn>
        </FlexColumn>
      </ModalDiv>
    </Con>
  )
}

export default EditSongListModalView