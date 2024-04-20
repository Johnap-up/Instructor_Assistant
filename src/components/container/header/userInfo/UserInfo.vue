<script setup>
import {useUserInfoStore} from "@/store/index.js";
import {Back, Bell, Moon, Sunny, User} from "@element-plus/icons-vue";
import { useDark, useToggle } from '@vueuse/core'
import {get, logout} from "@/net/index.js";
import router from "@/router/index.js";
import {ref} from "vue";
import LightCard from "@/components/container/main/taskList/LightCard.vue";

const store = useUserInfoStore();
const isDark = useDark()
const toggleDark = useToggle(isDark)
const settingUrl = {
  "instructor": "/instructor/user-setting",
  "student": "/index/student-setting"
}
function clickLogout() {
  logout(()=>{router.push("/")})
}
function goUrl(url){
  router.push(url);
  // console.log(url);
  // window.open(url);
}
const notification = ref([]);
const loadNotification = () => get("/api/notification/list", data => {
  notification.value = data
})
loadNotification();
</script>

<template>
  <div class="user-info">
    <el-popover v-if="notification !== null" placement="bottom" :width="350" trigger="click">
      <template #reference>
        <el-badge style="margin-right: 15px" is-dot :hidden="!notification.length">
          <div class="notification">
            <el-icon><Bell/></el-icon>
            <div style="font-size: 10px">消息</div>
          </div>
        </el-badge>
      </template>
      <el-empty :image-size="80" description="暂时没有未读消息哦~" v-if="!notification.length"/>
      <el-scrollbar :max-height="500" v-else>
        <LightCard v-for="item in notification" class="notification-item"
                    @click="goUrl(item.url)">
          <div>
            <el-tag size="small" :type="item.type">消息</el-tag>&nbsp;
            <span style="font-weight: bold">{{item.title}}</span>
          </div>
          <el-divider style="margin: 7px 0 3px 0"/>
          <div style="font-size: 13px;color: grey">
            {{item.content}}
          </div>
        </LightCard>
      </el-scrollbar>
    </el-popover>
    <div class="profile">
      <div>{{store.user.name}}</div>
      <div>{{store.user.email || '邮箱未设置~'}}</div>
    </div>
    <el-dropdown>
      <el-avatar :src="store.avatarUrl" class="headerAvatar"></el-avatar>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="router.push(settingUrl[store.user.role])">
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
.notification-item {
  transition: .3s;
  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
}
.notification {
  font-size: 22px;
  line-height: 14px;
  text-align: center;
  transition: color .3s;

  &:hover {
    color: grey;
    cursor: pointer;
  }
}
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