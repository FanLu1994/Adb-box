<template>
  <div>
    <el-button @click="initSocket">刷新</el-button>
    <div class="xterm-container">
      <div id="xterm" class="xterm" />
    </div>


  </div>

</template>

<script setup >
import 'xterm/css/xterm.css'
import {Terminal} from 'xterm'
import {FitAddon} from 'xterm-addon-fit'
import {AttachAddon} from 'xterm-addon-attach'
import {onMounted} from "vue";
import {DeviceStore} from "../../store/DeviceStore";
import {CustomAdbClient} from "../../utils/adbClient";

// 初始化终端
let term;
let websocket;
const deviceStore = DeviceStore()
const client = CustomAdbClient.getClient()
const GetDeviceIP = async ()=>{
  let ip = ""
  let ipInfo = await client.getIpAddress(deviceStore.CurrentDevice.id)
  let ipArray = ipInfo.split("\n")
  if(ipArray.length>1){
    ip =  ipInfo.split("\n")[1]
  }else{
    ip =  ipInfo.split("\n")[0]
  }
  return ip
}

// 处理数据
const ab2str = (buf)=> {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}


// 初始化socket连接
const fitAddon = new FitAddon();
const initSocket = async () => {
  if(websocket){
    websocket.close()
  }
  if(term){
    term.dispose()
  }

  websocket = new WebSocket("ws://" + await GetDeviceIP() + ":7912/term")
  websocket.binaryType = 'arraybuffer'

  websocket.onopen = function(evt) {
    term = new Terminal({
      screenKeys: true,
      useStyle: true,
      cursorBlink: true,
      lineHeight:30,
      theme:{
        foreground:'white',
        background:'#2c3e50',
      }
    });
    term.loadAddon(fitAddon);
    term.loadAddon(fullscreen)

    term.onData(function(data) {
      websocket.send(new TextEncoder().encode("\x00" + data));
    });
    term.onResize( function(evt) {
      websocket.send(new TextEncoder().encode("\x01" + JSON.stringify({
        cols: evt.cols,
        rows: evt.rows
      })))
    });
    term.onTitleChange( function(title) {
      document.title = title;
    });

    term.open(document.getElementById('xterm'));
    term.focus();
    fitAddon.fit()
    // $("#xterm").resize(function() {
    //   term.fit()
    // })

    websocket.onmessage = function(evt) {
      if (evt.data instanceof ArrayBuffer) {
        term.write(ab2str(evt.data));
      } else {
        alert(evt.data)
      }
    }
    websocket.onclose = function(evt) {
      term.write("Session terminated");
      term.destroy();
    }
    websocket.onerror = function(evt) {
      if (typeof console.log == "function") {
        console.log(evt)
      }
    }
  }

}

onMounted(async ()=>{
  await initSocket()

  window.onresize(()=>{
    try {
      fitAddon.fit()
    } catch (e) {
      console.log("e", e.message)
    }
  })
})


</script>

<style scoped>

.xterm-container{
  padding: 0 5px;
  margin: 0 4px;
  border-radius: 5px;
  background: #2c3e50;
  box-shadow:  6px 6px 12px #bebebe,
  -6px -6px 12px #ffffff;
}

.xterm{
  height: 600px;
}

</style>