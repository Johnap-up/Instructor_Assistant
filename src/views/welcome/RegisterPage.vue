<script setup>
import {computed, reactive, ref, onUnmounted} from "vue";
import {Key, Lock, Message, User} from "@element-plus/icons-vue";
import router from "@/router/index.js";
import {get, post} from "@/net/index.js";
import {ElMessage} from "element-plus";
import {validatePassword, validateUsername} from "@/utils/validateRules.js";
import {timerFn} from "@/utils/methodUtil.js";

const myTime = timerFn();
const form = reactive({
  username: "",
  password: "",
  password_repeat: "",
  email: "",
  code: ""
})
const formRef = ref();
const rule = {
  username: [
    {validator: validateUsername, trigger: ['blur', 'change']},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: ['blur', 'change']}
  ],
  password_repeat: [
    {validator: validatePassword(form, 'password'), trigger: ['blur', 'change']}
  ],
  email: [
    {required: true, message: '请输入邮件地址', trigger: 'blur'},
    {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
  ],
  code: [
    {required: true, message: '请输入验证码', trigger: 'blur'}
  ]
}
const isEmailValid = computed(() => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email));
// onUnmounted(() => {myTime.destroyTimer()})
function askCode() {
  if (isEmailValid) {
    get(`/api/auth/ask-code?email=${form.email}&type=register`, () => {
      myTime.time = 60;
      myTime.consumeTime();
      ElMessage.success(`验证码已发送至${form.email}, 请注意查收`);
    }, (message) => {
      myTime.time = 0;
      ElMessage.warning(message)
    })
  } else {
    ElMessage.warning("请输入正确的邮箱地址")
  }
}

function register() {
  formRef.value.validate((valid) => {
    if (valid) {
      post("/api/auth/register", {...form},
          () => {
            ElMessage.success("注册成功, 请登录");
            router.push("/");
          })
    } else {
      ElMessage.warning("请完整填写注册信息表")
    }
  })
}


</script>

<template>
  <div style="margin: 0 20px" class="taCenter">
    <div style="margin-top: 100px">
      <div class="fs25 fwBold">注册新用户</div>
      <div class="fs14 mt10" style="color: grey">欢迎注册我们的学习平台, 请在下方填写相关信息</div>
    </div>
    <div style="margin-top: 50px">
      <el-form :model="form" :rules="rule" ref="formRef">
        <el-form-item prop="username">
          <el-input v-model="form.username" maxlength="10" type="text" placeholder="用户名">
            <template #prefix>
              <el-icon>
                <User/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" maxlength="20" type="password" placeholder="密码">
            <template #prefix>
              <el-icon>
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password_repeat">
          <el-input v-model="form.password_repeat" maxlength="20" type="password" placeholder="重复密码">
            <template #prefix>
              <el-icon>
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form.email" type="email" placeholder="电子邮件地址">
            <template #prefix>
              <el-icon>
                <Message/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="17">
              <el-input v-model="form.code" maxlength="6" type="text" placeholder="请输入验证码">
                <template #prefix>
                  <el-icon>
                    <Key/>
                  </el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="5">
              <el-button type="success" plain @click="askCode" :disabled=" !isEmailValid || !!myTime.time">
                {{ myTime.time > 0 ? `${myTime.time}s后重新发送` : '获取验证码' }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-top: 80px">
      <el-button type="warning" style="width: 270px" plain @click="register">立即注册</el-button>
    </div>
    <div style="margin-top: 20px">
      <el-link type="info" style="font-size: 16px" @click="router.push('/')">已有账号? 立即登录</el-link>
    </div>
  </div>
</template>

<style scoped>

</style>