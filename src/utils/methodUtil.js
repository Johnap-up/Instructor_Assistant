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
function getCurrentSemester() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 月份从 0 开始计数，所以要加 1

    let semester;
    if (currentMonth >= 9 && currentMonth <= 12) {
        semester = `${currentYear}-${currentYear + 1} 学年第一学期`;
    } else if (currentMonth >= 1 && currentMonth <= 2) {
        semester = `${currentYear - 1}-${currentYear} 学年第一学期`;
    } else if (currentMonth >= 3 && currentMonth <= 8) {
        semester = `${currentYear - 1}-${currentYear} 学年第二学期`;
    } else {
        semester = "当前时间不在学年学期范围内";
    }

    return semester;
}
export {timerFn, dateFormat, getCurrentSemester}