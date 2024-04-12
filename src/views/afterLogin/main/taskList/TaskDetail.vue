<script setup>
import {useUserInfoStore} from "@/store/index.js";
import {get, post} from "@/net/index.js";
import {useRoute} from "vue-router";
import {reactive, ref} from "vue";
import {ArrowLeft, Female, Male, EditPen} from "@element-plus/icons-vue";
import {QuillDeltaToHtmlConverter} from "quill-delta-to-html";
import card from "@/components/container/main/setting/card.vue"
import taskTag from "@/components/container/main/taskList/TaskTag.vue"
import router from "@/router/index.js";
import interactButton from "@/components/container/main/taskList/InteractButton.vue"
import taskIssue from "@/components/container/main/taskList/TaskIssue.vue"
import RecordSubmit from "@/components/container/main/taskList/RecordSubmit.vue";
import Record from "@/components/container/main/taskList/Record.vue";
import {ElMessage} from "element-plus";


const store = useUserInfoStore();
const edit = ref(false);
const route = useRoute();
const taskId = route.params.taskId;
const task = reactive({
  data:null,
  submitRecords:[],
  page: 1
})
const cardHeaderStyle = {};
function convertToHtml(content){
  const ops = JSON.parse(content).ops;
  const converter = new QuillDeltaToHtmlConverter(ops, {inlineStyles: true});
  return converter.convert();
}
function updateTask(editor){
  post("/api/task/update-task", {
    taskId: taskId,
    type: editor.type.id,
    title: editor.title,
    content: editor.text || {ops:[{insert:"无\n"}]},
    issueTime: editor.timePicker[0],
    endTime: editor.timePicker[1]
  }, () => {
    ElMessage.success("任务更新成功")
    edit.value = false;
    init();
  })
}
const init = () => get(`api/task/task-detail?taskId=${taskId}`, data => {
  task.data = data;
  loadSubmitRecords(1);
})
init();

function loadSubmitRecords(page){
  task.submitRecords = null;
  task.page = page;
  get(`/api/task/records?taskId=${taskId}&page=${page - 1}`, data => {
    task.submitRecords = data;
  })
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
          <el-avatar :src="store.avatarUserUrl(task.data.user.avatar)"
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
            <div style="text-align: left;margin: 0 5px">
              <div class="desc">手机号：{{task.data.user.phone}}</div>
            </div>
          </div>
          <interactButton style="margin-top: 10px" name="编辑帖子" color="dodgerblue"
                          v-if="store.user.role.includes(task.data.user.role) && store.user.id === task.data.user.id"
                          :check="false" @check="edit = true;">
            <el-icon><EditPen/></el-icon>
          </interactButton>
        </div>
        <div class="task-main-right">
          <div class="task-content" v-html="convertToHtml(task.data.content)"></div>
        </div>
      </div>
      <card class="border-radius-7" :card-header-style="cardHeaderStyle">
        <RecordSubmit :task-id="taskId"/>
      </card>
      <card class="border-radius-7" :card-header-style="cardHeaderStyle">
        <div class="record-wrapper" v-for="item in task.submitRecords" :key="item.id">
          <Record :info="item"/>
        </div>
      </card>
      <div style="width: fit-content;margin: 20px auto">
        <el-pagination background layout="prev, pager, next"
                       v-model:current-page="task.page" @current-change="loadSubmitRecords"
                       :total="task.data.recordAmount" :page-size="10" hide-on-single-page/>
      </div>

    </div>
<!--    下面的task.data是必须的，否则会出现数据未来得及同步的问题-->
    <taskIssue :show="edit" @close="edit = false" v-if="task.data"
               submit-button="更新任务内容" :default-type="store.findTypeById(task.data.type)"
               :default-time-picker="[new Date(task.data.issueTime), new Date(task.data.endTime)]"
               :default-text="task.data.content" :default-title="task.data.title" :submit="updateTask"></taskIssue>
    <div class="right-card border-radius-7">
      <card class="border-radius-7 card-entity">
        <div>ciallo</div>
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