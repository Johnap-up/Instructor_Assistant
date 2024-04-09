<script setup>
import {useUserInfoStore} from "@/store/index.js";
import Tukumij from "@/assets/image/Tukumij.png"

const store = useUserInfoStore();
</script>

<template>
  <el-image class="logo" :src="Tukumij"></el-image>
</template>

<style scoped>
.logo{
  height: 32px;
}
</style>