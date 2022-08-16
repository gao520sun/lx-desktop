import { Carousel } from 'antd'
import React, { useEffect, useState } from 'react'
import SwipeableViews from 'react-swipeable-views';
import { autoPlay, virtualize, bindKeyboard } from 'react-swipeable-views-utils';
const content = [1,2,3]
// autoPlay
const EnhancedSwipeableViews = bindKeyboard((virtualize(SwipeableViews)));
const contentStyle: React.CSSProperties = {
    color: '#fff',
    textAlign: 'center',
    background: '#364d79',
  };
function CarouselView() {
    const [height, setHeight] = useState(((1200 - 110) / 16) * 9)
    const [width, setWidth] = useState((1200 - 110))
    useEffect(() => {
        window?.ipc?.renderer?.on('win:resized',(data:any) => {
            console.log(data)
        })
    },[])
    const swipeLeftContentView = (params:any) => {
        const { index, key } = params;
        const value = content[index] || {}
        console.log('22222')
        return (
            <div key={key}>
                <img style={{width:width,height:height/2}} src={'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp08%2F39042223172520.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662561613&t=9274a815bd89aba969ef56ba10f59321'}/>
            </div>
        )
    }
  return (
    <div style={{}}>
        <EnhancedSwipeableViews containerStyle={{height:height/2}} autoPlay={false} axis={'x'} resistance enableMouseEvents slideCount={content.length} 
        slideRenderer={swipeLeftContentView} />
    </div>
  )
}

export default CarouselView