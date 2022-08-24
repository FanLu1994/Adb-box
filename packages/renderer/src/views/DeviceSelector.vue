<template>
  <div>
    选择设备
    <el-select v-model="currentDevice" @change="changeDevice">
      <el-option v-for="(device,index) in deviceList"
                 :key="index"
                :label="`${device.product}-${device.model}`" :value="device.id"
                >
      </el-option>
    </el-select>
  </div>
  <div class="flex justify-between px-5 bg-red-400 text-white">
    <span>内核版本:{{deviceInfo.sdk}}</span>
    <span>系统版本:{{deviceInfo.system}}</span>
    <span>设备名:{{deviceInfo.name}}</span>
    <span>cpu:{{deviceInfo.board}}</span>
  </div>
</template>

<script lang="ts" setup>
import {DeviceStore} from "../store/DeviceStore";
import {computed, reactive, ref} from "vue";
import {CustomAdbClient} from "../utils/adbClient";

const deviceStore = DeviceStore()

const deviceList = computed(()=>{
  return deviceStore.DeviceList
})

const deviceInfo = reactive({
  sdk:0,
  system:0,
  name:'',
  board:'',
})

// 选择设备
const currentDevice = ref(null)
const changeDevice = async (deviceId:any)=>{
  deviceInfo.sdk = await CustomAdbClient.getDeviceProp(deviceId,'ro.build.version.sdk')
  deviceInfo.system = await CustomAdbClient.getDeviceProp(deviceId,'ro.build.version.release')
  deviceInfo.name = await CustomAdbClient.getDeviceProp(deviceId,'ro.product.marketname')
  deviceInfo.board = await CustomAdbClient.getDeviceProp(deviceId,'ro.product.cpu.abi')
  console.log(deviceInfo)
}

</script>

<style scoped>

</style>