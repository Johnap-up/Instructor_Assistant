import {reactive} from "vue";

const timerFn = function (t){
    const myTime = reactive({
        time: t||0,
        timer: 0,
        consumeTime() {
            if (myTime.time === 0) return;
            this.timer = setTimeout(function fn() {
                myTime.time--;
                myTime.time === 0 ? clearTimeout(myTime.timer) : myTime.timer = setTimeout(fn, 1000);
            }, 1000);
        },
        destroyTimer(){ clearTimeout(myTime.timer); myTime.time = 0;}
    });
    return myTime;
}

function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString(),         // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "s": date.getMilliseconds()             //毫秒
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt;
}
export {timerFn, dateFormat}