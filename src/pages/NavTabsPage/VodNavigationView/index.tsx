import React, { useEffect, useRef, useState } from 'react'
import Routes from './Routes';
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import TransitionGroup from 'react-transition-group/TransitionGroup';
import './index.css'
import _ from 'lodash';
import { useModel } from '@umijs/max';
import PubSub from 'pubsub-js'
const Navigation = () => {
    const {setNavigate} =  useModel('global')
    let [children,setChildren] = useState<any>([]);
    let childrenRef:any = useRef(null);
    const [navigate] = useState({
        pop:()=>nPop(),
        push:(name:string,params:object)=>nPush(name,params),
        count:() => childrenRef.current.length,
        routes:() => childrenRef.current,
    })
    const nPop = () => {
        let p = [...childrenRef.current];
        p.pop();
        setChildren(p);
        childrenRef.current = p;
        PubSub.publishSync('nav:pop');
    }
    const nPush = (name:string,params:object) => {
        const page = _.find(Routes,(item:any) => item.name == name);
        if(page){
            let p = [...childrenRef.current];
            page.params =  {...params}
            p.push(page)
            setChildren(p);
            childrenRef.current = p;
            PubSub.publishSync('nav:push');
        }
    }
    useEffect(() => {
        let p = Routes[0];
        setChildren([p]);
        childrenRef.current = [p];
        setNavigate(navigate)
    },[])
  return (
    <div style={{display:'flex',position:'relative',height:'100%',width:'100%'}}>
        <TransitionGroup>
            {children.map((item:any, index:number)=>{
              const ComponentPage = item.component;
                return (
                    <CSSTransition key={item.name} classNames="movieLeft" timeout={1000}  >
                        {/* TODO 底色的背景需要更改，先记录 */}
                        <div key={item.name} style={{position:'absolute',left:0,right:0,height:'100%',width:'100%',overflow:'hidden'}}>
                            <ComponentPage navigate={navigate} params={item.params}/>
                        </div>
                    </CSSTransition>
            )
        })}
        </TransitionGroup>
    </div>
  )
}

export default Navigation