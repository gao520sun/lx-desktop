import { FlexColumn, FlexRow } from '@/globalStyle'
import React, { useRef } from 'react'
import styled from 'styled-components'
import AudioView from './Views/AudioView'
import MicToolView from './Views/MicToolView'
import MicContentView from './Views/MicContentView'
import { useModel } from '@umijs/max'
const Con = styled(FlexRow)`
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 60px;
`
const ConMic = styled(FlexRow)`
  width: 100%;
  height: 100%;
  padding-bottom: 70px;
`
function McList(props:any) {
  return (
    <Con>
      <ConMic>
        <MicContentView navigate={props.navigate}/>
      </ConMic>
      <AudioView/>
    </Con>
  )
}

export default McList