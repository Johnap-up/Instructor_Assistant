<script setup>
import {defineProps} from "vue";
import {Female, Male} from "@element-plus/icons-vue";
import {dateFormat} from "@/utils/methodUtil.js";
import NoImage from "@/assets/image/NoImage.png"
import {useUserInfoStore} from "@/store/index.js";
import defaultAvatar from "@/assets/image/defaultAvatar.png"


const store = useUserInfoStore();
const props = defineProps({
  info: Object,
});
console.log(!!props.info.images)
</script>

<template>
  <div class="record-main">
    <div class="record-main-left">
        <el-avatar :src="store.avatarUserUrl(info.user.avatar) || defaultAvatar"
                   :size="60"/>
        <div class="desc" style="font-size: 14px; padding-left: 15px">
          <span style="color: #5d5a5a;font-weight: bold">{{info.user.name}}</span>
          <span style="font-size: 12px">{{info.user.sid}}</span>
          <span style="color: hotpink" v-if="info.user.gender === 1">
                <el-icon><Female/></el-icon>
              </span>
          <span style="color: dodgerblue" v-if="info.user.gender === 0">
                <el-icon><Male/></el-icon>
          </span>
          <div class="desc" style="padding-top: 5px">{{dateFormat("YYYY-mm-dd HH:MM",new Date(info.submitTime))}}</div>
          <div class="desc" style="padding-top: 10px">{{'Tel：' + info.user.phone}}</div>
          <div class="desc" >{{'QQ：' + info.user.qq}}</div>
        </div>
    </div>
    <div class="record-main-right">
      <div class="title-text">
        <div>{{info.title}}</div>
        <div class="text-content">{{info.text}}</div>
      </div>
      <el-image
          style="width: 80px; height: 80px"
          :src="info.images?.[0] || NoImage"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="info.images.length ? info.images : [NoImage]"
          :initial-index="4"
          fit="cover"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.demo-image__error .image-slot {
  font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}

.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}

.record-main {
  display: flex;
  justify-content: space-between;

  .record-main-left{
    display: flex;
    align-items: center;
  }
  .record-main-right{
    display: flex;

    .title-text{
      margin-right: 20px;
      width: 150px;
    }
  }
}
.desc {
  font-size: 12px;
  color: grey;
}
.text-content{
  width: 150px;
  height: 40px;
  //max-width: 100px;
  font-size: 14px;
  color: grey;
  margin: 5px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  word-break: break-word;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>