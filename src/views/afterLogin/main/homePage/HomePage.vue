<script setup>
import img1 from "@/assets/image/maden/img1.png";
import img2 from "@/assets/image/maden/img2.png";
import img3 from "@/assets/image/maden/img3.png";
import img4 from "@/assets/image/maden/img4.png";
import img5 from "@/assets/image/maden/img5.jpg";

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
</script>

<template>
  <div class="outerBox">
    <el-carousel :interval="4000" type="card" height="250px" style="width: 80%">
      <el-carousel-item v-for="item in list" :key="item.id">
        <el-image fit="fill" :src="item.img" ></el-image>
      </el-carousel-item>
    </el-carousel>
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
</style>