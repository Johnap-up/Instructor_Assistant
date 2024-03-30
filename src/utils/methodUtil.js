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
export {timerFn}