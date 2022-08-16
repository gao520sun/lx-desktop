import { request } from "@umijs/max"
const host = 'http://localhost:40001'
export const getVodList = async (params={}) => {
    return request(host+'/video/vod/list',{method:'POST',data:params})
}
export const getVodDetailById = async (params={}) => {
    return request(host+'/video/query/vod',{method:'POST',data:params})
}

export const vodSearchList = async (params={}) => {
    return request(host+'/video/vod/search/list',{method:'POST',data:params})
}
export const vodSearchMoreList = async (params={}) => {
    console.log('params::',params)
    return request(host+'/video/vod/search/all/type',{method:'POST',data:params})
}

