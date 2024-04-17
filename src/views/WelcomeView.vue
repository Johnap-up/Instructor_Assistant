<script setup>
import page1 from "@/assets/image/maden/img4.png"


</script>

<template>
  <div class="outerBox">
    <div class="imageBox">
      <el-image :src="page1" fit="cover" style="width: 100%; height: 100%"></el-image>
      <div class="welcomeTitle">
        <div class="fw30 fwBold ">欢迎来到导员助手</div>
        <div class="mt10">在这里你可以方便的管理本学院的学生信息, 并将统计信息导出</div>
        <div class="mt5">其他功能包括学生日常任务发布, 青年大学习统计, 失物招领, 线上查寝等</div>
      </div>
    </div>
    <div class="rightCard">
<!--      还不知道原理-->
      <router-view v-slot="{ Component }">
        <transition name="el-fade-in-linear" mode="out-in">
          <component :is="Component"/>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped>
.outerBox{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
}
.imageBox{
  user-select: none;
  position: relative;
  flex: 1;
  background-color: black;
}
.rightCard{
  width: 400px;
  background-color: var(--el-bg-color);
}
.welcomeTitle{
  position: absolute;
  color: white;
  bottom: 30px;
  left: 30px;
  text-shadow: 0 0 10px black;
}
</style>