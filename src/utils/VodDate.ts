export function formatTime(value:any) {
    let h = Math.floor(value / 60 / 60);
    let m:any = Math.floor(value / 60 - h * 60);
    let s:any = Math.floor(value - (h * 60 * 60 + m * 60));
  
    if (m < 10) {
        m = "0" + m;
    }
  
    if (s < 10) {
        s = "0" + s;
    }
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}