const validatePhone = (rule, value, callback) => {
    if (value === ''){
        callback(new Error('请输入手机号'))
    } else {
        const reg = /^1[3-9]\d{9}$/
        if (reg.test(value)){
            callback()
        } else {
            callback(new Error('请输入正确的手机号'))
        }
    }
}
const validateQQ = (rule, value, callback) => {
    if (value === ''){
        callback(new Error('请输入QQ号'))
    } else {
        const reg = /^[1-9][0-9]{4,9}$/
        if (reg.test(value)){
            callback()
        } else {
            callback(new Error('请输入正确的QQ号'))
        }
    }
}
const validateSid = (rule, value, callback) => {
    if (value === ''){
        callback(new Error('请输入学号'))
    } else {
        const reg = /^\d{8}$/
        if (reg.test(value)){
            callback()
        } else {
            callback(new Error('请输入正确的学号'))
        }
    }
}
const validateUsername = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入用户名'))
    } else if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error('用户名只能是字母、数字、汉字, 不能包含特殊字符'));
    } else {
        callback()
    }
}
const validatePassword = function (password, name){
    return (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入密码'))
        } else if (value !== password[name]) {
            callback(new Error('两次输入的密码不一致'));
        } else {
            callback()
        }
    }
}
export {validatePassword, validatePhone, validateUsername, validateQQ, validateSid};