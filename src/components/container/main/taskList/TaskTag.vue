<script setup>
import {useUserInfoStore} from "@/store/index.js";

const store = useUserInfoStore();
defineProps({
  type: Number,
})
</script>

<template>
  <div class="task-type"
       :style="{
          color: store.findTypeById(type).color + 'EE',
          'border-color': store.findTypeById(type).color + 'AA',
          'background': store.findTypeById(type).color + '33'}">
    {{ store.findTypeById(type).name }}
  </div>
</template>

<style lang="less" scoped>
.task-type{
  display: inline-block;
  border: solid 0.5px grey;
  border-radius: 5px;
  font-size: 12px;
  line-height: 18px;
  padding: 0 5px;
  height: 18px;
}
</style>