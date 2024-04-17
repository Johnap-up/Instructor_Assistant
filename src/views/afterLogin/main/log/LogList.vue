<script setup>
import {get} from "@/net/index.js";
import {ref} from "vue";
import {dateFormat} from "@/utils/methodUtil.js";
import LightCard from "@/components/container/main/taskList/LightCard.vue";

const list = ref([])
const loading = ref(false)
get("/api/log/get-logs", (data)=>{
  list.value = data;
  loading.value = true;
  console.log(data);
})
</script>

<template>
  <div>
    <LightCard v-if="loading" v-for="item in list" :key="item.id" class="task-card">
      <div style="max-width: 100px;display: flex;align-items: center">
        <span style="font-weight: bold;font-size: 16px">您</span>
      </div>
      <div class="task-content" style="margin-left: 10px">{{item.content}}</div>

      <div class="card-right">
        <span style="color: grey;font-size: 14px">{{dateFormat("YYYY-mm-dd HH:MM:SS", new Date(item.time))}}</span>
      </div>
    </LightCard>
  </div>
</template>

<style lang="less" scoped>
.task-card{
  transition: scale .3s;
  display: flex;
  &:hover{
    cursor: pointer;
    background-color: #f8f8f8;
  }
  .dark &:hover{
    cursor: pointer;
    background-color: rgb(38, 39, 39);

  }
  .task-content{
    max-width: 600px;
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
</style>