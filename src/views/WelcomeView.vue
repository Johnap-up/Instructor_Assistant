<script setup>
import YaZi from '@/assets/image/YaZi.png';
</script>

<template>
  <div class="outerBox">
    <div class="imageBox">
      <el-image :src="YaZi" fit="cover" style="width: 100%; height: 100%"></el-image>
    </div>
    <div class="rightCard">

    </div>
  </div>

</template>

<style scoped>
.outerBox{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
}
.imageBox{
  flex: 1;
  background-color: black;
}
.rightCard{
  width: 400px;
  background-color: white;
}
</style>