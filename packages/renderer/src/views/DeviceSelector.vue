<template>
  <div class="flex items-center space-x-1 device-selector">
    <el-select v-model="currentDevice" @change="changeDevice" class="selector" size="large">
      <el-option v-for="(device,index) in deviceList"
                 :key="index"
                :label="`${device.product}-${device.model}`" :value="device.id"
                >
      </el-option>
    </el-select>
    <div class="device-simple-info space-x-4" v-show="currentDevice!=null">
      <span>设备名: {{deviceInfo.name}}</span>
<!--      <span>生产厂商: {{deviceInfo.brand}}</span>-->
      <span>内核版本: {{deviceInfo.sdk}}</span>
      <span>安卓版本: {{deviceInfo.system}}</span>
<!--      <span>CPU: {{deviceInfo.board}}</span>-->
      <i class="iconfont icon-xiala"></i>
    </div>


  </div>
<!--  <div class="flex justify-between px-5 bg-red-400 text-white">-->
<!--    <span>生产厂商:{{deviceInfo.brand}}</span>-->
<!--    <span>内核版本:{{deviceInfo.sdk}}</span>-->
<!--    <span>系统版本:{{deviceInfo.system}}</span>-->
<!--    <span>设备名:{{deviceInfo.name}}</span>-->
<!--    <span>cpu:{{deviceInfo.board}}</span>-->
<!--  </div>-->
</template>

<script lang="ts" setup>
import {DeviceStore} from "../store/DeviceStore";
import {computed, reactive, ref} from "vue";
import {CustomAdbClient} from "../utils/adbClient";
import {monitor} from "../utils/monitor";
import {View} from '@element-plus/icons-vue'

const deviceStore = DeviceStore()

const deviceList = computed(()=>{
  let res = deviceStore.DeviceList
  if(res.length===0){
    currentDevice.value = null
  }
  return res
})

const deviceInfo = reactive({
  sdk:0,
  system:0,
  name:'',
  board:'',
  brand:''
})

// 选择设备
const currentDevice = ref(null)
const changeDevice = async (deviceId:any)=>{
  deviceInfo.sdk = await CustomAdbClient.getDeviceProp(deviceId,'ro.build.version.sdk')
  deviceInfo.system = await CustomAdbClient.getDeviceProp(deviceId,'ro.build.version.release')
  deviceInfo.name = await CustomAdbClient.getDeviceProp(deviceId,'ro.product.marketname')
  deviceInfo.board = await CustomAdbClient.getDeviceProp(deviceId,'ro.product.cpu.abi')
  deviceInfo.brand = await CustomAdbClient.getDeviceProp(deviceId,'ro.product.manufacturer')
  console.log(deviceInfo)
  deviceStore.SetCurrentDevice(deviceId)
  monitor.StartMonitor(deviceStore.CurrentDevice.id)
}

// const startMonitor = ()=>{
//   monitor.StartMonitor(deviceStore.CurrentDevice.id)
// }

</script>

<style scoped lang="less">
.device-selector{
  padding: 1px 2px 1px 2px;
}

.device-simple-info{
  color:black;
  display: flex;
  align-items: center;
}


</style>