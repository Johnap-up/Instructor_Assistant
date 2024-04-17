<script setup>
import { ref } from 'vue'
// import { CalendarDateType, CalendarInstance } from 'element-plus'

const calendar = ref();
const selectDate = (val) => {
  if (!calendar.value) return
  calendar.value.selectDate(val)
}
</script>

<template>
  <el-calendar style="width: 600px;height: 600px" ref="calendar">
    <template #header="{ date }">
      <span class="fm">Gods in The Heaven</span>
      <span>{{ date }}</span>
      <el-button-group>
        <el-button size="small" @click="selectDate('prev-year')">
          Previous Year
        </el-button>
        <el-button size="small" @click="selectDate('prev-month')">
          Previous Month
        </el-button>
        <el-button size="small" @click="selectDate('today')">Today</el-button>
        <el-button size="small" @click="selectDate('next-month')">
          Next Month
        </el-button>
        <el-button size="small" @click="selectDate('next-year')">
          Next Year
        </el-button>
      </el-button-group>
    </template>
  </el-calendar>
</template>

<style lang="less" scoped>

</style>