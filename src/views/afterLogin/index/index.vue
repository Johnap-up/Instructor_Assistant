<script setup>
import {logout} from "@/net/index.js";
import router from "@/router/index.js";
import topHeader from "@/components/container/header/topHeader.vue"
import {ref} from "vue";
import {get} from "@/net/index.js";
import {useUserInfoStore} from "@/store/index.js";

const store = useUserInfoStore();
const loading = ref(true);
get("/api/user/info", (data) => {
  store.user = data;
  loading.value = false;
})

function clickLogout() {
  logout(()=>{router.push("/")})
}
</script>

<template>
  <div class="main-content" v-loading="loading" element-loading-text="Loading...">
    <el-container style="height: 100%" v-if="!loading">
      <el-header class="main-content-header">
        <topHeader></topHeader>
      </el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-container>
          <el-main>Main
            <el-button @click="clickLogout">退出登录</el-button>
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
</style>