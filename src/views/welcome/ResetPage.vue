<script setup>
import {ref, reactive, computed,} from "vue"
import {Key, Lock, Message} from "@element-plus/icons-vue";
import {get, post} from "@/net/index.js";
import {ElMessage} from "element-plus";
import router from "@/router/index.js";
import {timerFn} from "@/utils/methodUtil.js";

const active = ref(0);
const formRef = ref();
const myTime = timerFn();     //验证码计时用
const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback()
  }
}
const form = reactive({
  password: "",
  password_repeat: "",
  email: "",
  code: ""
})
const rule = {
  email: [
    { required: true, message: '请输入邮件地址', trigger: 'blur' },
    { type: 'email', message: '请输入合法的电子邮件地址', trigger: ['blur', 'change']}
  ],
  code: [
    { required: true, message: '请输入获取的验证码', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码的长度必须在6-16个字符之间', trigger: ['blur'] }
  ],
  password_repeat: [
    { validator: validatePassword, trigger: ['blur', 'change'] },
  ],
}
const isEmailValid = computed(() => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email));
function askCode() {
  if (isEmailValid) {
    get(`/api/auth/ask-code?email=${form.email}&type=reset`, () => {
      myTime.time = 60;
      myTime.consumeTime();
      ElMessage.success(`验证码已发送至${form.email}, 请注意查收`);
    }, (message) => {
      myTime.time = 0;
      ElMessage.error(message);
    })
  } else {
    ElMessage.warning("请输入正确的邮箱地址")
  }
}
function emailConfirm(){
  formRef.value.validate((valid) => {
    if (valid){
      post("/api/auth/reset-confirm", {email: form.email, code: form.code}, () => {active.value=1;}
          ,(message) => {ElMessage.error(message);});
    }else {
      ElMessage.warning("请完整填写重置信息表")
    }
  })
}
function resetPassword() {
  formRef.value.validate((valid) => {
    if (valid) {
      post("/api/auth/reset-password", {email: form.email, password: form.password, password_repeat: form.password_repeat},
          () => {
            ElMessage.success("重置成功！请保管好密码！");
            router.push("/");
          })
    } else {
      ElMessage.warning("请完整填写注册信息表")
    }
  })
}
</script>

<template>
  <div style="text-align: center">
    <div style="margin-top: 30px" class="usNone">
      <el-steps :active="active"  align-center>
        <el-step title="验证电子邮件"/>
        <el-step title="重新设置密码"/>
      </el-steps>
    </div>
    <div v-if="active === 0" style="margin: 0 20px">
      <div style="margin-top: 50px">
        <div style="font-size: 25px;font-weight: bold">重置密码</div>
        <div style="font-size: 14px;color: grey;margin-top: 20px">请输入要重置的密码的电子邮件地址</div>
        <el-link type="info" style="font-size: 16px" @click="router.push('/')">返回登录</el-link>
      </div>
      <div style="margin-top: 50px">
        <el-form :model="form" ref="formRef" :rules="rule">
          <el-form-item prop="email">
            <el-input v-model="form.email" type="email" placeholder="电子邮件地址">
              <template #prefix>
                <el-icon><Message/></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-row :gutter="10" style="width: 100%">
              <el-col :span="17">
                <el-input v-model="form.code" maxlength="6" type="text" placeholder="请输入验证码">
                  <template #prefix>
                    <el-icon><Key/></el-icon>
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
        <el-button type="warning" style="width: 270px" plain @click="myTime.destroyTimer">开始重置密码</el-button>
      </div>
    </div>
    <div v-if="active === 1" style="margin: 0 20px">
      <div style="margin-top: 50px">
        <div style="font-size: 25px;font-weight: bold">重置密码</div>
        <div style="font-size: 14px;color: grey;margin-top: 20px">请填写新密码,务必牢记,防止丢失</div>
      </div>
      <div style="margin-top: 50px">
        <el-form :model="form" ref="formRef" :rules="rule">
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
        </el-form>
      </div>
      <div style="margin-top: 80px">
        <el-button type="danger" style="width: 270px" plain @click="resetPassword">立即重置密码</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>














