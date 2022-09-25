<template>
  <div class="log-container">
    <div class="flex">
      <el-button @click="startLogcat">开启日志</el-button>
      <el-button @click="stopLogcat">关闭日志</el-button>
      <el-button @click="clearLogcat">清空日志</el-button>
      <el-select v-model="targetLogLevel" @change="startLogcat">
        <el-option v-for="(item,index) in logLevel"
                   :key="item.level"
                   :label="item.label"
                   :value="item.level"
                   v-html="
                      `<span style='color:${item.color}'>${
                        item.label}</span>`">
        </el-option>
      </el-select>
      <el-input v-model="searchTarget"
                placeholder="请输入筛选内容" class="w-1/4"
                @change="startLogcat"></el-input>
    </div>
    <div class="logcat-window text-base leading-5">
      <p v-for="(entry,index) in logCatInfo.list" :style="{color:getColor(entry.priority)}">
        {{dateFormat(entry.date)}}
        {{getLabel(entry.priority)}}
        {{entry.message}}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {CustomAdbClient} from "../../utils/adbClient";
import {DeviceStore} from "../../store/DeviceStore";
import {ElMessage} from "element-plus";
import LogcatReader from "adb-ts/lib/logcat/reader";
import {Priority} from "adb-ts";
import LogcatEntry from "adb-ts/lib/logcat/entry";

interface CustomLevel{
  label:string,
  level:number,
  color:string,
}

const logLevel = ref([
  {
    label:'default',
    level:1,
    color:'#10B981'
  },
  {
    label:'verbose',
    level:2,
    color:'#10B981'
  },
  {
    label:'debug',
    level:3,
    color:'#10B981'
  },
  {
    label:'info',
    level:4,
    color:'#3B82F6'
  },
  {
    label:'warn',
    level:5,
    color:'#F59E0B'
  },
  {
    label:'error',
    level:6,
    color:'#EF4444'
  },
  {
    label:'fatal',
    level:7,
    color:'#000000'
  }
])
const targetLogLevel = ref(3)
const searchTarget = ref('')

// 不同颜色区分日志
const getColor = (level:number)=>{
  switch (level) {
    case Priority.WARN:
      return '#F59E0B'
    case Priority.ERROR:
      return '#EF4444'
    case Priority.FATAL:
      return '#EF4444'
    default:
      return 'white'
  }
}

// 日志级别转换为
const getLabel = (level:number)=>{
  switch (level) {
    case Priority.DEFAULT:
      return 'DEFAULT'
    case Priority.VERBOSE:
      return 'VERBOSE'
    case Priority.DEBUG:
      return 'DEBUG'
    case Priority.INFO:
      return 'INFO'
    case Priority.WARN:
      return 'WARN'
    case Priority.ERROR:
      return 'ERROR'
    case Priority.FATAL:
      return 'FATAL'
    case Priority.SILENT:
      return 'SILENT'
    default:
      return level
  }
}

const dateFormat = (rawDate:string)=>{
  const date = new Date(rawDate)
  const res = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+
      ' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
  return res
}

const logList:LogcatEntry[] = []
const logCatInfo = reactive({
  list:logList
})
const maxLength = 10000
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
  if(reader){
    (reader as LogcatReader).end()
  }

  // 清理logcat缓存
  console.log("清理logcat缓存")
  await client.execDevice(deviceStore.CurrentDevice.id,"logcat -c")
  await client.openLogcat(deviceStore.CurrentDevice.id)
  reader = await client.openLogcat(deviceStore.CurrentDevice.id)

  console.log("设置level:",targetLogLevel.value)
  reader.setFilter((entry:any)=>{
    return entry.prioritiy >= targetLogLevel.value
  })

  console.log("设置筛选:",searchTarget.value)
  reader.setFilter((entry:any)=>{
    return entry.message.includes(searchTarget.value)
  })

  reader.on('entry',(entry:LogcatEntry)=>{
    if(logCatInfo.list.length>=maxLength){
      logCatInfo.list.splice(0,1)
    }
    logCatInfo.list.push(entry)
  })
}

const stopLogcat = ()=>{
  if(reader) {
    (reader as LogcatReader).end()
  }
}

const clearLogcat = ()=>{
  logCatInfo.list = []
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
  height: calc(~"100vh - 160px");
  margin-top: 2px;
  background: #2c3e50;
  border-radius: 5px;
  color:white;
  text-align: left;
  padding: 5px 5px 20px 5px;
  overflow-y:scroll;
  cursor:text;
  user-select: text;
  box-shadow:  6px 6px 12px #bebebe,
    -6px -6px 12px #ffffff;
}

</style>