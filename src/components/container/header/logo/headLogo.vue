<script setup>
import {useUserInfoStore} from "@/store/index.js";

const store = useUserInfoStore();
</script>

<template>
  <el-image class="logo" :src="store.avatarUrl"></el-image>
</template>

<style scoped>
.logo{
  height: 32px;
}
</style>