<template>
  <div class="log-container">
    <div class="flex">
      <el-button @click="startLogcat">开启日志</el-button>
      <el-select v-model="targetLogLevel">
        <el-option v-for="(item,index) in logLevel"
                   :key="index"
                   :label="item"
                   :value="item"
                   v-html="
                      `<span style='color:${getColor(item)}'>${
                        item}</span>`">
        </el-option>
      </el-select>
      <el-input v-model="searchTarget" placeholder="请输入筛选内容" class="w-1/4"></el-input>
    </div>
    <div class="logcat-window">

    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {CustomAdbClient} from "../../utils/adbClient";
import {DeviceStore} from "../../store/DeviceStore";
import {ElMessage} from "element-plus";
import LogcatReader from "adb-ts/lib/logcat/reader";
import {Priority} from "adb-ts";
import LogcatEntry from "adb-ts/lib/logcat/entry";

const logLevel = ref([
    'debug',
    'info',
    'warn',
    'error',
    'fatal'
])
const targetLogLevel = ref('debug')

const getColor = (level:string)=>{
  switch (level) {
    case 'debug':
      return "#10B981"
    case 'info':
      return "#3B82F6"
    case 'warn':
      return "#F59E0B"
    case 'error':
      return "#EF4444"
    case 'fatal':
      return "#000000"
    default:
      return "black"
  }
}

const searchTarget = ref('')
const client = CustomAdbClient.getClient()
const deviceStore = DeviceStore()
let reader:any
// 启动logcat
const startLogcat = async ()=>{
  if(!deviceStore.CurrentDevice){
    ElMessage.error({
      message:'请先选择设备',
      duration:2000,
      showClose:true,
    })
  }
  reader = await client.openLogcat(deviceStore.CurrentDevice.id)

  reader.on('entry',(entry:LogcatEntry)=>{
    console.log(entry.priority)
    console.log(entry.date)
    console.log(entry.pid)
    console.log(entry.tag)
    console.log(entry.message)
  })
}

// 设定级别
const setLevel = ()=>{
  reader.setFilter((entry:any)=>{
    return entry.prioritiy >= Priority.FATAL
  })
}

// 设定筛选字符串
const setSearchTarget = ()=>{
  reader.setFilter((entry:any)=>{
    return entry.message.includes(searchTarget.value)
  })
}


</script>

<style scoped lang="less">
.log-container{
  padding: 5px 10px;
}


.logcat-window{
  width: 100%;
  height: 600px;
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

</style>