<script setup>
import taskIssue from "@/components/container/main/taskList/taskIssue.vue"
import {ref} from "vue";

const editorRef = ref(false);
const editorModify = ()=>{editorRef.value = false}

</script>

<template>
  <div>
    <el-button type="success" plain @click="editorRef = true">发布任务</el-button>
    <taskIssue :show="editorRef" :showModify="editorModify"/>
  </div>
</template>

<style lang="less" scoped>

</style>