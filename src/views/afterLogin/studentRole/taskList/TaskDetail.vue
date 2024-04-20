<script setup>
import {useUserInfoStore} from "@/store/index.js";
import {get, post} from "@/net/index.js";
import {useRoute} from "vue-router";
import {reactive} from "vue";
import {ArrowLeft, Female, Male} from "@element-plus/icons-vue";
import {QuillDeltaToHtmlConverter} from "quill-delta-to-html";
import card from "@/components/container/main/setting/card.vue"
import taskTag from "@/components/container/main/taskList/TaskTag.vue"
import router from "@/router/index.js";
import RecordSubmit from "@/components/container/main/taskList/RecordSubmit.vue";
import defaultAvatar from "@/assets/image/defaultAvatar.png"
import Record from "@/components/container/main/taskList/Record.vue";
import CheckRoomRecord from "@/components/container/main/taskList/CheckRoomRecord.vue";
import {ELNOTIFICATION_OFFSET} from "@/utils/constUtil.js";
import {dateFormat} from "@/utils/methodUtil.js";


const store = useUserInfoStore();
const route = useRoute();
const taskId = route.params.taskId;
const task = reactive({
  data:null,
  submitRecords:[],
  page: 1,
  myRecord: {},
  myRecord_show: false,
})
const cardHeaderStyle = {};
function convertToHtml(content){
  const ops = JSON.parse(content).ops;
  const converter = new QuillDeltaToHtmlConverter(ops, {inlineStyles: true});
  return converter.convert();
}
const init = () => get(`api/task/task-detail?taskId=${taskId}`, data => {
  task.data = data;
  loadRecord();
})
init();

function loadRecord(){
  if (task.data.type !== 2)
    loadNormalRecord();
  else
    loadCheckRoomRecord();
}
function loadNormalRecord(){
  get(`api/task/student-record?taskId=${taskId}`, data => {
    task.myRecord = data;
    task.myRecord_show = true;
  })
}
function loadCheckRoomRecord(){
  get(`api/room/record?taskId=${taskId}`, data => {
    task.myRecord = data;
    task.myRecord_show = true;
  })
}
function updateRecord(editor, taskId, type, success){
  let url = type === 2 ? '/api/room/update-record' : '/api/task/update-student-record'
  post(`${url}`, {
    taskId: taskId,
    content: JSON.stringify(editor.text || {ops:[{insert:"无\n"}]}),
    title: editor.title
  }, () => {
    ElNotification({
      title: "Success!",
      message: "修改成功！",
      type: "success",
      offset: ELNOTIFICATION_OFFSET
    })
    success();
    editor.show = false;
  }, (message) => {
    ElNotification({
      title: "Error!",
      message: `${message}`,
      type: "error",
      offset: ELNOTIFICATION_OFFSET
    })
  })
}
function isExpire(task){
  return new Date(task.endTime) < new Date();
}
</script>

<template>
  <div class="outer-box">
    <div class="task-page" v-if="task.data">
      <div class="task-main border-radius-7" style="position: sticky;top: 0;z-index: 10">
        <card style="display: flex;width: 100%" class="border-radius-7" :card-header-style="cardHeaderStyle" >
          <el-button :icon="ArrowLeft" type="info" size="small" plain round @click="router.push('/index/task/list')">返回列表</el-button>
          <div style="text-align: center;flex: 1">
            <taskTag :type="task.data.type"/>
            <span style="font-weight: bold;">{{task.data.title}}</span>
          </div>
        </card>
      </div>
      <div class="task-main">
        <div class="task-main-left">
          <el-avatar :src="store.avatarUserUrl(task.data.user.avatar) || defaultAvatar"
                     :size="60"/>
          <div>
            <div style="font-size: 18px;font-weight: bold">
              {{task.data.user.name}}
              <span style="color: hotpink" v-if="task.data.user.gender === 1">
              <el-icon><Female /></el-icon>
            </span>
              <span style="color: dodgerblue" v-if="task.data.user.gender === 0">
              <el-icon><Male /></el-icon>
            </span>
            </div>
            <div class="desc">{{task.data.user.email}}</div>
            <el-divider style="margin: 10px 0"/>
            <div style="text-align: left;margin: 5px">
              <div class="desc">手机号：{{task.data.user.phone}}</div>
            </div>
            <div style="text-align: left;margin: 5px;">
              <div class="desc" style="color: #e85b28">截至时间：{{dateFormat("YYYY-mm-dd HH:MM",new Date(task.data.endTime))}}</div>
            </div>
          </div>
        </div>
        <div class="task-main-right">
          <div class="task-content" v-html="convertToHtml(task.data.content)"></div>
        </div>
      </div>
      <card v-if="!isExpire(task.data)" class="border-radius-7" :card-header-style="cardHeaderStyle">
        <RecordSubmit v-if="!task.myRecord" :type="task.data.type" :task-id="taskId" @success="loadRecord()"/>
        <RecordSubmit v-if="task.myRecord_show && task.myRecord" :type="task.data.type" :task-id="taskId"
                      :default-text="task.myRecord.content" :handler="updateRecord"
                      @success="loadRecord()" :default-title="task.myRecord.title" default-show-text="点我编辑回复"/>
      </card>
      <transition name="el-fade-in" mode="out-in">
        <card v-if="task.myRecord_show && task.myRecord" class="border-radius-7" :card-header-style="cardHeaderStyle">
          <Record v-if="task.data.type !== 2" :info="task.myRecord"/>
          <CheckRoomRecord v-else :info="task.myRecord"></CheckRoomRecord>
        </card>
      </transition>
    </div>
    <div class="right-card border-radius-7">
      <card class="border-radius-7 card-entity">
        <div></div>
      </card>
    </div>
  </div>

</template>

<style lang="less" scoped>
.outer-box{
  display: flex;
  justify-content: space-evenly;
  position: relative;

  .right-card{
    position: sticky;
    top: 10px;
    max-width: 350px;
    width: 300px;
    max-height: 500px;

    .card-entity{
      min-height: 300px;
    }
  }
}
.task-page{
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
  margin-bottom: 300px;
}
.task-main{
  display: flex;
  border-radius: 7px;
  margin: 0 auto;
  background-color: var(--el-bg-color);
  width: 800px;
  box-shadow: 0 0 10px 0 rgba(152, 108, 108, 0.2);


  .task-main-left{
    width: 200px;
    padding: 10px;
    text-align: center;
    border-right: solid 1px var(--el-border-color);

    .desc{
      font-size: 12px;
      color: grey;
    }
  }
  .task-main-right{
    width: 600px;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    .task-content{
      font-size: 14px;
      line-height: 22px;
      opacity: 0.8;
      flex: 1;
    }
  }
}
.record-wrapper{
  border-bottom: 1px solid grey;
  box-sizing:border-box;
  padding: 5px 0;
  border-bottom: 1px solid var(--el-border-color);
}
.border-radius-7{
  border-radius: 7px;
}

</style>