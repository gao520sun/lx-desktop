import { FlexColumn, FlexRow } from '@/globalStyle'
import React from 'react'
import styled from 'styled-components'
const Con = styled(FlexColumn)`
  width: 180px;
  height: 100%;
  flex-shrink: 0;
`
const MicToolView = () => {
  return (
    <Con>MicToolView</Con>
  )
}

export default MicToolView