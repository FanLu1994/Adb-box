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
</template>

<script lang="ts" setup>
import {DeviceStore} from "../store/DeviceStore";
import {computed, ref} from "vue";
import {CustomAdbClient} from "../utils/adbClient";

const deviceStore = DeviceStore()

const deviceList = computed(()=>{
  return deviceStore.DeviceList
})

// 选择设备
const currentDevice = ref(null)
const changeDevice = async (deviceId:any)=>{
  let result = await CustomAdbClient.getDeviceProp(deviceId,'ro.product.vndk.version')
  console.log(result)
}

</script>

<style scoped>

</style>