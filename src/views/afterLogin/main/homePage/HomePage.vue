<script setup>
import img1 from "@/assets/image/maden/img1.png";
import img2 from "@/assets/image/maden/img2.png";
import img3 from "@/assets/image/maden/img3.png";
import img4 from "@/assets/image/maden/img4.png";
import img5 from "@/assets/image/maden/img5.jpg";
import {reactive, computed} from "vue";
import Weather from "@/components/container/main/homePage/Weather.vue";
import Calender from "@/components/container/main/homePage/Calender.vue";
import {get} from "@/net/index.js";
import LightCard from "@/components/container/main/taskList/LightCard.vue";
import {Calendar} from "@element-plus/icons-vue";


const list = getList();
console.log(list)
function getList() {
  let list = [];
  list.push({img: img1, id: 1})
  list.push({img: img2, id: 2})
  list.push({img: img3, id: 3})
  list.push({img: img4, id: 4})
  list.push({img: img5, id: 5})
  return list;
}

const weather = reactive({
  location: {},
  now: {},
  hourly: [],
  success: false
})
const today = computed(() => {
  const date = new Date()
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`
})
navigator.geolocation.getCurrentPosition(position => {
  const longitude = position.coords.longitude
  const latitude = position.coords.latitude
  get(`/api/homepage/weather?longitude=${longitude}&latitude=${latitude}`, data => {
    Object.assign(weather, data)
    weather.success = true
  })
}, error => {
  console.info(error)
  ElMessage.warning('位置信息获取超时，请检测网络设置，或者手动设置位置信息')
  get(`/api/homepage/weather?longitude=125.33060&latitude=43.821953`, data => {
    Object.assign(weather, data)
    weather.success = true
  })
}, {
  timeout: 3000,
  enableHighAccuracy: true
})
</script>

<template>
  <div class="outerBox">
    <el-carousel :interval="4000" type="card" height="250px" style="width: 80%">
      <el-carousel-item v-for="item in list" :key="item.id">
        <el-image fit="fill" :src="item.img" ></el-image>
      </el-carousel-item>
    </el-carousel>
    <div style="width:100%;display: flex;justify-content: space-around;margin-top: 20px">
      <LightCard style="margin-top: 10px;border-radius: 5px;box-shadow: 0 0 5px rgb(0,0,0,0.2);max-height: 250px">
        <div style="font-weight: bold">
          <el-icon><Calendar/></el-icon>
          天气信息
        </div>
        <el-divider style="margin: 10px 0"/>
        <weather :data="weather"/>
      </LightCard>
      <LightCard style="margin-top: 10px;border-radius: 5px;box-shadow: 0 0 5px rgb(0,0,0,0.2)">
        <div>
          <Calender></Calender>
        </div>

      </LightCard>
    </div>
  </div>
</template>

<style lang="less" scoped>
.outerBox{
  box-sizing: border-box;
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.info-text {
  display: flex;
  justify-content: space-between;
  color: grey;
  font-size: 14px;
}
.friend-link {
  border-radius: 5px;
  overflow: hidden;
}
</style>