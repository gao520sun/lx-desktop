import React from 'react';
interface IProps {
  fontSize?:number,
  color?:string,
  numberOfLine?:number,
  className?:any,
  style?:object,
  children?:any
}
function TextView(props:IProps) {
      const fontSize = props.fontSize;
      const color = props.color;
      let {numberOfLine} = props;
      numberOfLine = numberOfLine || 0;
      return (
        <div className={props.className} style={{position: 'relative', display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-all', WebkitLineClamp: numberOfLine, fontSize,color,...props.style}}>{props.children}</div>
      )
}

export default TextView