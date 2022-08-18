    export function getDateStr (timestamp:number, format = 'yyyy-MM-dd') {
        if(timestamp){
            return getDate(timestamp).format(format);
        }else{
            return '--';
        }
    }
    export function getDate(timestamp: number) {
        if(timestamp) {
            const date = new Date();
            let _timestamp:any = String(timestamp);
            if(_timestamp.length !== 13) {
            _timestamp = parseFloat(_timestamp) * 1000;
            }
            date.setTime(parseFloat(_timestamp));
            return date;
        }else{
            return '';
        }
    }
    Date.prototype.format = function (formatReg: any) {
    let formatDateStr = formatReg;
    const date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(formatDateStr)) {
        formatDateStr = formatDateStr.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in date) {
        if (new RegExp("(" + k + ")").test(formatDateStr)) {
        formatDateStr = formatDateStr.replace(RegExp.$1, RegExp.$1.length === 1
            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return formatDateStr;
    };