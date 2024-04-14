<script setup>
import {defineProps} from "vue";
import {dateFormat} from "@/utils/methodUtil.js";
import NoImage from "@/assets/image/NoImage.png"
import {useUserInfoStore} from "@/store/index.js";
import defaultAvatar from "@/assets/image/defaultAvatar.png"


const store = useUserInfoStore();
const props = defineProps({
  info: Object,
});
function dealNames(list){
  let str = '';
  for (let i = 0; i < list.length; i++) {
    if (i === 2)
      str+='\n';
    str = str + list[i] + " "
  }
  return str;
}
</script>

<template>
  <div class="record-main">
    <div class="record-main-left">
      <el-avatar :src="defaultAvatar"
                 :size="60"/>
      <div class="desc" style="font-size: 14px; padding-left: 15px">
        <span style="color: #5d5a5a;font-weight: bold">{{store.student.dormitoryEnum[info.user.dormitory] + info.user.room}}</span>
        <div class="desc" style="padding-top: 5px">{{dateFormat("YYYY-mm-dd HH:MM",new Date(info.submitTime))}}</div>
        <div class="desc" style="padding-top: 10px">{{dealNames(info.user.names)}}</div>
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