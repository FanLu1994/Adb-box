<template>
  <div class="adb-cmd-container">
    <div class="adb-cmd" v-for="(adbCommand,index) in adbList" :key="index" @click="onExecAdbCmd(adbCommand)">
      {{adbCommand.title}}
    </div>
  </div>

  <div class="adb-terminal-container">
    <div class="flex">
      <el-input placeholder="请输入adb命令">
        <template #prefix>
          adb
        </template>
      </el-input>
      <el-button type="primary">执行</el-button>
      <el-button type="primary">添加到常用</el-button>
    </div>
    <div class="adb-terminal">

    </div>
  </div>
</template>

<script setup lang="ts">
import {AdbCommand, AdbStore} from "../../store/AdbStore";
import {computed} from "vue";
import {DeviceStore} from "../../store/DeviceStore";
import {CustomAdbClient} from "../../utils/adbClient";

const adbStore = AdbStore()
const deviceStore = DeviceStore()

const adbList = computed(()=>{
  return adbStore.AdbList
})

const onExecAdbCmd = (adbcmd:AdbCommand)=>{
  console.log(deviceStore.CurrentDevice)
  if(!deviceStore.CurrentDevice){
    return
  }
  CustomAdbClient.execAdb(deviceStore.CurrentDevice.id,adbcmd.cmd,(err,string)=>{
    console.log(string)
  })
}

</script>

<style scoped lang="less">
.adb-cmd-container{
  display: flex;
  padding: 10px 10px;
  height: 100px;
  //background: #D1D5DB;
  border-radius: 10px;
  border:1px solid #e4e7ed;
  box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.1);
  margin: 5px 5px;

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
  }
}

</style>