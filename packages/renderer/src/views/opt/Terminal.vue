<template>
  <div>
<!--    <el-button @click="initSocket">刷新</el-button>-->
    <div class="xterm-container">
      <div id="xterm" class="xterm" />
    </div>

    <div class="operation-btns">
<!--      <el-icon color="white"-->
<!--               size="30px"-->
<!--               title="重启终端"-->
<!--               @click="initSocket"><RefreshRight /></el-icon>-->
      <i class="iconfont icon-shuaxin text-white init-icon" @click="initSocket"></i>
    </div>

  </div>

</template>

<script setup lang="ts">
import 'xterm/css/xterm.css'
import {ITerminalOptions, Terminal} from 'xterm'
import {FitAddon} from 'xterm-addon-fit'
import {AttachAddon} from 'xterm-addon-attach'
import {onMounted} from "vue";
import {DeviceStore} from "../../store/DeviceStore";
import {CustomAdbClient} from "../../utils/adbClient";
import {RefreshRight} from "@element-plus/icons-vue"

// 初始化终端
let term:Terminal;
let websocket:WebSocket;
const deviceStore = DeviceStore()
const client = CustomAdbClient.getClient()

// 处理数据
const ab2str = (buf:Iterable<number>)=> {
  return String.fromCharCode.apply(null, new Uint8Array(buf) as unknown as number[]);
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

  websocket = new WebSocket("ws://" + await CustomAdbClient.GetCurrentDeviceIP() + ":7912/term");
  websocket.binaryType = 'arraybuffer'

  websocket.onopen = function(evt) {
    term = new Terminal({
      screenKeys: true,
      useStyle: true,
      cursorBlink: true,
      theme:{
        foreground:'white',
        background:'#2c3e50',
      }
    } as ITerminalOptions);
    term.loadAddon(fitAddon);

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

    term.open(document.getElementById('xterm')!);
    term.focus();
    fitAddon.fit()

    // TODO:自定义快捷键（ctrl+c ctrl+v）
    // term.attachCustomKeyEventHandler(()=>{
    //
    // })


    // $("#xterm").resize(function() {
    //   term.fit()
    // })

    websocket.onmessage = function(evt) {
      if (evt.data instanceof ArrayBuffer) {
        term.write(ab2str(evt.data as any));
      } else {
        alert(evt.data)
      }
    }
    websocket.onclose = function(evt) {
      term.write("Session terminated");
      term.dispose()
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

  window.addEventListener('resize',()=>{
    try {
      console.log('终端尺寸变化')
      fitAddon.fit()
    } catch (e) {
      console.log("e", e)
    }
  })
})


</script>

<style scoped lang="less">

.xterm-container{
  padding: 5px 5px 20px 5px;
  margin: 0 4px;
  border-radius: 5px;
  background: #2c3e50;
  box-shadow:  6px 6px 12px #bebebe,
  -6px -6px 12px #ffffff;
}

.xterm{
  height: calc(~"100vh - 120px");
  width: 100%;
}

.operation-btns{
  position: absolute;
  right: 5px;
  bottom: 10px;
}

.init-icon{
  width: 60px;
  height: 60px;
  font-size: 30px;
  cursor: pointer;
}

</style>
