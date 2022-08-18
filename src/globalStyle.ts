import styled,{ createGlobalStyle } from 'styled-components'
import TextView from './pages/Components/TextView'

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
export const FlexImage = styled.img`
    width: ${(props) => props.width || '100%'};
    height: ${(props) => props.height || '100%'};
    border-radius: 5px;
`
export const FlexText =  styled(TextView)`
    color:#fff;
    font-size: 14px;
`
