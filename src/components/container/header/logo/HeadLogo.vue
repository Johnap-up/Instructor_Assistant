<script setup>
import {useUserInfoStore} from "@/store/index.js";
import Tukumij from "@/assets/image/Tukumij.png"
import title from "@/assets/image/title.png"

const store = useUserInfoStore();
</script>

<template>
  <el-image class="logo" :src="Tukumij"></el-image>
  <el-image class="logo" :src="title"></el-image>
</template>

<style scoped>
.logo{
  height: 32px;
}
</style>