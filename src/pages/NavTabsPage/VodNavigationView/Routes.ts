import VodList from '@/pages/VideoPage/VodMainPage/VodList';
import SearchVod from '@/pages/VideoPage/SearchVodPage/SearchVod';
import VodMore from '@/pages/VideoPage/VodMorePage/VodMore';
import VodHistory from '@/pages/VideoPage/VodHistoryPage/VodHistory';
export default [
    {name:'vodList',index:true,component:VodList,params:{}},
    {name:'searchVod',component:SearchVod,params:{}},
    {name:'vodMore',component:VodMore,params:{}},
    {name:'vodHistory',component:VodHistory,params:{}},
]