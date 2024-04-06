<script setup>
import {Document, Promotion} from "@element-plus/icons-vue";
import {reactive, computed, ref} from "vue";
import {Quill, QuillEditor} from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css"
import ImageResize from "quill-image-resize-vue";
import {ImageExtend, QuillWatch} from "quill-image-super-solution-module";
import axios from "axios";
import {accessHeader, get, post} from "@/net/index.js";

const props = defineProps({
  show:Boolean,
  showModify: Function
});
const refEditor = ref();
const timePicker = ref('');
const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 3)
      return [start, end]
    },
  },
]
const editor = reactive({
  type: null,
  types:null,
  title: '',
  text: '',
  uploading: false
})
function initEditor(){
  refEditor.value.setContents('', 'user');
  timePicker.value = null;
  editor.title = '';
  editor.type = null;
}
function deltaToText(delta){        //统计字数用
  if(!delta.ops) return "";
  let str = "";
  for (let op of delta.ops)
    str += op.insert;
  return str.replace(/\s/g, "");
}
const contentLength = computed(() => deltaToText(editor.text).length)
function submitTask(){
  if (timePicker.value.length !== 2) {
    ElMessage.warning("请选择日期！")
    return;
  }
  const text = deltaToText(editor.text);
  if (text.length > 20000){
    ElMessage.warning("字数超出限制，无法发布主题");
    return;
  }
  if (!editor.title){
    ElMessage.warning("请填写标题！")
    return;
  }
  if (!editor.type){
    ElMessage.warning("请选择主题类型！")
    return;
  }
  post("/api/task/create-task", {
    type: editor.type,
    title: editor.title,
    content: editor.text,
    issueTime: timePicker.value[0],
    endTime: timePicker.value[1]
  }, () => {
    ElMessage.success("任务发布成功")
    props.showModify();
  })
}
const handleBeforeClose = () => {props.showModify()}
Quill.register("modules/imageResize", ImageResize)
Quill.register("modules/ImageExtend", ImageExtend)
const editorOption = {          //quill配置
  modules: {
    toolbar: {
      container: [
        "bold", "italic", "underline", "strike", "clean",
        {color:[]}, {'background': []},
        {size: ['small', false, 'large', 'huge']},
        {header: [1, 2, 3, 4, 5, 6, false]},
        {list: ['ordered', 'bullet']},
        {align:[]},"blockquote", "code-block", "link", "image",     //由于quill默认是base64的格式将图片保存起来，若这样保存则对我们的服务器压力很大
        {indent: '-1'}, {indent: '+1'}
      ],
      handlers:{
        'image': function (){
          QuillWatch.emit(this.quill.id)
        }
      }
    },
    imageResize: {
      modules: ['Resize', 'DisplaySize']
    },
    ImageExtend: {
      action: axios.defaults.baseURL + '/api/image/cache',
      name: 'file',         //表单名称
      size: 5,              //以M为单位， 最大5M
      loading: true,        //上传状态
      accept: 'image/png, image/jpeg',  //允许上传的格式
      response: (resp) => {             //返回的图片地址
        if (resp.data){
          return axios.defaults.baseURL + '/image' + resp.data
        }else {                         //错误处理
          return null;
        }
      },
      methods: 'POST',
      headers: xhr => {                 //token处理
        xhr.setRequestHeader('Authorization', accessHeader().Authorization);
      },
      start: () => editor.uploading = true,   //上传的时候
      success: () => {
        ElMessage.success('图片上传成功!')
        editor.uploading = false;
      },
      error: () => {
        ElMessage.error('图片上传失败!')
        editor.uploading = false;
      }
    }
  }
}
get('/api/task/types', data => editor.types = data);
</script>

<template>
  <div>
    <el-drawer :model-value="show"
               direction="btt"
               @open="initEditor"
               :close-on-click-modal="false"
               :before-close="handleBeforeClose"
               :size="650">
      <template #header>
        <div>
          <div style="font-weight: bold">任务发布</div>
          <div style="font-size: 13px">可根据需求发布任务，发布任务后可以查看发布记录</div>
        </div>
      </template>
      <div style="display: flex;gap: 10px; margin-bottom: 10px">
        <div style="width: 150px">
          <el-select placeholder="请选择任务类型" v-model="editor.type">
            <el-option v-for="item in editor.types" :key="item.id" :value="item.id" :label="item.name"/>
          </el-select>
        </div>
        <div style="flex: 1">
          <el-input v-model="editor.title" placeholder="请输入任务标题..." :prefix-icon="Document"/>
        </div>
      </div>
      <div class="block">
        <el-date-picker
            v-model="timePicker"
            type="datetimerange"
            :shortcuts="shortcuts"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
        />
      </div>
      <div style="margin-top: 15px;height: 428px;overflow: hidden;border-radius: 5px"
           v-loading="editor.uploading"
           element-loading-text="正在上传图片，请稍后"
      >
        <quill-editor v-model:content="editor.text" style="height: calc(100% - 45px - 42px)" placeholder="请输入任务内容..."
                      content-type="delta" ref="refEditor"
                      :options="editorOption"
        />
      </div>
      <div style="display: flex;justify-content: space-between;margin-top: 5px">
        <div style="color: grey;font-size: 13px">
          当前字数{{contentLength}}（最大支持2000字）
        </div>
        <div>
          <el-button @click="submitTask" type="success" plain :icon="Promotion">立即发布任务</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="less" scoped>
:deep(.el-drawer) {     //强制修改drawer的样式
  width: 800px;
  margin: auto;
  border-radius: 10px 10px 0 0 ;
}
:deep(.el-drawer__header){
  margin: 0;
}
:deep(.ql-toolbar){
  border-radius: 5px 5px 0 0;
  border-color: var(--el-border-color);
}
:deep(.ql-container){
  border-radius: 0 0 5px 5px;
  border-color: var(--el-border-color);
}
:deep(.ql-editor){
  font-size: 14px;
}
:deep(.ql-editor.ql-blank::before){
  color: var(--el-text-color-placeholder);
  font-style: normal;
}
</style>















