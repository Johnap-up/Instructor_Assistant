import axios from "axios";
// import {ElMessage} from "element-plus";

const authItemName = "access_token";
const roleItemName = "access_role";             //暂时直接存储，之后要加密
const defaultFailure = (message, code, url) => {
    console.warn(`请求地址:${url}, 状态码:${code}, 错误信息:${message}`);
    ElMessage.warning(message);
}
const defaultError = (err) => {
    console.error(err);
    ElMessage.error("发生了一些错误, 请联系管理员");
}
function takeAccessToken(){
    const str = localStorage.getItem(authItemName)||sessionStorage.getItem(authItemName);
    if (str === null){
        return null;
    }
    const authObj = JSON.parse(str);
    if(authObj.expire <= new Date()){
        deleteAccessToken();
        ElMessage.warning("登录状态已过期, 请重新登录");
        return null;
    }
    return authObj.token;
}

function accessHeader(){
    let str = takeAccessToken();
    return str ? {'Authorization': `Bearer ${str}`} : {};
}
function takeAccessRole(){
    const str = localStorage.getItem(roleItemName)||sessionStorage.getItem(roleItemName);
    if (str === null)
        return null;
    const roleObj = JSON.parse(str);
    if (roleObj.expire <= new Date()){
        deleteAccessRole();
        return null;
    }
    return roleObj.role;
}
function accessRole(){
    return takeAccessRole();
}
function get(url, success, failure=defaultFailure){
    internalGet(url, accessHeader(), success, failure);
}
function post(url, data, success, failure=defaultFailure){
    internalPost(url, data, accessHeader(), success, failure);
}
function storeAccessToken(token, remember, expire, role){
    const authObj = {token: token, expire: expire}
    const roleObj = {role: role};
    const str = JSON.stringify(authObj);
    const roleStr = JSON.stringify(roleObj);
    if (remember){
        localStorage.setItem(authItemName, str);
        localStorage.setItem(roleItemName, roleStr);
    } else{
        sessionStorage.setItem(authItemName, str);
        sessionStorage.setItem(roleItemName, roleStr);
    }
}

function deleteAccessToken(){
    localStorage.removeItem(authItemName);
    sessionStorage.removeItem(authItemName);
}
function deleteAccessRole(){
    localStorage.removeItem(roleItemName);
    sessionStorage.removeItem(roleItemName);
}
function internalPost(url, data, header, success, failure, error = defaultError) {
    axios.post(url, data, {
        headers: header
    }).then(({data}) => {
        if (data.code === 200) {
            success(data.data);
        } else {
            failure(data.message, data.code, url);
        }
    }).catch(err => {
        error(err);
        if (err.response.status === 404){
            ElMessage({
                showClose: true,
                message: '发生了一些错误, 请联系管理员',
                type: 'error',
            })
        }
    })
}

function internalGet(url, header, success, failure, error = defaultError) {
    axios.get(url, {
        headers: header
    }).then(({data}) => {
        if (data.code === 200) {
            success(data.data);
        } else {
            failure(data.message, data.code, url);
        }
    }).catch(err => {
        error(err);
    })
}
function login(username, password, remember, role, success, failure = defaultFailure){      //这里的role被弃置了，暂时没改过来
    internalPost("/api/auth/login",{
        username: username,
        password: password,
        remember: remember,
        role: role,
    },{
        'Content-Type': 'application/x-www-form-urlencoded'
    }, (data) => {
        storeAccessToken(data.token, remember, data.expire, data.role);                           //暂时不加密
        ElMessage.success(`登录成功, 欢迎${data.username}`)
        success(data);
    },failure)
}
function logout(success, failure = defaultFailure){
    get("/api/auth/logout",()=>{
        deleteAccessToken();
        deleteAccessRole();
        ElMessage.success("退出登录成功，欢迎您在再次使用");
        success();
    },failure)
}
function download(url, fileName){
    axios.get(url, {
        responseType: 'blob',
        headers: accessHeader()
    }).then(res => {
        console.log(res);
        let a = document.createElement("a");
        a.setAttribute('download', fileName);
        a.href = window.URL.createObjectURL(res.data);
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
}

function unauthorized(){
    return !takeAccessToken();
}

export {login, logout, post, get, unauthorized, accessHeader, accessRole, deleteAccessToken, deleteAccessRole, download};