// 示例方法，没有实际意义
export function trim(str: string) {
  return str.trim();
}

export const numberPlayCountFormat = (value:number,fixed=2)=> {
  let param:any = {};
  let k = 10000,
      sizes = ['', '万', '亿', '万亿'],
      i;
      if(value < k){
          param.value =value
          param.unit=''
      }else{
          i = Math.floor(Math.log(value) / Math.log(k)); 
          param.value = ((value / Math.pow(k, i))).toFixed(fixed);
          param.unit = sizes[i];
      }
  return param;
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}