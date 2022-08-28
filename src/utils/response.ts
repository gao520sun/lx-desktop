

export const responseSuccess = (data:any) => {
    return {status:200,data:{status:0,message:'',data},message:''} 
}
export const responseError = (msg:string,data:any=null) => {
    return {status:200,data:{status:-1,message:msg,data},message:''}
}