import { FlexColumn, FlexRow } from '@/globalStyle'
import React, { useRef } from 'react'
import styled from 'styled-components'
import AudioView from './Views/AudioView'
import MicToolView from './Views/MicToolView'
import MicContentView from './Views/MicContentView'
const Con = styled(FlexRow)`
  width: 100%;
  height: 100%;
  position: relative;
`
const ConMic = styled(FlexRow)`
  width: 100%;
  height: 100%;
  padding-bottom: 70px;
`
function McList() {
  
  return (
    <Con>
      <ConMic>
        <MicToolView/>
        <MicContentView/>
      </ConMic>
      <AudioView/>
    </Con>
  )
}

export default McList