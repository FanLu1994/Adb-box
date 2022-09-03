<template>
  <div class="adb-cmd-container">
    <div class="adb-cmd" v-for="(adbCommand,index) in adbList"
         @mousedown="onLongPress(adbCommand.title)"
         @mouseup="mouseUp"
         :key="index" @click="onExecAdbCmd(adbCommand)">
      {{adbCommand.title}}
    </div>
  </div>

  <div class="adb-terminal-container">
    <div class="flex">
      <el-input placeholder=" 请输入adb命令(默认指定当前所选设备)"
                clearable
                v-model="inputCmd.cmd"
                @keyup.enter="onExecAdbCmd(inputCmd)">
        <template #prepend>
          {{ cmdPrefix }}
        </template>
      </el-input>
<!--      <el-button type="danger" @click="onSwitchDevice">指定设备</el-button>-->
      <el-button type="primary" @click="onExecAdbCmd(inputCmd)">执行</el-button>
      <el-button type="primary" @click="addCmdToList">添加到常用</el-button>
    </div>
    <div class="adb-terminal">
      <p v-for="(adbMsg,index) in msgList" :key="index" :class="`${adbMsg.type}-msg`">
        $ {{adbMsg.msg}}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {AdbCommand, AdbStore} from "../../store/AdbStore";
import {computed, reactive, ref, unref, watch} from "vue";
import {DeviceStore} from "../../store/DeviceStore";
import {CustomAdbClient} from "../../utils/adbClient";
import {ElMessage, ElMessageBox} from "element-plus";

const adbStore = AdbStore()
const deviceStore = DeviceStore()

interface AdbMsg{
  type:string,   // cmd:命令  info:命令执行结果  err:错误
  msg:string,
}
const inputCmd = reactive({
  title:'',
  cmd:'',
})
const msgList = ref([] as AdbMsg[])
const withDevice = ref(false)
const cmdPrefix = ref("adb")

const adbList = computed(()=>{
  return adbStore.AdbList
})

watch(deviceStore.CurrentDevice,()=>{
  ElMessage.error("test")
})

// 执行shell命令
const onExecAdbCmd = (adbcmd:AdbCommand)=>{
  console.log(deviceStore.CurrentDevice)
  if(!deviceStore.CurrentDevice){
    ElMessage.error({
      message:'未选择任何设备',
      showClose:true,
      duration:3000,
    })
  }

  if(!deviceStore.CurrentDevice){
    return
  }
  msgList.value.push({
    type:'cmd',
    msg:`adb -s ${deviceStore.CurrentDevice.id} ${adbcmd.cmd}`,
  })

  CustomAdbClient.execAdb(deviceStore.CurrentDevice.id,adbcmd.cmd,(err,res)=>{
    if(err){
      msgList.value.push({
        type:'err',
        msg:err.message,
      })
    }else{
      if(res===""){return}
      msgList.value.push({
        type:'info',
        msg:res,
      })
    }
  })
}

const onSwitchDevice = ()=>{
  withDevice.value = !unref(withDevice)
  if(withDevice){
    cmdPrefix.value = `adb -s ${deviceStore.CurrentDevice.id}`
  }else{
    cmdPrefix.value = `adb`
  }
}

// 添加常用命令
const addCmdToList = ()=>{
  if(inputCmd.cmd===""){
    return
  }

  ElMessageBox.prompt('请输入命令名', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /[^\s]/,
    inputErrorMessage: '该命名不可用',
  })
      .then(({ value }) => {
        adbStore.AddCommand(
            value,inputCmd.cmd
        )

      })
      .catch(() => {

      })
}

// 长按删除
let counter = setInterval(()=>{});
const onLongPress = (title:string)=>{
  console.log(title)
  let timeStart = new Date().getTime()
  counter = setInterval(()=>{
    let timeNow = new Date().getTime()
    if(timeNow-timeStart>1000){
      clearInterval(counter)
      delcmd(title)
    }
  },100)
}

const mouseUp = ()=>{
  clearInterval(counter)
}

// 删除cmd
const delcmd = (title:string)=>{
  ElMessageBox.confirm(
      '确定删除？',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
       adbStore.RemoveCommand(title)
      })
      .catch(() => {
      })
}

</script>

<style scoped lang="less">
.adb-cmd-container{
  display: flex;
  padding: 10px 10px;
  height: 100px;
  //background: #D1D5DB;
  border:1px solid #e4e7ed;
  margin: 5px 5px;
  border-radius: 10px;
  background: white;
  box-shadow:  6px 6px 12px #bebebe,
    -6px -6px 12px #ffffff;

  .adb-cmd{
    //box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.1);
    background: white;
    border-radius: 5px;
    border: 1px solid #D1D5DB;
    //width: 100px;
    padding: 2px 5px;
    margin-right: 5px;
    height: 30px;
    cursor: pointer;

    &:hover{
      box-shadow: none;
      background: #86EFAC;
    }
  }
}
.adb-terminal-container{
  padding: 0 10px;

  .adb-terminal{
    width: 100%;
    height: 500px;
    margin-top: 2px;
    background: #2c3e50;
    border-radius: 5px;
    color:white;
    text-align: left;
    padding: 0 5px;
    overflow-y:scroll;
    cursor:text;
    user-select: text;
    box-shadow:  6px 6px 12px #bebebe,
      -6px -6px 12px #ffffff;
  }
}

.cmd-msg{
  color:#CBD5E1;
}

.info-msg{
  color:#F9FAFB;
}

.err-msg{
  color:#EF4444;
}

</style>