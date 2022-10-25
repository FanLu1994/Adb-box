<template>
  <div class="adb-cmd-container">
    <div class="adb-cmd"
         v-for="(adbCommand,index) in adbList"
         @mousedown="onMouseDown(adbCommand,`adb-cmd-${index}`)"
         @mouseup="mouseUp(adbCommand,`adb-cmd-${index}`)"
         :id="`adb-cmd-${index}`"
         :key="index">
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
    <div class="adb-terminal" id="adb-terminal" ref="el">
      <p v-for="(adbMsg,index) in msgList" :key="index" :class="`${adbMsg.type}-msg`">
        $ {{adbMsg.msg}}
      </p>
      <div id="bottom-div"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {AdbCommand, AdbStore} from "../../store/AdbStore";
import {computed, nextTick, onActivated, onMounted, reactive, ref, toRefs, unref, watch} from "vue";
import {DeviceStore} from "../../store/DeviceStore";
import {CustomAdbClient} from "../../utils/adbClient";
import {ElMessage, ElMessageBox} from "element-plus";
import {useScroll} from "@vueuse/core";

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
  nextTick(scrollToBottom)

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
    nextTick(scrollToBottom)
  })
}

// 删除命令
const onDeleteCmd = (adbcmd:AdbCommand,id:string)=>{
  ElMessageBox.confirm(
      '确认删除？',
      '',
      {
        confirmButtonText:'确认',
        cancelButtonText:'取消',
        type:'warning',
      }
  ).then(()=>{
    adbStore.RemoveCommand(adbcmd.title)
    document.getElementById(id)!.classList.remove('adb-cmd-delete')
  }).catch(()=>{
    document.getElementById(id)!.classList.remove('adb-cmd-delete')
  })
}

// 滚动相关
const el = ref<HTMLElement | null>(null)
const { x, y, isScrolling, arrivedState, directions } = useScroll(el)
const { left, right, top, bottom } = toRefs(arrivedState)
const { left: toLeft, right: toRight, top: toTop, bottom: toBottom } = toRefs(directions)
watch(toTop,()=>{
  scrollToTop.value = true
})
watch(bottom,()=>{
  scrollToTop.value  = false
})
const scrollToTop = ref(false)
const scrollToBottom = ()=>{
  const ele = document.getElementById('adb-terminal')!
  // 当前滚动条在底部修改滚动条位置
  if (!unref(scrollToTop)) {
    // 新消息渲染完成，修改滚动条位置
    ele.scrollTop = ele.scrollHeight
  }
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
const longPress = ref(false)
let counter = setInterval(()=>{});
const onMouseDown = (adbcmd:AdbCommand,id:string)=>{
  let timeStart = new Date().getTime()
  counter = setInterval(()=>{
    let timeNow = new Date().getTime()
    if(timeNow-timeStart>500){
      longPress.value = true
      clearInterval(counter)
      console.log("触发删除")
      // 触发删除动画
      document.getElementById(id)!.classList.add('adb-cmd-delete')
    }else{
      longPress.value = false
    }
  },100)
}

const mouseUp = (adbcmd:AdbCommand,id:string)=>{
  if(document.getElementById(id)!.classList.contains('adb-cmd-delete')){
    onDeleteCmd(adbcmd,id)
  }

  clearInterval(counter)
  // 短按触发命令执行
  if(!longPress.value){
    onExecAdbCmd(adbcmd)
  }
  longPress.value = false
}

// 删除cmd
const delcmd = (title:string)=>{
  // ElMessageBox.confirm(
  //     (
  //         mess
  //     )
  // )
  //     .then(() => {
  //      adbStore.RemoveCommand(title)
  //     })
  //     .catch(() => {
  //     })
}

onActivated(()=>{
  scrollToTop.value = false
  scrollToBottom()
})

onMounted(()=>{
  scrollToBottom()
})

</script>

<style scoped lang="less">
.adb-cmd-container{
  display: flex;
  padding: 2px 5px 2px 5px;
  height: 100px;
  //background: #D1D5DB;
  border:1px solid #e4e7ed;
  margin: 1px 5px;
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
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;

    &:hover{
      box-shadow: none;
      background: #E5E7EB;
    }
  }

  //.adb-delete{
  //  &:after{
  //    content:" x";
  //    color:red;
  //  }
  //}
}
.adb-terminal-container{
  padding: 5px 5px 20px 5px;

  .adb-terminal{
    width: 100%;
    height: calc(~"100vh - 260px");
    margin-top: 2px;
    background: #2c3e50;
    border-radius: 5px;
    color:white;
    text-align: left;
    padding-top: 5px;
    padding-bottom: 0;
    overflow-y:scroll;
    cursor:text;
    user-select: text;
    overflow-y: scroll;
    box-shadow:  6px 6px 12px #bebebe,
      -6px -6px 12px #ffffff;
    scroll-behavior: smooth;
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

.adb-cmd-delete{
  animation: shake 800ms ease-in-out ;
  animation-iteration-count: infinite;
}

@keyframes shake { /* 水平抖动，核心代码 */
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(+1px, 0, 0); }
  30%, 70% { transform: translate3d(-1px, 0, 0); }
  40%, 60% { transform: translate3d(+1px, 0, 0); }
  50% { transform: translate3d(-1px, 0, 0); }
}

</style>
