<script setup>
import {
  Menu as IconMenu,
  Setting, Bell, Avatar, List, Flag, MostlyCloudy, HomeFilled, Calendar,
} from '@element-plus/icons-vue'
import {useUserInfoStore} from "@/store/index.js";

const store = useUserInfoStore();
const handleOpen = (key) => {
}
const handleClose = (key, keyPath) => {
}
</script>

<template>

  <el-menu
      style="min-height: calc(100vh - 55px)"   class="el-menu-vertical-demo sideMenu"
      router
      :default-active="$route.path"
      active-text-color="#ffd04b"
      @open="handleOpen" @close="handleClose"
      :collapse="store.isCollapse"
  >
    <el-menu-item index="1">
      <el-icon><HomeFilled /></el-icon>
      <span>首页</span>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><List /></el-icon>
        <span>任务列表</span>
      </template>
      <el-sub-menu index="2-1">
        <template #title>
          <el-icon><Flag /></el-icon>
          青年大学习
        </template>
        <el-menu-item index="2-1-1">任务发布</el-menu-item>
        <el-menu-item index="2-1-2">提交记录</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2-2">
        <template #title>
          <el-icon><MostlyCloudy /></el-icon>
          线上查寝
        </template>
        <el-menu-item index="2-2-1">任务发布</el-menu-item>
        <el-menu-item index="2-2-2">提交记录</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3">
      <el-icon><icon-menu /></el-icon>
      <span>日志记录</span>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><Bell /></el-icon>
      <span>事务招领</span>
    </el-menu-item>
    <el-menu-item index="5">
      <el-icon><Avatar /></el-icon>
      <span>考勤管理</span>
    </el-menu-item>
    <el-menu-item index="6">
      <el-badge :value="10"  class="item">
        <el-icon ><Calendar /></el-icon>
      </el-badge>
      <span>日程安排</span>
    </el-menu-item>
    <el-menu-item index="/index/user-setting">
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