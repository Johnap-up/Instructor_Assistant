<script setup>
defineProps({
  icon: Object,
  title: String,
  desc: String,
  cardHeaderStyle:{
    default:{
      paddingBottom: '5px',
      marginBottom: '10px',
    },
    type: Object
  }
})
</script>

<template>
  <div class="card">
    <div class="card-header" :style="cardHeaderStyle">
      <div>
        <el-icon v-if="!!icon" style="margin-right: 3px;translate: 0 2px">
          <component :is="icon"/>
        </el-icon>
        {{title}}
      </div>
      <div></div>
    </div>
    <slot/>
  </div>
</template>

<style lang="less" scoped>
.card{
  border: solid 1px var(--el-border-color);
  background-color: var(--el-bg-color);
  box-sizing: border-box;
  min-height: 20px;
  padding: 10px;
  box-shadow: 0 0 10px 0 rgba(152, 108, 108, 0.2);
}

.card-header{
  //border-bottom: solid 1px var(--el-border-color);
  //padding-bottom: 5px;
  //margin-bottom: 10px;

  &>:first-child{
    font-size: 18px;
    font-weight: bold;
  }

  &>:last-child{
    font-size: 13px;
    color: grey;
  }
}
</style>