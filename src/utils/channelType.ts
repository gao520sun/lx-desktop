

export const VOD_TYPE = {
    detail:'vod:detail',
    fullScreen: 'vod:fullScreen',
    js:'vod:js',
}
export const WIN_TYPE = {
    fullScreen: 'win:fullScreen',
    resized:'win:resized'
}
export const STORE_TYPE = {
    vodHistory:'store:vod_history',
    micSongList:'store:mic_songList',
    collectSongList:'mic:collect_song_list',
}
export const MIC_TYPE = {
    songPlay:'mic:song_play',
    addSongPlay:'mic:add_song_play',
    clearSongPlay:'mic:clear_song_play',
    oneSongPlay:'mic:one_song_play',
    createSongList:'mic:create_song_list',
    showLyric:'mic:show_lyric',
    dataLyric:'mic:data_lyric',
   
}

window.VOD_TYPE = VOD_TYPE
window.WIN_TYPE = WIN_TYPE
window.STORE_TYPE = STORE_TYPE
window.MIC_TYPE = MIC_TYPE