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
      <i class="iconfont icon-xiala detail-btn" @click="showDetail=!showDetail" ></i>
    </div>

    <div class="device-detail-info" v-if="showDetail" ref="detailInfo">
      <el-descriptions
          class="margin-top"
          title=""
          size="middle"
          :column="1"
          border
      >
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              UDID
            </div>
          </template>
          <span class="cursor-pointer" @click="copyInfo(deviceDetailInfo['udid'])">
            {{ deviceDetailInfo['udid'] }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              安卓版本
            </div>
          </template>
          <span class="cursor-pointer" @click="copyInfo(deviceDetailInfo['version'])">
            {{ deviceDetailInfo['version'] }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              序列号
            </div>
          </template>
          <span class="cursor-pointer" @click="copyInfo(deviceDetailInfo['serial'])">
            {{ deviceDetailInfo['serial'] }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              分辨率
            </div>
          </template>
          <span class="cursor-pointer" @click="copyInfo(deviceDetailInfo['display']['width']+'*'+deviceDetailInfo['display']['height'])">
                {{deviceDetailInfo['display']['width']}}*{{deviceDetailInfo['display']['height']}}
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              电池
            </div>
          </template>
          <span class="cursor-pointer" @click="copyInfo(deviceDetailInfo['battery']['level'])">
            {{deviceDetailInfo['battery']['level']}}
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              内存
            </div>
          </template>
          <span class="cursor-pointer" @click="copyInfo(deviceDetailInfo['memory']['around'])">
            {{deviceDetailInfo['memory']['around']}}
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              CPU核数
            </div>
          </template>
          <span class="cursor-pointer" @click="copyInfo(deviceDetailInfo['cpu']['cores'])">
            {{deviceDetailInfo['cpu']['cores']}}
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              CPU型号
            </div>
          </template>
          <span class="cursor-pointer" @click="copyInfo(deviceDetailInfo['cpu']['hardware'])">
            {{deviceDetailInfo['cpu']['hardware']}}
          </span>
        </el-descriptions-item>
      </el-descriptions>
<!--      <div class="device-info-item" v-for="(key,index) in Object.keys(deviceDetailInfo)">-->
<!--        {{key}}:{{deviceDetailInfo[key]}}-->
<!--      </div>-->
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
import {GetDeviceInfo} from "../utils/api";
import {onClickOutside} from "@vueuse/core";
import {clipboard} from "@electron/remote";
import {ElMessage} from "element-plus";

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
  getDeviceDetailInfo()
}


// 设备详细信息
const showDetail = ref(false)
const deviceDetailInfo = ref({
  udid:'',
  version:'',
  serial:'',
  display:{
    width:'',
    height:'',
  },
  battery:{
    level:'',
  },
  memory:{
    around:'',
  },
  cpu:{
    cores:'',
    hardware:'',
  },


})
const getDeviceDetailInfo = async ()=>{
  GetDeviceInfo(await CustomAdbClient.GetCurrentDeviceIP()).then(res=>{
    deviceDetailInfo.value = res.data
  })
}

// 关闭详情弹窗
const detailInfo = ref(null)
onClickOutside(detailInfo,(evt)=>showDetail.value = false)

const copyInfo = (info:string)=>{
  clipboard.writeText(info)
  ElMessage.success({
    message:'已复制到剪贴板',
    duration:1000,
    showClose:true,
  })
}

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

.detail-btn{
  cursor: pointer;
  &:hover{
    color:#6B7280;
  }

}

.device-detail-info{
  position: absolute;
  top:40px;
  left: 610px;
  padding: 10px 10px;
  border-radius: 17px;
  background: white;
  --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  //width: 500px;
  z-index: 99;
}

.device-info-item{
  text-align: left;
}

</style>