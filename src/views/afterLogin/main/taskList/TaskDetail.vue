<script setup>
import {useUserInfoStore} from "@/store/index.js";
import {get, post} from "@/net/index.js";
import {useRoute} from "vue-router";
import {reactive, ref, nextTick} from "vue";
import {ArrowLeft, Female, Male, EditPen} from "@element-plus/icons-vue";
import {QuillDeltaToHtmlConverter} from "quill-delta-to-html";
import card from "@/components/container/main/setting/card.vue"
import taskTag from "@/components/container/main/taskList/TaskTag.vue"
import router from "@/router/index.js";
import interactButton from "@/components/container/main/taskList/InteractButton.vue"
import taskIssue from "@/components/container/main/taskList/TaskIssue.vue"
import Record from "@/components/container/main/taskList/Record.vue";
import CheckRoomRecord from "@/components/container/main/taskList/CheckRoomRecord.vue";
import {ElMessage} from "element-plus";
import defaultAvatar from "@/assets/image/defaultAvatar.png"
import {dateFormat} from "@/utils/methodUtil.js";
import LightCard from "@/components/container/main/taskList/LightCard.vue";
import * as echarts from 'echarts';


const store = useUserInfoStore();
const edit = ref(false);
const route = useRoute();
const taskId = route.params.taskId;
const task = reactive({
  data:null,
  submitRecords:[],
  page: 1,
  record_show: false
})
const doUndo = reactive({
  showFlag: false,
  'do': null,
  'undo': null,
  doOrUndo: null,
  title: '',
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
  task.record_show = true;
  loadSubmitRecords(1);
  getDoUndo(data.type);
})
init();

function loadSubmitRecords(page){
  task.submitRecords = null;
  task.page = page;
  if (task.data.type !== 2)
    get(`/api/task/records?taskId=${taskId}&page=${page - 1}`, data => {
      task.submitRecords = data;
    })
  else
    get(`/api/room/records?taskId=${taskId}&page=${page - 1}`, data => {
      task.submitRecords = data;
    })
}

function getDoUndo(type){
  const url = type === 2 ? `/api/room/do-undo?taskId=${taskId}` : `/api/task/do-undo?taskId=${taskId}`;
  get(url, data => {
    doUndo.do = data.do;
    doUndo.undo = data.undo;
    doUndo.doOrUndo = data.undo
    doUndo.showFlag = true;
    const option = {
      tooltip: {
        // trigger: 'inside'
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      title:{
        text:`已提交 ${doUndo.do.length + '/' + (doUndo.undo.length + doUndo.do.length)}`,
        left:'center',
        top:'center',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: '{b}\n{c}',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
              formatter: '{b}\n{c}'
            },
          },
          labelLine: {
            length: 0,
            length2: 0,
            maxSurfaceAngle: 1
          },
          data: [
            { value: doUndo.do.length, name: '已交' },
            { value: doUndo.undo.length, name: '未交' },
          ]
        }
      ]
    };
    nextTick(()=>{
      const myCharts = echarts.init(document.getElementById("myCharts"));
      myCharts.setOption(option);
      myCharts.on('click', function(params) {
        if (params.name === '已交')
          doUndo.doOrUndo = doUndo.do;
        else
          doUndo.doOrUndo = doUndo.undo;
      });
    })
  })
}
</script>

<template>
  <div class="outer-box">
    <div class="task-page" v-if="task.data">
      <div class="task-main border-radius-7" style="position: sticky;top: 0;z-index: 10">
        <card style="display: flex;width: 100%" class="border-radius-7" :card-header-style="cardHeaderStyle" >
          <el-button :icon="ArrowLeft" type="info" size="small" plain round @click="router.push('/instructor/task/list')">返回列表</el-button>
          <div style="text-align: center;flex: 1">
            <taskTag :type="task.data.type"/>
            <span style="font-weight: bold;">{{task.data.title}}</span>
          </div>
          <span style="color: grey;font-size: 12px;padding-top: 10px">{{dateFormat("YYYY-mm-dd HH:MM", new Date(task.data.issueTime))}}</span>
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
      <card v-if="task.record_show && task.data" class="border-radius-7" :card-header-style="cardHeaderStyle">
        <div v-if="task.data.type !==2 " class="record-wrapper" v-for="item in task.submitRecords" :key="item.id">
          <Record v-if="item.submitTime" :info="item"/>
        </div>
        <div v-else class="record-wrapper" v-for="item in task.submitRecords" :key="item.id">
          <CheckRoomRecord v-if="item.submitTime" :info="item"/>
        </div>
      </card>
      <div style="width: fit-content;margin: 20px auto">
        <el-pagination background layout="prev, pager, next"
                       v-model:current-page="task.page" @current-change="loadSubmitRecords"
                       :total="task.data.recordAmount" :page-size="10" hide-on-single-page/>
      </div>

    </div>
<!--    下面的task.data是必须的，否则会出现数据未来得及同步的问题-->
    <taskIssue :show="edit" :is-update="true" @close="edit = false" v-if="task.data"
               submit-button="更新任务内容" :default-type="store.findTypeById(task.data.type)"
               :default-time-picker="[new Date(task.data.issueTime), new Date(task.data.endTime)]"
               :default-text="task.data.content" :default-title="task.data.title" :submit="updateTask"></taskIssue>
    <div class="right-card border-radius-7">
      <card class="border-radius-7 card-entity">
        <div v-if="doUndo.showFlag" style="width: 300px;height: 330px">
          <div style="height: 400px;" id="myCharts" ></div>
        </div>
      </card>
      <card v-if="doUndo.showFlag" class="border-radius-7" style="margin-top: 10px;height: 250px;overflow: hidden">
        <LightCard>
          <div v-if="task.data.type !== 2" style="display: flex;justify-content: space-between">
            <div>姓名学号</div>
            <div style="font-size: 12px;padding-top: 2px">qq</div>
          </div>
          <div v-else style="display: flex;justify-content: space-between">
            <div>宿舍楼</div>
            <div style="font-size: 12px;padding-top: 2px">寝室</div>
          </div>
        </LightCard>
        <transition name="el-fade-in" mode="out-in">
          <div v-if="task.data.type !== 2">
            <el-scrollbar height="250px">
              <LightCard v-for="item in doUndo.doOrUndo">
                <div style="display: flex;justify-content: space-between;color: grey">
                  <div>{{item.name + item.sid}}</div>
                  <div style="font-size: 12px;padding-top: 2px">{{item.qq}}</div>
                </div>
              </LightCard>
            </el-scrollbar>
          </div>
          <div v-else>
            <el-scrollbar height="250px">
              <LightCard v-for="item in doUndo.doOrUndo">
                <div style="display: flex;justify-content: space-between;color: grey">
                  <div>{{store.student.dormitoryEnum[item.dormitory]}}</div>
                  <div style="font-size: 12px;padding-top: 2px">{{item.room}}</div>
                </div>
              </LightCard>
            </el-scrollbar>
          </div>
        </transition>

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
    width: 350px;
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
.chart {
  height: 400px;
}
</style>