<script setup>
import {useUserInfoStore} from "@/store/index.js";
import {Back, Moon, Sunny, User} from "@element-plus/icons-vue";
import { useDark, useToggle } from '@vueuse/core'
import {logout} from "@/net/index.js";
import router from "@/router/index.js";

const store = useUserInfoStore();
const isDark = useDark()
const toggleDark = useToggle(isDark)
function clickLogout() {
  logout(()=>{router.push("/")})
}
</script>

<template>
  <div class="user-info">
    <div class="profile">
      <div>{{store.user.username}}</div>
      <div>{{store.user.email}}</div>
    </div>
    <el-dropdown>
      <el-avatar :src="store.avatarUrl" class="headerAvatar"></el-avatar>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <el-icon><User /></el-icon>
            个人资料
          </el-dropdown-item>
          <el-dropdown-item>
            <el-icon v-show="isDark"><Moon /></el-icon>
            <el-icon v-show="!isDark"><Sunny /></el-icon>
            <span @click.stop="toggleDark()">主题 &nbsp;</span>
            <el-switch
                size="small"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-text="暗"
                inactive-text="亮"
                v-model="isDark"/>
            <span></span>
          </el-dropdown-item>
          <el-dropdown-item @click="clickLogout" divided>
            <el-icon><Back /></el-icon>
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="less" scoped>
.user-info{
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .headerAvatar:hover{
    cursor: pointer;
  }

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