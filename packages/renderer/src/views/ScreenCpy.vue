<template>
  <div class="screen-container" ref="screenCpy">
    <div class="reconnect">
<!--      <el-icon color="#000000"-->
<!--               size="30px"-->
<!--               @click="initMinicap"><RefreshRight /></el-icon>-->
      <el-button v-show="isHovered" text  @click="initMinicap" class="reconnect-btn"> reconnect </el-button>
    </div>
    <canvas id="canvas" >
    </canvas>


<!--    <div class="mask" v-show="showMask">-->

<!--    </div>-->

  </div>
</template>

<script setup lang="ts">

// 启动minicap
import {ElMessage} from "element-plus";
import {monitor, port} from "../utils/monitor";
import bus from "../utils/bus";
import {onMounted, ref} from "vue";
import {DeviceStore} from "../store/DeviceStore";
import {CustomAdbClient} from "../utils/adbClient";
import {RefreshRight} from "@element-plus/icons-vue";
import {useElementHover} from "@vueuse/core/index";

const deviceStore = DeviceStore()
const client = CustomAdbClient.getClient()

const startMinicap = async ()=>{
  let ip = ""
  let ipInfo = await client.getIpAddress(deviceStore.CurrentDevice.id)
  let ipArray = ipInfo.split("\n")
  if(ipArray.length>1){
    ip =  ipInfo.split("\n")[1]
  }else{
    ip =  ipInfo.split("\n")[0]
  }
  let ws = new WebSocket(`ws://${ip}:${port}/minicap`)

  ws.onclose = ()=>{
    // ElMessage.error({
    //   message:'minicap连接中断',
    //   duration:2000,
    //   showClose:true
    // })
  }

  ws.onopen=()=>{
    // ElMessage.success({
    //   message:'minicap已连接',
    //   duration:2000,
    //   showClose:true
    // })
  }
  let BLANK_IMG =
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
  let canvas = document.getElementById('canvas') as HTMLCanvasElement
  let g = canvas.getContext('2d')!

  ws.onmessage=(message)=>{
    let blob = new Blob([message.data], {type: 'image/jpeg'})
    let URL = window.URL || window.webkitURL
    let img = new Image()
    img.onload = function() {
      canvas.width = img.width
      canvas.height = img.height
      document.getElementById('canvas')!.style.height = 'auto'
      g.drawImage(img, 0, 0)
      img.onload = null
      img.src = BLANK_IMG
      g.scale(0.5,0.5)
      // img = null
      // u = null
      // blob = null
    }
    let u = URL.createObjectURL(blob)
    img.src = u
  }
}

// 监听悬浮
const screenCpy = ref(null)
const isHovered = useElementHover(screenCpy)

const initMinicap = ()=>{
  monitor.StartMonitor(deviceStore.CurrentDevice.id)
}

onMounted(()=>{
  bus.on('init-finished',()=>{
    startMinicap()
  })
})

</script>

<style scoped lang="less">
.screen-container{
  height: 100%;
  display: flex;
  flex-direction: column;
  //justify-content: center;
  align-items: center;
}

#canvas{
  border-radius: 20px;
  background: black;
  margin-top: 50px;
  box-shadow:  6px 6px 12px #bebebe,
    -6px -6px 12px #ffffff;
  padding: 5px;
  height: 700px;
  width: 340px;
}

.reconnect{
  color: #34D399;
  margin-bottom: 5px;
  position: absolute;
  top:10px;
}

.reconnect-btn{
}

</style>
