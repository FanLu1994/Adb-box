<template>
  <div class="adb-cmd-container">
    <div class="adb-cmd" v-for="(adbCommand,index) in adbList" :key="index" @click="onExecAdbCmd(adbCommand)">
      {{adbCommand.title}}
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
  CustomAdbClient.execAdb(deviceStore.CurrentDevice.id,adbcmd.cmd)
}

</script>

<style scoped lang="less">
.adb-cmd-container{
  display: flex;
  padding: 10px 10px;

  .adb-cmd{
    box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    border: 1px solid #D1D5DB;
    //width: 100px;
    padding: 2px 5px;
    margin-right: 5px;
    cursor: pointer;

    &:hover{
      box-shadow: none;
    }
  }
}

</style>