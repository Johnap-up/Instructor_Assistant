<script setup>
import topHeader from "@/components/container/header/TopHeader.vue"
import studentMenus from "@/components/student/aside/StudentMenus.vue"
import instructorMenus from "@/components/container/aside/Menus.vue"
import {ref} from "vue";
import {get} from "@/net/index.js";
import {useUserInfoStore} from "@/store/index.js";
import {phone, isWeiXin} from "@/utils/mediaFunction.js";

const store = useUserInfoStore();
const loading = ref(true);
get("/api/user/info", (data) => {
  store.user = data;
  loading.value = false;
})
store.isCollapse = !!(phone() || isWeiXin());
</script>

<template>
  <div class="main-content" v-loading="loading" element-loading-text="Loading...">
    <el-container style="height: 100%" v-if="!loading">
      <el-header class="main-content-header">
        <topHeader></topHeader>
      </el-header>
      <el-container>
        <el-aside :width="store.isCollapse ? '63.2px' : '230px'">
          <el-scrollbar style="height: calc(100vh - 55px)">
            <instructorMenus style="height: 100%" v-if="store.user.role.includes('instructor')"></instructorMenus>
            <studentMenus style="height: 100%" v-else></studentMenus>
          </el-scrollbar>
        </el-aside>
        <el-container>
          <el-main class="main-content-page">
            <el-scrollbar style="height: calc(100vh - 55px)">
              <router-view v-slot="{ Component }">
                <transition name="el-fade-in-linear" mode="out-in">
                  <component :is="Component" style="height: 100%"/>
                </transition>
              </router-view>
            </el-scrollbar>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.main-content{
  height: 100vh;
  width: 100vw;
}
.main-content-header{
  border-bottom: solid 1px var(--el-border-color);
  height: 55px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
.main-content-page{
  padding: 0;
  background-color: #f6f6f6;
}
.dark .main-content-page{
  background-color: #212225;
}
</style>