<script setup>
import axios from "axios";
import {accessHeader} from "@/net/index.js";
import {ElMessage} from "element-plus";
import {useUserInfoStore} from "@/store/index.js";

const store = useUserInfoStore();
async function getTypes(){
  const data1 = await axios.get("/api/task/types", {headers: accessHeader()})
  store.task.selectedType = [];
  store.task.selectedType.push({name: '全部', id: 0, color: 'linear-gradient(45deg, white, red, orange, gold,  green, blue, #6222C9)'})

  if (data1.data.code === 200){
    data1.data.data.forEach(d => {store.task.selectedType.push(d); });
    store.task.types = data1.data.data;
  }else {
    ElMessage.warning(data1.data.data.message)
  }
}
getTypes();

</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="el-fade-in-linear" mode="out-in">
      <keep-alive include="TaskList">
        <component :is="Component"/>
      </keep-alive>
    </transition>
  </router-view>
</template>

<style lang="less" scoped>

</style>