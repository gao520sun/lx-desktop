

export const dsJq = ['古装', '战争', '青春', '偶像', '喜剧', '家庭', '犯罪', '动作', '奇幻', '剧情', '历史', '经典', '乡村', '情景', '商战', '网剧', '其他']
export const dsArea = ['内地',, '韩国', '香港', '台湾', '日本', '美国', '泰国', '英国', '新加坡', '其他']
export const dsLang = ['国语', '英语', '粤语', '闽南语', '韩语', '日语', '其它']

export const dyJq = ['喜剧', '爱情', '动作', '科幻', '剧情', '战争', '警匪', '犯罪', '动画', '奇幻', '武侠', '冒险', '枪战', '恐怖', '悬疑', '惊悚', '经典', '青春', '文艺', '微电影', '古装', '历史', '运动', '农村', '儿童', '网络电影']
export const dyArea = ['大陆', '香港', '台湾', '美国', '法国', '英国', '日本', '韩国', '德国', '泰国', '印度', '意大利', '西班牙', '加拿大', '其他']
export const dyLang = ['国语', '英语', '粤语', '闽南语', '韩语', '日语', '法语', '德语', '其它']

export const zyJq = ['选秀', '情感', '访谈', '播报', '旅游', '音乐', '美食', '纪实', '曲艺', '生活', '游戏互动', '财经', '求职']
export const zyArea = ['内地', '港台', '日韩', '欧美']
export const zyLang = ['国语', '英语', '粤语', '闽南语', '韩语', '日语', '其它']

export const dmJq = ['科幻', '热血', '推理', '搞笑', '冒险', '萝莉', '校园', '动作', '机战', '运动', '战争', '少年', '少女', '社会', '原创', '亲子', '益智', '励志', '情感', '其他']
export const dmArea = ['国产', '日本', '欧美', '其他']
export const dmLang = ['国语', '英语', '粤语', '闽南语', '韩语', '日语', '其它']
const allDate = () => {
    const year = new Date().getFullYear(); 
    let years:number[] = [];
    for(let i = 2008; i <= year; i++){
        years.push(i)
    }
    return years;
}
export const dsData = [
    {title:'全部剧情',data:dsJq},
    {title:'全部地区',data:dsArea},
    {title:'全部语言',data:dsLang},
    {title:'全部时间',data:allDate().reverse()},
]
export const dyData = [
    {title:'全部剧情',data:dyJq},
    {title:'全部地区',data:dyArea},
    {title:'全部语言',data:dyLang},
    {title:'全部时间',data:allDate().reverse()},
]
export const zyData = [
    {title:'全部剧情',data:zyJq},
    {title:'全部地区',data:zyArea},
    {title:'全部语言',data:zyLang},
    {title:'全部时间',data:allDate().reverse()},
]
export const dmData = [
    {title:'全部剧情',data:dmJq},
    {title:'全部地区',data:dmArea},
    {title:'全部语言',data:dmLang},
    {title:'全部时间',data:allDate().reverse()},
]

export const initSelectData = ['全部剧情','全部地区','全部语言','全部时间']

export const dataType = (type:number) => {
    if(type == 1) {
        return dyData
    }else if(type == 2) {
        return dsData
    }else if(type == 3) {
        return zyData
    }else if(type == 4) {
        return dmData
    }
    return []
}





