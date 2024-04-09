<script setup>
import {get, post} from "@/net/index.js"
import {useUserInfoStore} from "@/store/index.js";
import {InfoFilled} from '@element-plus/icons-vue'
import {ref, reactive} from 'vue';
import {ELNOTIFICATION_OFFSET, confirmType} from "@/utils/constUtil.js";
import {validatePhone, validateQQ, validateSid} from "@/utils/validateRules.js";

const tableLayout = ref('fixed');
const store = useUserInfoStore();
let rowEdited = null;
let confirmNum = null;
const tableRef = ref();
const DialogFormRef = ref();
const dialogTableVisible = ref(false)
const postBox = [
  {
    url: '/student/save-student',
    successMsg: '修改成功',
    failureMsg: '修改失败',
  },
  {
    url: '/student/insert-student',
    successMsg: '添加成功',
    failureMsg: '添加失败',
  }
];
const dialogForm = reactive([{
  name: '',
  sid: '',
  oldSid: '',
  gender: 0,
  dormitory: '',
  room: '',
  qq: '',
  email: '',
  phone: '',
  classroom: 0
}]);
const newDormitoryEnum = (()=>{
  let list =[];
  for (let dormitoryEnumKey in store.student.dormitoryEnum) {
    list.push({
      label: store.student.dormitoryEnum[dormitoryEnumKey],
      value: dormitoryEnumKey
    })
  }
  return list
})();
const rule = {
  sid: [{validator: validateSid, message: '请输入学号', trigger: ['blur', 'change']}],
  name: [{required: true, message: '请输入姓名', trigger: ['blur', 'change']}],
  room: [{required: true, message: '请输入房间号', trigger: ['blur', 'change']}],
  phone: [{validator: validatePhone, trigger: ['blur', 'change']}],
  qq: [{validator: validateQQ, message: '请输入QQ号', trigger: ['blur', 'change']}],
  email: [
    {required: true, message: '请输入邮件地址', trigger: 'blur'},
    {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
  ],
  dormitory: [{required: true, message: '请输入宿舍', trigger: ['blur', 'change']}],
  classroom: [{required: true, message: '请输入班级', trigger: ['blur', 'change']}],
  gender: [{required: true, message: '请选择性别', trigger: ['blur', 'change']}]
}
const handleInsert = () => {
  for (let dialogFormElementKey in dialogForm[0]) {
    if (typeof dialogForm[0][dialogFormElementKey] == 'string')
      dialogForm[0][dialogFormElementKey] = '';
    else 
      dialogForm[0][dialogFormElementKey] = null;
  }
  dialogTableVisible.value = true;
  confirmNum = confirmType.insert;
}
const handleEdit = (row) => {
  rowEdited = row;
  dialogForm[0].oldSid = row.sid;
  for (let rowKey1 in row) {
    if (dialogForm[0].hasOwnProperty(rowKey1))
      dialogForm[0][rowKey1] = row[rowKey1];
  }
  dialogTableVisible.value = true;
  confirmNum = confirmType.edit;
}
const confirmEditOrInsert = () => {
  DialogFormRef.value.validate(valid => {
    if (valid) {
      const {url, successMsg, failureMsg} = postBox[confirmNum];
      post(url, dialogForm[0], () => {
        ElNotification({
          type: 'success',
          message: `${successMsg}`,
          duration: 3000,
          offset: ELNOTIFICATION_OFFSET
        });
        if (confirmNum === confirmType.edit){       //只有修改时才修改前端代码
          for (let key1 in dialogForm[0]) {     //修改前端代码
            if (rowEdited.hasOwnProperty(key1))
              rowEdited[key1] = dialogForm[0][key1];
          }
        }
        dialogTableVisible.value = false;
      }, (msg) => {
        ElNotification({
          type: 'error',
          message: `${failureMsg}，原因：${msg}`,
          duration: 3000,
          offset: ELNOTIFICATION_OFFSET
        })
      })
    }
  })
}
const handleDelete = (sid, name) => {        //删除一个
  store.student.studentList = store.student.studentList.filter((item) => {
    return item.sid !== sid;
  })
  post("/student/delete-student", [sid], () => {
    ElNotification({
      type: 'success',
      message: `成功删除${sid}${name}`,
      duration: 3000,
      offset: ELNOTIFICATION_OFFSET
    })
  })
}
const delSelected = () => {               //删除选中
  let rows = tableRef.value.getSelectionRows();   //获取勾选的row
  let list = [];
  for (let i = 0; i < rows.length; i++) {
    list.push(rows[i].sid)
  }
  post("/student/delete-student", list, (data) => {
    ElMessage.success(data);
  })
}
const rowKey = (row) => {           //用于生成Key
  return row.sid;
}
get(`/student/all-info?year=2023&semester=2`, (data) => {     //后端通过id来辨识是哪个账户发送的
  store.student.studentList = data.studentList;
  store.student.learningDoneRate = data.map["1"];
  store.student.dormitoryDoneRate = data.map["2"];
});

</script>
<template>
  <div class="outerBox">
    <div class="globalSettings">
      <div style="width: 80%;height: 70%;background-color: red">
        <el-button @click="delSelected">删除选中</el-button>
        <el-button @click="handleInsert">添加学生</el-button>
      </div>
    </div>
    <div class="tableBox">
      <el-table :data="store.student.studentList" style="width: 100%"
                :table-layout="tableLayout" stripe border highlight-current-row height="calc(100vh - 55px - 60px)"
                ref="tableRef"
                :row-key="rowKey"
      >
        <el-table-column fixed type="selection"/>
        <el-table-column fixed prop="sid" sortable label="学号"/>
        <el-table-column fixed prop="name" label="姓名"/>
        <el-table-column #default="props" label="性别">{{ props.row.gender === 0 ? '男' : '女' }}</el-table-column>
        <el-table-column prop="classroom" sortable label="班级"/>
        <el-table-column #default="props" label="公寓">{{
            store.student.dormitoryEnum[props.row.dormitory]
          }}
        </el-table-column>
        <el-table-column prop="room" label="寝室"/>
        <el-table-column prop="phone" label="手机号"/>
        <el-table-column prop="qq" label="QQ号"/>
        <el-table-column prop="email" label="邮箱"/>
        <el-table-column #default="props" label="大学习完成率">{{ store.student.learningDoneRate[props.row.sid] || 0 }}
        </el-table-column>
        <el-table-column #default="props" label="查寝提交率">{{ store.student.dormitoryDoneRate[props.row.sid] || 0 }}
        </el-table-column>
        <el-table-column fixed="right" label="Operations">
          <template #default="props">
            <el-button link type="primary" size="small" @click="handleEdit(props.row)">Edit</el-button>
            <el-popconfirm
                width="220px"
                confirm-button-text="OK"
                cancel-button-text="No, Thanks"
                cancel-button-type="success"
                confirm-button-type="danger"
                :icon="InfoFilled"
                icon-color="#626AEF"
                :title="'确定删除'+ props.row.name + '的信息?'"
                @confirm="handleDelete(props.row.sid, props.row.name)"
            >
              <template #reference>
                <el-button link type="primary" size="small">Delete</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :width="'50%'" v-model="dialogTableVisible" :title="'编辑 ' + dialogForm[0].name + ' 的信息'" width="800">
      <el-form :model="dialogForm[0]" :rules="rule" ref="DialogFormRef" class="dialog-form" style="width: 100%" >
        <el-row class="dialog-row" :gutter="8" justify="space-between">
          <el-col :span="8">
            <el-form-item prop="sid" >
              <el-input
                  v-model="dialogForm[0].sid"
                  style="max-width: 600px"
                  placeholder="Please input"
              >
                <template #prepend>学号</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="name">
              <el-input
                  v-model="dialogForm[0].name"
                  style="max-width: 600px"
                  placeholder="Please input"
              >
                <template #prepend>姓名</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="room">
              <el-input
                  v-model="dialogForm[0].room"
                  style="max-width: 600px"
                  placeholder="Please input"
              >
                <template #prepend>寝室</template>
              </el-input>
            </el-form-item>

          </el-col>
        </el-row>
        <el-row class="dialog-row" :gutter="8" justify="space-between">
          <el-col :span="8">
            <el-form-item prop="phone">
              <el-input
                  v-model="dialogForm[0].phone"
                  style="max-width: 600px"
                  placeholder="Please input"
              >
                <template #prepend>手机</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="qq">
              <el-input
                  v-model="dialogForm[0].qq"
                  style="max-width: 600px"
                  placeholder="Please input"
              >
                <template #prepend>QQ</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="email">
              <el-input
                  v-model="dialogForm[0].email"
                  style="max-width: 600px"
                  placeholder="Please input"
              >
                <template #prepend>邮箱</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="dialog-row" :gutter="8" justify="space-between">
          <el-col :span="8">
            <el-form-item prop="gender">
              <el-select v-model="dialogForm[0].gender" placeholder="Select" style="width: 240px">
                <template style="background-color: #606266" #prefix>性别</template>
                <el-option
                    v-for="item in [{label: '男', value: 0}, {label: '女', value: 1}]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="dormitory">
              <el-select v-model="dialogForm[0].dormitory" placeholder="Select" style="width: 240px">
                <template style="background-color: #606266" #prefix>公寓</template>
                <el-option
                    v-for="item in newDormitoryEnum"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="classroom">
              <el-select v-model="dialogForm[0].classroom" placeholder="Select" style="width: 240px">
                <template style="background-color: #606266" #prefix>班级</template>
                <el-option
                    v-for="item in [21,22,23,24]"
                    :label="item + '班'"
                    :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogTableVisible = false">Cancel</el-button>
          <el-button type="primary" @click="confirmEditOrInsert">Confirm</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.globalSettings {
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #13ce66;
}

.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
.dialog-row{
  margin-bottom: 5px;
}
.dialog-form{
  //& .el-form-item{
  //  margin: 0 10px 18px 0;
  //  //max-width: 33%
  //}
}

</style>