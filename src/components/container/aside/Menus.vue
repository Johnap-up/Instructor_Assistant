<script setup>
import {
  Menu as IconMenu,
  Setting, Avatar, List, HomeFilled, PieChart, Edit, Upload, SetUp
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
    <el-menu-item index="/instructor">
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
          <el-icon><SetUp /></el-icon>
          任务配置
        </template>
        <el-menu-item index="/instructor/task/list">
          <el-icon><Upload /></el-icon>
          任务发布
        </el-menu-item>
<!--        <el-menu-item index="2-1-2">-->
<!--          <el-icon><Edit /></el-icon>-->
<!--          自定义模板-->
<!--        </el-menu-item>-->
      </el-sub-menu>
      <el-menu-item index="/instructor/charts">
        <el-icon><PieChart /></el-icon>
        数据图表
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/instructor/logs">
      <el-icon><icon-menu /></el-icon>
      <span>日志记录</span>
    </el-menu-item>
<!--    <el-menu-item index="/instructor/student-setting">-->
<!--      <el-icon><Bell /></el-icon>-->
<!--      <span>失物招领</span>-->
<!--    </el-menu-item>-->
    <el-menu-item index="/instructor/crud-page">
      <el-icon><Avatar /></el-icon>
      <span>考勤管理</span>
    </el-menu-item>
<!--    <el-menu-item index="6">-->
<!--      <el-badge :value="10"  class="item">-->
<!--        <el-icon ><Calendar /></el-icon>-->
<!--      </el-badge>-->
<!--      <span>日程安排</span>-->
<!--    </el-menu-item>-->
    <el-menu-item index="/instructor/user-setting">
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