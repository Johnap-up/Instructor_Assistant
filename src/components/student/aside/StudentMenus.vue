<script setup>
import {
  Menu as IconMenu,
  Setting, Bell, List, HomeFilled
} from '@element-plus/icons-vue'
import {useUserInfoStore} from "@/store/index.js";

const store = useUserInfoStore();
</script>

<template>

  <el-menu
      style="min-height: calc(100vh - 55px)"   class="el-menu-vertical-demo sideMenu"
      router
      :default-active="$route.path"
      active-text-color="#ffd04b"
      :collapse="store.isCollapse"
      :default-openeds="['2','2-1','2-2']"
  >
    <el-menu-item index="/index">
      <el-icon><HomeFilled /></el-icon>
      <span>首页</span>
    </el-menu-item>
    <el-menu-item index="/index/task/list">
      <el-icon><List /></el-icon>
      所有任务
    </el-menu-item>
    <el-menu-item index="/index/logs">
      <el-icon><icon-menu /></el-icon>
      <span>日志记录</span>
    </el-menu-item>
    <el-menu-item index="/index/student-setting222222">
      <el-icon><Bell /></el-icon>
      <span>失物招领</span>
    </el-menu-item>
    <el-menu-item index="/index/student-setting">
      <el-icon><setting /></el-icon>
      <span>设置</span>
    </el-menu-item>
  </el-menu>
</template>

<style lang="less" scoped>
.sideMenu{
  background-color: var(--el-bg-color);
  color: var(--el-text-color);
}
.item {
  line-height: calc(var(--el-menu-item-height) / 1.7);
}
</style>