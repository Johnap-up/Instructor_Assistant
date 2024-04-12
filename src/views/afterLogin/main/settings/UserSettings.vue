<script setup>
import card from "@/components/container/main/setting/card.vue";
import {User, Message, Refresh, Paperclip, Document, EditPen, Lock, Key} from '@element-plus/icons-vue'
import {ref, computed, reactive} from "vue";
import {useUserInfoStore} from "@/store/index.js";
import {validatePhone} from "@/utils/validateRules.js";
import {post, get, accessHeader} from "@/net/index.js";
import {ELNOTIFICATION_OFFSET} from "@/utils/constUtil.js";
import {timerFn} from "@/utils/methodUtil.js";
import {ElMessage} from "element-plus";
import {validatePassword} from "@/utils/validateRules.js";
import axios from "axios";

const myTime = timerFn();
const store = useUserInfoStore();
const registerTime = computed(() => new Date(store.user.registerTime).toLocaleString())
const tagType = ["primary", "success", "info", "warning", "danger"];
const changeableFormRef = ref();
const emailFormRef = ref();
const passwordFormRef = ref();
const unchangeableDetails = reactive({
  username: "",
  gender: 1,
  institute: "",
  grade: "",
  annex_class: ["21班","22班","23班"],
  experience: "ciallo",
  tid: ""
})
const changeableDetails = reactive({
  phone: "13576072541"
})
const emailForm = reactive({
  email: "",
  code: ""
})
const passwordForm = reactive({
  password: "",
  new_password: "",
  new_password_repeat: ""
})
const rule = {
  email: [
    {required: true, message: '请输入邮件地址', trigger: 'blur'},
    {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
  ],
  code: [
    {required: true, message: '请输入验证码', trigger: 'blur'}
  ],
  phone: [
    {validator: validatePhone, trigger: ['blur', 'change']}
  ]
}
const rule_password = {
  password: [
    {required: true, message: '请输入原来的密码', trigger: 'blur'},
  ],
  new_password: [
    {required: true, message: '请输入新密码', trigger: 'blur'},
    {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur'}
  ],
  new_password_repeat: [
    {required: true, message: '请再次输入新密码', trigger: 'blur'},
    {validator: validatePassword(passwordForm, "new_password"), trigger: ['blur', 'change']}
  ]
};
const loading = reactive({
  changeable: false,
  email: false,
  allCards: true
})
const isEmailValid = ref(true);
const isPasswordFormValid = ref(true);
const onValidate = (prop, isValid) => {
  if (prop === "email")
    isEmailValid.value = isValid;
}
const onValidatePassword = (prop, isValid) => {isPasswordFormValid.value = isValid;}    //这里是对所有表单项进行校验
function saveChangeableDetails(){
  changeableFormRef.value.validate(valid => {
    if (valid) {
      loading.changeable = true;
      post("/api/user/save-details", changeableDetails, ()=>{
        ElNotification({
          title: "Success!",
          message: "您的个人信息已成功修改！",
          type: "success",
          offset: ELNOTIFICATION_OFFSET
        })
        loading.changeable = false;
      }, (message) => {
        ElNotification({
          title: "Error!",
          message: `${message}`,
          type: "error",
          offset: ELNOTIFICATION_OFFSET
        })
        loading.changeable = false;
      })
    } else {
      ElNotification({
        title: "Warning!",
        message: "请检查您的输入是否正确",
        type: "warning",
        offset: ELNOTIFICATION_OFFSET
      })
    }
  })
}
function sendEmailCode(){
  emailFormRef.value.validate(isValid => {
    get(`/api/auth/ask-code?email=${emailForm.email}&type=modify`, () => {
      myTime.time = 60;
      myTime.consumeTime();
      ElMessage.success(`验证码已成功发送至邮箱${emailForm.email}，请注意查收`);
    }, (message) => {
      myTime.time = 0;
      ElMessage.warning(message);
    })
  })
}
function modifyEmail(){
  emailFormRef.value.validate(isValid => {
    post("/api/user/modify-email", emailForm, () => {
      store.user.email = emailForm.email;
      emailForm.code = "";
      ElNotification({
        type: "success",
        title: "Success!",
        message: "您的电子邮件地址已成功修改！",
        offset: ELNOTIFICATION_OFFSET
      })}, (msg) => {
      emailForm.code = "";
      ElNotification({
        type: "warning",
        title: "Warning!",
        message: `修改失败, ${msg}`,
      })})
  });
}
function resetPassword(){
  passwordFormRef.value.validate(isValid => {
    if (isValid){
      post("/api/user/change-password", passwordForm, () => {
        passwordFormRef.value.resetFields();
        ElNotification({
          type: "success",
          title: "Success!",
          message: "您的密码已成功修改！",
          offset: ELNOTIFICATION_OFFSET
        })}, (msg) => {
        ElNotification({
          type: "warning",
          title: "Warning!",
          message: `修改失败, ${msg}`,
          offset: ELNOTIFICATION_OFFSET
        })
      })
    }
  })
}
function beforeAvatarUpload(rawFile){
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png'){
    ElMessage.error("头像只能是JPG/PNG格式的");
    return false;
  }else if(rawFile.size / 1024 > 2*1024){
    ElMessage.error("头像不能大于 2MB")
    return false;
  }
  store.isLoading.avatarUpload = true;
  return true;
}
function uploadSuccess(response){
  ElMessage.success("头像上传成功");
  store.user.avatar = response.data;
  store.isLoading.avatarUpload = false;
}
get("/api/user/details", (data) => {
  unchangeableDetails.username = store.user.name;
  emailForm.email = store.user.email;
  unchangeableDetails.gender = data.gender;
  unchangeableDetails.institute = data.institute;
  unchangeableDetails.grade = data.grade;
  unchangeableDetails.annex_class = data.annex_class?.split(",");
  unchangeableDetails.experience = data.experience;
  unchangeableDetails.tid = data.tid;
  changeableDetails.phone = data.phone;
  loading.allCards = false;
})
</script>

<template>
  <div class="settings-box" v-loading="loading.allCards">
    <div class="settings-left">
      <card class="card-public" :icon="User" title="个人信息" desc="您可以在这里修改默认绑定的电子邮件地址">
        <el-form :model="unchangeableDetails" label-position="top" style="margin: 0 10px 10px 10px">
          <el-form-item label="姓名">
            <el-input disabled :placeholder="unchangeableDetails.username"/>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group :model-value="unchangeableDetails.gender" disabled>
              <el-radio :value="0" >男</el-radio>
              <el-radio :value="1" >女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="所属学院">
            <el-input disabled :placeholder="unchangeableDetails.institute"/>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="年级">
                <el-input disabled :placeholder="unchangeableDetails.grade"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="教学号">
                <el-input disabled :placeholder="unchangeableDetails.tid"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="管理班级">
            <div class="tag-box">
              <el-check-tag checked  v-for="(item, index) in unchangeableDetails.annex_class" :type="tagType[index%5]"  effect="plain">{{item + "班"}}</el-check-tag>
            </div>
          </el-form-item>
        </el-form>
      </card>
      <card class="middle-card card-public" :icon="Document" title="信息设置" desc="您可以在这里修改一些信息">
        <el-form ref="changeableFormRef" :rules="rule" :model="changeableDetails" label-position="top" style="margin:0 10px 10px 10px">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="changeableDetails.phone" maxlength="11"/>
          </el-form-item>
          <div>
            <el-button @click="saveChangeableDetails" :icon="Refresh" type="success" :loading="loading.changeable">保存信息</el-button>
          </div>
        </el-form>
      </card>
    </div>
    <div class="settings-middle">
      <card class="middle-card card-public"  :icon="Message" title="电子邮件设置" desc="您可以在这里修改默认绑定的电子邮件地址">
        <el-form @validate="onValidate" ref="emailFormRef" :rules="rule" :model="emailForm" label-position="top" style="margin:0 10px 10px 10px">
          <el-form-item label="电子邮件" prop="email">
            <el-input v-model="emailForm.email" placeholder="输入电子邮箱" maxlength="30"/>
          </el-form-item>
          <el-form-item prop="code">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-input v-model="emailForm.code" placeholder="验证码" maxlength="8"/>
              </el-col>
              <el-col :span="8">
                <el-button  type="success" @click="sendEmailCode" :disabled="!isEmailValid || !!myTime.time" style="width: 100%" plain>
                  {{ myTime.time > 0 ? `${myTime.time}s后重新发送` : '获取验证码' }}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <div>
            <el-button :icon="Refresh" @click="modifyEmail" type="success">更新电子邮件</el-button>
          </div>
        </el-form>
      </card>
      <card class="card-public" :icon="EditPen" title="修改密码" desc="您可以在这里修改密码">
        <el-form :model="passwordForm" @validate="onValidatePassword" ref="passwordFormRef" :rules="rule_password" label-width="auto" label-position="left">
          <el-form-item label="当前密码" prop="password">
            <el-input type="password" v-model="passwordForm.password" :prefix-icon="Key" placeholder="当前密码" maxlength="16"/>
          </el-form-item>
          <el-form-item label="新密码" prop="new_password">
            <el-input type="password" v-model="passwordForm.new_password" show-password :prefix-icon="Lock" placeholder="新密码" maxlength="16"/>
          </el-form-item>
          <el-form-item label="重复新密码" prop="new_password_repeat">
            <el-input type="password" v-model="passwordForm.new_password_repeat" show-password :prefix-icon="Lock" placeholder="重复新密码" maxlength="16"/>
          </el-form-item>
          <div style="text-align: center">
            <el-button @click="resetPassword" :icon="Refresh" type="success">立即重置密码</el-button>
          </div>
        </el-form>
      </card>
    </div>
    <div class="settings-right">
      <div style="position: sticky;top: 20px;">
        <card :icon="Paperclip" title="账号墙" class="card-public">
          <div style="text-align: center;padding: 5px 15px 0 15px">
            <div>
              <el-avatar class="avatar" :size="70" :src="store.avatarUrl" v-loading="store.isLoading.avatarUpload"/>
              <div style="margin: 5px 0">
                <el-upload
                    :action="axios.defaults.baseURL + '/api/image/avatar'"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    :on-success="uploadSuccess"
                    :headers="accessHeader()"
                >
                  <el-button size="small" round type="danger" plain>修改头像</el-button>
                </el-upload>
              </div>
              <div style="font-weight: bold">你好, {{store.user.name}}</div>
            </div>
          </div>
          <el-divider style="margin: 10px 0"/>
          <div class="experience">
            {{unchangeableDetails.experience || "暂无个人简介~"}}
          </div>
        </card>
        <card style="font-size: 14px" class="card-public" >
          <div style="margin-bottom: 10px">任期时间: {{registerTime}}</div>
          <div style="color: grey">欢迎适应导员助手平台</div>
        </card>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.settings-box{
  display: flex;
  &>:first-child{
    margin-left: 20px;
  }
  &> div{
    margin-right: 20px;
  }
}
.settings-middle, .settings-right, .settings-left{
  flex: 1;
  margin-top: 20px;
  max-width: 450px;
}
.tag-box{
  display: flex;
  grid-gap: 0.5rem;
  gap: 0.5rem;
  flex-wrap: wrap;
  box-sizing: border-box;
}
.experience{
  font-size: 14px;
  color: grey;
  padding: 10px;
  white-space: pre-line;
  line-height: 18px;
}
.avatar:hover{
  animation: rotateIn;
  animation-duration: 1s;
  cursor: pointer;
}
.card-public{
  margin-bottom: 20px;
  border-radius: 15px;
  &:hover{
    box-shadow: 0 0 10px 0 rgba(152, 108, 108, 0.35);
  }
}
</style>