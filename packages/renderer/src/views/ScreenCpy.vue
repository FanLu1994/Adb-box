<template>
  <div class="screen-container">
    <canvas id="canvas" style="width: 320px;padding: 5px">
    </canvas>
  </div>
</template>

<script setup>

// 启动minicap
import {ElMessage} from "element-plus";
import {port} from "../utils/monitor";
import bus from "../utils/bus";
import {onMounted} from "vue";
import {DeviceStore} from "../store/DeviceStore";
import {CustomAdbClient} from "../utils/adbClient";

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
    ElMessage.error({
      message:'minicap连接中断',
      duration:2000,
      showClose:true
    })
  }

  ws.onopen=()=>{
    ElMessage.success({
      message:'minicap已连接',
      duration:2000,
      showClose:true
    })
  }
  let BLANK_IMG =
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
  let canvas = document.getElementById('canvas')
  let g = canvas.getContext('2d')

  ws.onmessage=(message)=>{
    let blob = new Blob([message.data], {type: 'image/jpeg'})
    let URL = window.URL || window.webkitURL
    let img = new Image()
    img.onload = function() {
      canvas.width = img.width
      canvas.height = img.height
      g.drawImage(img, 0, 0)
      img.onload = null
      img.src = BLANK_IMG
      g.scale(0.5,0.5)
      img = null
      u = null
      blob = null
    }
    let u = URL.createObjectURL(blob)
    img.src = u
  }
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
  justify-content: center;
  align-items: center;
}

</style>