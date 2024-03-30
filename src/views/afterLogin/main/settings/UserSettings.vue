<script setup>
import card from "@/components/container/main/setting/card.vue";
import {User, Message, Refresh, Paperclip, Document} from '@element-plus/icons-vue'
import {ref, computed, reactive} from "vue";
import YaZi from "@/assets/image/YaZi.png";
import {useUserInfoStore} from "@/store/index.js";
import {validatePhone} from "@/utils/validateRules.js";
import {post, get} from "@/net/index.js";
import {ELNOTIFICATION_OFFSET} from "@/utils/constUtil.js";

const store = useUserInfoStore();
const registerTime = computed(() => new Date(store.user.registerTime).toLocaleString())
const tagType = ["primary", "success", "info", "warning", "danger"];
const changeableFormRef = ref();
const emailFormRef = ref();
const unchangeableDetails = reactive({
  username: "",
  gender: 1,
  institute: "",
  grade: "",
  annex_class: ["21班","22班","23班"],
  experience: "ciallo",
})
const changeableDetails = reactive({
  phone: "13576072541"
})
const emailForm = reactive({
  email: "",
  code: ""
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
const loading = reactive({
  changeable: false,
  email: false,
  allCards: true
})
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
get("/api/user/details", (data) => {
  console.log(data)
  unchangeableDetails.username = store.user.username;
  emailForm.email = store.user.email;
  unchangeableDetails.gender = data.gender;
  unchangeableDetails.institute = data.institute;
  unchangeableDetails.grade = data.grade;
  unchangeableDetails.annex_class = data.annex_class?.split(",");
  unchangeableDetails.experience = data.experience;
  changeableDetails.phone = data.phone;
  loading.allCards = false;
})
</script>

<template>
  <div class="settings-box" v-loading="loading.allCards">
    <div class="settings-left">
      <card :icon="User" title="个人信息" desc="您可以在这里修改默认绑定的电子邮件地址">
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
          <el-form-item label="年级">
            <el-input disabled :placeholder="unchangeableDetails.grade"/>
          </el-form-item>
          <el-form-item label="管理班级">
            <div class="tag-box">
              <el-check-tag checked  v-for="(item, index) in unchangeableDetails.annex_class" :type="tagType[index%5]"  effect="plain">{{item + "班"}}</el-check-tag>
            </div>
          </el-form-item>
        </el-form>
      </card>
      <card class="middle-card" :icon="Document" title="信息设置" desc="您可以在这里修改一些信息">
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
      <card class="middle-card" :icon="Message" title="电子邮件设置" desc="您可以在这里修改默认绑定的电子邮件地址">
        <el-form ref="emailFormRef" :rules="rule" :model="emailForm" label-position="top" style="margin:0 10px 10px 10px">
          <el-form-item label="电子邮件" prop="email">
            <el-input v-model="emailForm.email" placeholder="输入电子邮箱" maxlength="30"/>
          </el-form-item>
          <el-form-item prop="code">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-input v-model="emailForm.code" placeholder="验证码" maxlength="8"/>
              </el-col>
              <el-col :span="8">
                <el-button  type="success" style="width: 100%" plain>获取验证码</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <div>
            <el-button :icon="Refresh" type="success">更新电子邮件</el-button>
          </div>
        </el-form>
      </card>
    </div>
    <div class="settings-right">
      <div style="position: sticky;top: 20px;">
        <card :icon="Paperclip" title="账号墙">
          <div style="text-align: center;padding: 5px 15px 0 15px">
            <div>
              <el-avatar :size="70" :src="YaZi"></el-avatar>
              <div style="font-weight: bold">你好, {{store.user.username}}</div>
            </div>
          </div>
          <el-divider style="margin: 10px 0"/>
          <div class="experience">
            {{unchangeableDetails.experience || "暂无个人简介~"}}
          </div>
        </card>
        <card style="margin-top: 10px;font-size: 14px">
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
.settings-middle{

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

</style>