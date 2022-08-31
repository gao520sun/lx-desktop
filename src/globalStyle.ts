import { Image } from 'antd'
import styled,{ createGlobalStyle } from 'styled-components'
import TextView from './pages/Components/TextView'
import i01 from '@/assets/01.png';
export const GlobalStyle = createGlobalStyle`
    flexRow {
        display: flex;
        flex-direction: row;
    }
    flexColumn {
        display: flex;
        flex-direction: column;
    }
    flexCenter{
       display: flex;
       justify-content: center;
       align-items: center;
    }
`
export const Flex = styled.div`
    display: flex;
    flex:1;
    /* overflow: hidden; */
`
export const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    /* overflow: hidden; */
`
export const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    /* overflow: hidden; */
`
export const FlexCenter = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    /* overflow: hidden; */
`
export const FlexImage = styled(Image).attrs({
    preview:false,
    fallback:i01
})`
    width: ${(props) => props.width || '100%'};
    height: ${(props) => props.height || '100%'};
    border-radius: 5px;
`
export const FlexText:any =  styled(TextView)`
    color:${(props) => props.color || '#fff'};
    font-size: ${(props) => props.fontSize || '14px'};
`

export const FlexConScroll = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  /* overflow-y: overlay; */
  background-color: #fff;
  &::-webkit-scrollbar{
        width: 8px;
        background-color: transparent;
  };
  &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #a2a3a448;
  }
`

export const FlexWidth:any = styled.div`
    flex-shrink: 0;
    width: ${(props:any) => props.width || '10px'};
`
export const FlexHeight:any = styled.div`
    flex-shrink: 0;
    height: ${(props:any) => props.height || '10px'};
`
export const FlexWidth10 = styled(FlexWidth)``

export const FlexWidth12 = styled(FlexWidth)`
    width: ${(props:any) => props.width || '12px'};
`
export const FlexHeight10 = styled(FlexHeight)``

export const FlexHeight12 = styled(FlexHeight)`
    height: ${(props:any) => props.height || '12px'};
`
