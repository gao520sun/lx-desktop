import React, { useEffect, useRef, useState } from 'react'
import Routes from './Routes';
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import TransitionGroup from 'react-transition-group/TransitionGroup';
import './index.css'
import _, { random } from 'lodash';
import { useModel } from '@umijs/max';
import PubSub from 'pubsub-js'
const Navigation = () => {
    const {setMicNavigate} =  useModel('global')
    let [children,setChildren] = useState<any>([]);
    let childrenRef:any = useRef(null);
    const [navigate] = useState({
        pop:()=>nPop(),
        popToTop:()=>nPopToTop(),
        push:(name:string,params:object)=>nPush(name,params),
        count:() => childrenRef.current.length,
        routes:() => childrenRef.current,
    })
    const nPop = () => {
        let p = [...childrenRef.current];
        p.pop();
        setChildren(p);
        childrenRef.current = p;
        PubSub.publishSync('micNav:pop');
    }
    const nPopToTop = () => {
        let p:any = [...childrenRef.current];
        const page =_.cloneDeep(p[0])
        childrenRef.current = [page];
        setChildren([page]);
        PubSub.publishSync('micNav:pop');
    }
    const nPush = (name:string,params:object) => {
        const page:any = _.cloneDeep(_.find(Routes,(item:any) => item.name == name));
        if(page){
            let p = [...childrenRef.current];
            page.params =  {...params}
            page.key=getRandom();
            p.push(page)
            setChildren(p);
            childrenRef.current = p;
            PubSub.publishSync('micNav:push');
        }
    }
    useEffect(() => {
        let p:any = Routes[0];
        p.key=getRandom()
        setChildren([p]);
        childrenRef.current = [p];
        setMicNavigate(navigate)
    },[])
    const getRandom = () => {
        return 'key:' + (childrenRef.current ? childrenRef.current.length + 1 : 0)
    }
  return (
    <div style={{display:'flex',position:'relative',height:'100%',width:'100%'}}>
        <TransitionGroup>
            {children.map((item:any, index:number)=>{
              const ComponentPage = item.component;
                return (
                    <CSSTransition key={item.key} classNames="movieLeft" timeout={1000}  >
                        {/* TODO 底色的背景需要更改，先记录 */}
                        <div key={item.key} style={{position:'absolute',background:'#fff',left:0,right:0,height:'100%',width:'100%',overflow:'hidden'}}>
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