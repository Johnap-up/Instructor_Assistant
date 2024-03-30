function phone() {
    return !!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i));
}
function isWeiXin(){
    let ua = window.navigator.userAgent.toLowerCase();    // 该属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息
    //通过正则表达式匹配ua中是否含有MicroMessenger字符串
    return ua.match(/MicroMessenger/i) === 'micromessenger';
}
export {phone, isWeiXin};