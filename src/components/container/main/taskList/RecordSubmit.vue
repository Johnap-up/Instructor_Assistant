<script setup>
import LightCard from "@/components/container/main/taskList/LightCard.vue";
import {Compass, Document, Edit, EditPen, Microphone, Picture} from "@element-plus/icons-vue";
import {ref, reactive, computed, defineProps} from "vue";
import {Quill, QuillEditor, Delta} from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css"
import {accessHeader, post} from "@/net/index.js";
import ImageResize from "quill-image-resize-vue";
import {ImageExtend, QuillWatch} from "quill-image-super-solution-module";
import axios from "axios";

const emits = defineEmits(['success']);
const props = defineProps({
  taskId: String,
  type: Number,
  defaultTitle: {
    default: '',
    type: String
  },
  defaultText: {
    default: '',
    type:String,
  },
  defaultShowText:{
    default: '点击提交...',
    type: String
  },
  handler:{
    default: (editor, taskId, type, success) => {
      post('/api/task/submit-record', {
        taskId: taskId,
        content: JSON.stringify(editor.text || {ops:[{insert:"无\n"}]}),
        title: editor.title
      },()=>{
        ElMessage.success('提交成功!');
        success();
        editor.show = false;
      })
    },
    type: Function
  }
})
const refEditor = ref();
const editor = reactive({
  show: false,
  text: !!props.defaultText ? new Delta(JSON.parse(props.defaultText)) : props.defaultText,
  title: props.defaultTitle,
  uploading: false,
});
function deltaToText(delta){        //统计字数用
  if(!delta.ops) return "";
  let str = "";
  for (let op of delta.ops)
    str += op.insert;
  return str.replace(/\s/g, "");
}
const contentLength = computed(() => deltaToText(editor.text).length)
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
function submitRecord(){
  const text = deltaToText(editor.text);
  if (text.length > 200){
    ElMessage.warning("字数超出限制！")
    return;
  }
  if (!editor.title){
    ElMessage.warning("请填写标题！");
    return;
  }
  props.handler(editor, props.taskId, props.type, () => {
    emits('success');
  });
}
</script>

<template>
  <light-card>
    <div class="create-topic" @click="editor.show = true;">
      <el-icon><EditPen/></el-icon> {{props.defaultShowText}}
    </div>
    <div style="margin-top: 10px;display: flex;gap: 13px;font-size: 18px;color: grey">
      <el-icon><Edit /></el-icon>
      <el-icon><Document /></el-icon>
      <el-icon><Compass /></el-icon>
      <el-icon><Picture /></el-icon>
      <el-icon><Microphone /></el-icon>
    </div>
  </light-card>
  <div>
    <el-drawer :model-value="editor.show"
               :close-on-click-modal="true"
               direction="btt" :size="450"
               title="提交..."
               @close="editor.show = false">
      <div>
        <div style="margin-bottom: 10px; max-width: 400px">
          <el-input v-model="editor.title" placeholder="请输入标题..." :prefix-icon="Document"/>
        </div>
        <div>
          <quill-editor style="height: 240px" content-type="delta" ref="refEditor"
                        :options="editorOption"
                        v-model:content="editor.text"/>
        </div>
        <div style="display: flex;justify-content: space-between;margin-top: 10px;text-align: right">
          <div style="color: grey;font-size: 13px">
            当前字数{{contentLength}}（最大支持200字）
          </div>
          <el-button @click="submitRecord" type="success" plain>发表评论</el-button>
        </div>
      </div>
    </el-drawer>
  </div>

</template>

<style lang="less" scoped>
.create-topic {
  background-color: #efefef;
  border-radius: 5px;
  height: 40px;
  color: grey;
  font-size: 14px;
  line-height: 40px;
  padding: 0 10px;

  &:hover {
    cursor: pointer;
  }
}
.dark{
  .create-topic {
    background-color: #232323;
  }
}
:deep(.el-drawer){
  width: 800px;
  margin: 20px auto;
  border-radius: 10px;
}
:deep(.el-drawer__header){
  margin: 0;
}
:deep(.el-drawer__body){
  padding: 10px;
}
</style>