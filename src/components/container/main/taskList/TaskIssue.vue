<script setup>
import {Document, Promotion} from "@element-plus/icons-vue";
import {reactive, computed, ref} from "vue";
import {Delta, Quill, QuillEditor} from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css"
import ImageResize from "quill-image-resize-vue";
import {ImageExtend, QuillWatch} from "quill-image-super-solution-module";
import axios from "axios";
import {accessHeader, post} from "@/net/index.js";
import {useUserInfoStore} from "@/store/index.js";

const store = useUserInfoStore();
const props = defineProps({
  show:Boolean,
  defaultTitle:{
    default: '',
    type: String
  },
  defaultText:{
    default: '',
    type: String
  },
  defaultType:{
    default: null,
    type: Object
  },
  defaultTimePicker:{
    default:[],
    type: Object
  },
  submitButton:{
    default: '立即发布',
    type: String
  },
  submit:{
    default: (editor, success) => {
      post("/api/task/create-task", {
        type: editor.type.id,
        title: editor.title,
        content: editor.text || {ops:[{insert:"无\n"}]},
        issueTime: editor.timePicker[0],
        endTime: editor.timePicker[1]
      }, () => {
        ElMessage.success("任务发布成功")
        success()
      })
    },
    type: Function
  }
});
const emits = defineEmits(['close', 'success']);
const refEditor = ref();
const defaultTime2= [
    new Date(),
    new Date()
] // '12:00:00', '08:00:00'
const shortcuts = [
  {
    text: '1 minute',
    value: () => {
      const end = new Date()
      const start = new Date()
      end.setMinutes(start.getMinutes() + 1)
      return [start, end]
    },
  },
  {
    text: '10 minutes',
    value: () => {
      const end = new Date()
      const start = new Date()
      end.setMinutes(start.getMinutes() + 10)
      return [start, end]
    },
  },
  {
    text: '1 hour',
    value: () => {
      const end = new Date()
      const start = new Date()
      end.setHours(start.getHours() + 1)
      return [start, end]
    },
  },
  {
    text: 'tomorrow',
    value: () => {
      const end = new Date()
      const start = new Date()
      end.setDate(start.getDay() + 1)
      return [start, end]
    },
  },
  {
    text: 'next week',
    value: () => {
      const end = new Date()
      const start = new Date()
      end.setDate(start.getDate() + 7)
      return [start, end]
    },
  },
]
const editor = reactive({
  type: null,
  title: '',
  text: '',
  uploading: false,
  timePicker: []
})
function initEditor(){
  if (props.defaultText)
    editor.text = new Delta(JSON.parse(props.defaultText));
  else
    refEditor.value.setContents('', 'user');
  editor.timePicker = props.defaultTimePicker;
  editor.title = props.defaultTitle;
  editor.type = props.defaultType;
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
  if (editor.timePicker.length !== 2) {
    ElMessage.warning("请选择日期！")
    return;
  }else if (editor.timePicker[1].getTime() < new Date().getTime()){
    ElMessage.warning("截止时间不能晚于当前时间！")
    return;
  }
  const text = deltaToText(editor.text);//=== "" ? "无~" : editor.text
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
  props.submit(editor, () => emits('success'))
}
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
</script>

<template>
  <div>
    <el-drawer :model-value="show"
               direction="btt"
               @open="initEditor"
               :close-on-click-modal="false"
               @close="emits('close')"
               :size="650">
      <template #header>
        <div>
          <div style="font-weight: bold">任务发布</div>
          <div style="font-size: 13px">可根据需求发布任务，发布任务后可以查看发布记录</div>
        </div>
      </template>
      <div style="display: flex;gap: 10px; margin-bottom: 10px">
        <div style="width: 150px">
          <el-select clearable placeholder="请选择任务类型" v-model="editor.type" value-key="id">
            <el-option v-for="item in store.task.types" :key="item.id" :value="item" :label="item.name">
              <div style="display: flex;align-items: center">
                <el-tag :color="item.color" style="margin-right: 8px" size="small"/>
                <span :style="{color : item.color}">{{item.name}}</span>
              </div>
            </el-option>
            <template #prefix>
              <el-tag :color="!!editor.type ? editor.type.color : null"/>
            </template>
          </el-select>
        </div>
        <div style="flex: 1">
          <el-input v-model="editor.title" placeholder="请输入任务标题..." :prefix-icon="Document"/>
        </div>
      </div>
      <div class="block">
        <el-date-picker
            v-model="editor.timePicker"
            type="datetimerange"
            :shortcuts="shortcuts"
            :default-time="defaultTime2"
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
          <el-button @click="submitTask" type="success" plain :icon="Promotion">{{submitButton}}</el-button>
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
.el-tag {
  border: none;
  aspect-ratio: 1;
}
</style>















