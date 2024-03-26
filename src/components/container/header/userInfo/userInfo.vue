<script setup>
import Tukumij from "@/assets/image/Tukumij.png";
import {useUserInfoStore} from "@/store/index.js";

const store = useUserInfoStore();


</script>

<template>
  <div class="user-info">
    <div class="profile">
      <div>{{store.user.username}}</div>
      <div>{{store.user.email}}</div>
    </div>
    <el-avatar :src="Tukumij"></el-avatar>
  </div>
</template>

<style lang="less" scoped>
.user-info{
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .profile{
    text-align: right;
    margin-right: 20px;

    :first-child{
      font-size: 18px;
      font-weight: bold;
      line-height: 20px;
    }
    :last-child{
      font-size: 10px;
      color: grey;
    }
  }
}
</style>