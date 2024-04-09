<script setup>
import {useUserInfoStore} from "@/store/index.js";
import {get} from "@/net/index.js";
import {useRoute} from "vue-router";
import {reactive, computed} from "vue";
import axios from "axios";
import {ArrowLeft, Female, Male} from "@element-plus/icons-vue";
import {QuillDeltaToHtmlConverter} from "quill-delta-to-html";
import card from "@/components/container/main/setting/card.vue"
import taskTag from "@/components/container/main/taskList/TaskTag.vue"
import router from "@/router/index.js";


const route = useRoute();
const taskId = route.params.taskId;
const task = reactive({
  data:null,
  comments:[]
})
const content = computed(() => {
  const ops = JSON.parse(task.data.content).ops;
  const converter = new QuillDeltaToHtmlConverter(ops, {inlineStyles: true});
  return converter.convert();
})
get(`api/task/task?taskId=${taskId}`, data => {task.data = data})
</script>

<template>
  <div class="outer-box">
    <div class="task-page" v-if="task.data">
      <div class="task-main border-radius-7" style="position: sticky;top: 0;z-index: 10">
        <card style="display: flex;width: 100%" class="border-radius-7">
          <el-button :icon="ArrowLeft" type="info" size="small" plain round @click="router.push('/index/task/list')">返回列表</el-button>
          <div style="text-align: center;flex: 1">
            <taskTag :type="task.data.type"/>
            <span style="font-weight: bold;">{{task.data.title}}</span>
          </div>
        </card>
      </div>
      <div class="task-main">
        <div class="task-main-left">
          <el-avatar :src="axios.defaults.baseURL + '/image' + task.data.user.avatar"
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
        </div>
        <div class="task-main-right">
          <div class="task-content" v-html="content"></div>
        </div>
      </div>
      <div></div>
    </div>
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
}
.task-main{
  display: flex;
  border-radius: 7px;
  margin: 0 auto;
  background-color: var(--el-bg-color);
  width: 800px;

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

    .task-content{
      font-size: 14px;
      line-height: 22px;
      opacity: 0.8;
    }
  }
}
.border-radius-7{
  border-radius: 7px;
}
</style>