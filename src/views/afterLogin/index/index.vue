<script setup>
import {logout} from "@/net/index.js";
import router from "@/router/index.js";
function clickLogout() {
  logout(()=>{router.push("/")})
}
</script>

<template>
  <el-button @click="clickLogout">退出登录</el-button>
</template>

<style scoped>

</style>