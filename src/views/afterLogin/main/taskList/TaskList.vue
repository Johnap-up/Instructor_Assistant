<script setup>
import taskIssue from "@/components/container/main/taskList/TaskIssue.vue"
import {ref, watch, reactive} from "vue";
import lightCard from "@/components/container/main/taskList/LightCard.vue";
import taskTag from "@/components/container/main/taskList/TaskTag.vue"
import {accessHeader, get} from "@/net/index.js";
import {Promotion, Clock, Delete, InfoFilled} from "@element-plus/icons-vue";
import {useUserInfoStore} from "@/store/index.js";
import axios from "axios";
import {ElMessage} from "element-plus";
import {dateFormat} from "@/utils/methodUtil.js";
import router from "@/router/index.js";
import InteractButton from "@/components/container/main/taskList/InteractButton.vue";

const store = useUserInfoStore();
const editorRef = ref(false);
const allYear = [2024, 2023, 2022, 2021, 2020];
const allSemester = [1, 2];
const tasks = reactive({
  selectedTaskList : [],   //最后呈现出来的列表
  selectedType : [],     //选择的类型
  selectedYear : null,     //选择的学年
  selectedSemester : null,
  page: 0,
  end: false
});
watch(()=>tasks.selectedType, () => {
  tasks.selectedTaskList = null;
  tasks.end = false;
  if (tasks.selectedType.length !== 0 && !isSelectAll()){
    tasks.selectedTaskList = store.task.taskList.filter(d => tasks.selectedType.includes(d.type));
  } else {
    tasks.selectedTaskList = store.task.taskList;
  }
})
async function sendGet(){     //由于不会封装，只能这样做，若不使用async，那么在渲染时，store.findTypeById会报错
  const data2 = await axios.get(`/api/task/list-all-task?page=${tasks.page}`, {headers: accessHeader()})
  if (data2.data.code === 200){
    tasks.selectedTaskList = data2.data.data;
    store.task.taskList = data2.data.data;
    tasks.page++;
  }else {
    ElMessage.warning(data2.data.message)
  }
}
function isSelectAll(){
  for (let i = 0; i < tasks.selectedType.length; i++)
    if (tasks.selectedType[i] === 0)
      return true;
  return false;
}
function updateTaskAfterIssue(){
  tasks.page = 0;
  tasks.end = false;
  tasks.selectedTaskList = [];
  store.task.taskList = [];
  getSelectedTask();
}
function getSelectedTask(){
  if (tasks.end) return;
  get(`/api/task/list-task?page=${tasks.page}&type=0&year=${tasks.selectedYear||0}&semester=${tasks.selectedSemester||0}`, data => {
    if (data){
      data.forEach(d => {store.task.taskList.push(d); tasks.selectedTaskList.push(d)})
      tasks.page++;
      console.log(tasks.selectedTaskList)
    }
    if (!data || data < 10)
      tasks.end = true;
  })
}
function deleteTask(taskId, success=()=>{}){
  get(`/api/task/delete-task?taskId=${taskId}`,(data) => {
    success()
    ElMessage.success("删除成功")
  }, (msg) => {
    ElMessage.warning(msg)
  })
}
sendGet();


</script>

<template>
  <div class="learningPage-box">
    <div class="learning-inner-box">
      <div style="display: flex; justify-content: space-between;justify-items: center">
        <div style="width: 500px;display: flex;justify-content: space-around;gap:10px">
          <el-select v-model="tasks.selectedType" value-key="id" clearable multiple placeholder="类型" style="">
            <el-option
                v-for="item in store.task.selectedType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
              <div class="flex items-center">
                <el-tag :style="{background: item.color}" class="selected-tag" size="small" />
                <span :style="{ color: item.color }">{{ item.name }}</span>
              </div>
            </el-option>
            <template #tag>
              <el-tag v-for="item in tasks.selectedType" :key="item" :style="{background: store.task.selectedType[item].color}" />
            </template>
          </el-select>
          <el-select v-model="tasks.selectedYear" clearable placeholder="学年" style="width: 240px">
            <el-option
                v-for="item in allYear"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
          <el-select v-model="tasks.selectedSemester" clearable placeholder="学期" style="width: 240px">
            <el-option
                v-for="item in allSemester"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
          <el-button @click="updateTaskAfterIssue">查询</el-button>
        </div>
        <el-button type="success" plain @click="editorRef = true">
          <el-icon><Promotion/></el-icon>
          发布任务
        </el-button>
      </div>
      <el-divider style="margin: 5px 0 0 0"/>
      <transition name="el-fade-in" mode="out-in">
        <div v-if="tasks.selectedTaskList?.length">
          <div style="display: flex;flex-direction: column;"
               v-infinite-scroll="getSelectedTask"
          >
            <lightCard v-for="item in tasks.selectedTaskList" :key="item.taskId" class="task-card"

            >
              <div class="task-card" style="width: calc(100% - 80px)" @click="router.push('/instructor/task/task-detail/' + item.taskId)">
                <div style="max-width: 100px">
                  <span style="font-weight: bold;font-size: 16px">{{item.title}}</span>
                  <div class="task-content">{{item.text}}</div>
                </div>
                <div class="card-right">
                  <taskTag :type="item.type"/>
                  <div style="margin-left: 7px;display: flex;max-width: 200px">
                    <div style="font-size: 13px;font-weight:bold;color: #b743fa;margin-right: auto">{{item.name}}</div>
                    <div style="font-size: 12px;text-align: right;width: 125px;color: #9d650c;display: flex;justify-content: space-around">
                      <el-icon size="14px"><Clock /></el-icon>
                      <span>{{dateFormat("YYYY-mm-dd HH:MM",new Date(item.endTime))}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <el-popconfirm
                  width="220px"
                  confirm-button-text="OK"
                  cancel-button-text="No, Thanks"
                  cancel-button-type="success"
                  confirm-button-type="danger"
                  :icon="InfoFilled"
                  icon-color="#626AEF"
                  :title="'确定删除该任务？'"
                  @confirm="()=>{deleteTask(item.taskId,()=>{tasks.page = 0;sendGet();});}"
              >
                <template #reference>
                  <interactButton style="" name="删除任务" color="dodgerblue"
                                  :check="false">
                    <el-icon><Delete /></el-icon>
                  </interactButton>
                </template>
              </el-popconfirm>
            </lightCard>
          </div>
        </div>
      </transition>

      <taskIssue :show="editorRef"  @success="editorRef = false;updateTaskAfterIssue()" @close="editorRef = false"/>
    </div>
  </div>
</template>

<style lang="less" scoped>
.learning-inner-box{
  padding: 20px;
  margin: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  min-height: 100vh;
}
.task-card{
  transition: scale .3s;
  display: flex;
  align-items: center;
  &:hover{
    cursor: pointer;
    background-color: #f8f8f8;
  }
  .dark &:hover{
    cursor: pointer;
    background-color: rgb(38, 39, 39);

  }
  .task-content{
    max-width: 100px;
    font-size: 14px;
    color: grey;
    margin: 5px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .card-right{
    margin-left: auto;
    display: flex;
    padding-top: 10px;
  }
}
.el-tag {
  border: none;
  aspect-ratio: 1;
}
.selected-tag{
  margin-right: 8px
}
.dark {
  .learning-inner-box{
    background-color: #141414;
  }
}
</style>