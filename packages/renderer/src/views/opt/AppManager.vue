<template>
  <div class="app-manager-container">
    <el-button @click="RefreshAppList">刷新</el-button>

    <div class="flex justify-center items-center">
      <el-table :data="device.list" stripe  max-height="600" class="table" >
        <el-table-column prop="label" label="包名" :min-width="10"/>
        <el-table-column prop="packageName" label="ID" :min-width="10"/>
        <el-table-column prop="mainActivity" label="主Activity"  :min-width="10"/>
        <el-table-column prop="versionName" label="版本名" :min-width="10"/>
        <el-table-column prop="versionCode" label="版本代码" :min-width="10"/>
        <el-table-column prop="size" label="体积" :min-width="10"/>
        <el-table-column prop="" label="操作" :min-width="10"/>
      </el-table>
    </div>

  </div>

</template>

<script setup lang="ts">
import {GetAppList} from "../../utils/api";
import {onMounted, reactive} from "vue";
import {CustomAdbClient} from "../../utils/adbClient";
import {DeviceStore} from "../../store/DeviceStore";

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

interface Package{
  packageName:string,
  mainActivity:string,
  versionName:string,
  label:string,
  versionCode:number,
  size:number,
}
const temp:Package[] = []
const device = reactive({
  list:temp
})

// 刷新应用列表
const RefreshAppList = async ()=>{
  console.log("刷新列表")
  GetAppList(await GetDeviceIP()).then(res=>{
    console.log(res)
    console.log(res.data)
    res.data.forEach((item:Package)=>{
      device.list.push(item)
    })
  })
}


onMounted( ()=>{
 RefreshAppList()
})

</script>

<style scoped lang="less">
.table{
  width: 100%;
  height: 100%;
  margin: 1px 20px;
  border-radius: 7px;
  background: #e0e0e0;
  box-shadow:  5px 5px 10px #9f9f9f,
    -5px -5px 10px #ffffff;
}

.app-manager-container{
  width: 100%;
}

</style>