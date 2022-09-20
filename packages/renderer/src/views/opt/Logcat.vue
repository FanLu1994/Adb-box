<template>
  <div class="log-container">
    <div class="flex">
      <el-button @click="startLogcat">开启日志</el-button>
      <el-button @click="stopLogcat">关闭日志</el-button>
      <el-select v-model="targetLogLevel">
        <el-option v-for="(item,index) in logLevel"
                   :key="item.level"
                   :label="item.level"
                   :value="item.level"
                   v-html="
                      `<span style='color:${item.color}'>${
                        item.level}</span>`">
        </el-option>
      </el-select>
      <el-input v-model="searchTarget" placeholder="请输入筛选内容" class="w-1/4"></el-input>
    </div>
    <div class="logcat-window">
      <p v-for="(entry,index) in logCatInfo.list" >
        {{dateFormat(entry.date)}}
        {{entry.priority}}
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
  level:string,
  color:string,
}

const logLevel = ref([
  {
    level:'debug',
    color:'#10B981'
  },
  {
    level:'info',
    color:'#3B82F6'
  },
  {
    level:'warn',
    color:'#F59E0B'
  },
  {
    level:'error',
    color:'#EF4444'
  },
  {
    level:'fatal',
    color:'#000000'
  }
])
const targetLogLevel = ref('debug')

const getColor = (level:string)=>{
  switch (level) {
    case 'error':
      return '#EF4444'
    case 'fatal':
      return '#EF4444'
    default:
      return 'white'
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
  // 清理logcat缓存
  await client.execDevice(deviceStore.CurrentDevice.id,"logcat -c")
  await client.openLogcat(deviceStore.CurrentDevice.id)
  reader = await client.openLogcat(deviceStore.CurrentDevice.id)

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