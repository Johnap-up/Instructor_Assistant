<script setup>
import {Lock, User} from "@element-plus/icons-vue";
import router from "@/router/index.js";
import {reactive, ref} from "vue";
import {login} from "@/net/index.js";

const form = reactive({
  username: '',
  password: '',
  rememberMe: false,         //通过localStorage来保存Authorization
  role: "",
})
const formRef = ref();
const rule = {
  username:[
    {required:true, message:'请输入账号'},
  ],
  password:[
    {required:true, message:'请输入密码'},
  ],
}

function userLogin(){
  formRef.value.validate((valid) => {
    if (valid){
      login(form.username, form.password, form.rememberMe, form.role, ()=>{router.push("/instructor")})
    }
  })
}
</script>

<template>
  <div class="taCenter" style="margin: 0 20px">
    <div style="margin-top: 150px">
      <div class="fwBold fs25">登录</div>
      <div style="color: grey" class="mt10 fs14">请输入用户名和密码</div>
    </div>
    <div style="margin-top: 50px">
      <el-form :model="form"  ref="formRef" :rules="rule">
        <el-form-item prop="username">
          <el-input v-model="form.username" type="text" placeholder="学号/邮箱">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" maxlength="20" type="password" placeholder="请输入密码" show-password clearable>
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
<!--        <el-form-item prop="role" style="margin-bottom: 0">-->
<!--          <el-radio-group v-model="form.role" style="margin-left: auto">-->
<!--            <el-radio value="student" size="small">学生</el-radio>-->
<!--            <el-radio value="instructor" size="small">导员</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
        <el-row>
          <el-col :span="12" class="taLeft">
            <el-form-item prop="rememberMe">
              <el-checkbox v-model="form.rememberMe" label="记住我" size="large" />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="taRight">
            <div style="height: 40px;margin-bottom: 18px;display: flex;align-items: center;justify-content: right;">
              <el-link type="primary" @click="router.push('/reset')">忘记密码?</el-link>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="margin-top: 40px">
      <el-button @click="userLogin" style="width: 270px" type="success" plain>立即登录</el-button>
    </div>
    <el-divider>
      <span style="font-size: 13px;color: grey">没有账号</span>
    </el-divider>
    <div>
      <el-button style="width: 270px" type="warning" plain @click="router.push('/register')">立即注册</el-button>
    </div>

  </div>
</template>

<style scoped>

</style>