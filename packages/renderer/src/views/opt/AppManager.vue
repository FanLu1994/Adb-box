<template>
  <div class="app-manager-container">
    <div class="flex items-center justify-end pr-5 mb-2">
      <el-button @click="RefreshAppList" type="primary">刷新</el-button>
      <el-button @click="uploadDialogVisiable = true" type="primary">安装应用</el-button>
    </div>


    <div class="flex justify-center items-center pb-5">
      <el-table :data="device.list" stripe  max-height="600" class="table" >
        <el-table-column prop="label" label="icon" :min-width="10">
          <template #default="scope">
            <el-image :src="getIconAddr(scope.row.packageName)" class="w-5"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="label" label="包名" :min-width="10"/>
        <el-table-column prop="packageName" label="ID" :min-width="10"/>
        <el-table-column prop="mainActivity" label="主Activity"  :min-width="10"/>
        <el-table-column prop="versionName" label="版本名" :min-width="10"/>
        <el-table-column prop="versionCode" label="版本代码" :min-width="10"/>
        <el-table-column prop="size" label="体积" :min-width="10"/>
        <el-table-column prop="" label="操作" :min-width="10">
          <template #default="scope" >
            <el-button class="text-sm" @click="uninstallApp(scope.row)" type="text" >卸载应用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
        v-model="uploadDialogVisiable"
        :append-to-body="false"
        custom-class="rounded-3xl"
        title="安装应用"
        v-loading="installLoading"
        width="50%"
    >
      <div ref="dropZoneRef" class="flex flex-col w-full min-h-200px h-auto bg-gray-400/10 justify-center items-center mt-6">
        <div> isOverDropZone: <BooleanDisplay :value="isOverDropZone" /></div>
        <div class="flex flex-wrap justify-center items-center">
          <div v-for="(file, index) in filesData" :key="index" class="w-200px bg-black-200/10 ma-2 pa-6">
            <p>Name: {{ file.name }}</p>
            <p>path: {{ file.path }}</p>
            <p>Size: {{ file.size }}</p>
            <p>Type: {{ file.type }}</p>
            <p>Last modified: {{ file.lastModified }}</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>

</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import {GetAppList} from "../../utils/api";
import {onMounted, reactive, ref, unref} from "vue";
import {CustomAdbClient} from "../../utils/adbClient";
import {DeviceStore} from "../../store/DeviceStore";
import {ElMessage, install, UploadProps, UploadUserFile} from "element-plus";
import {useDropZone} from "@vueuse/core";

const deviceStore = DeviceStore()
const client = CustomAdbClient.getClient()
let atxIP = ''
const GetDeviceIP = async ()=>{
  if(atxIP===''){
    let ipInfo = await client.getIpAddress(deviceStore.CurrentDevice.id)
    let ipArray = ipInfo.split("\n")
    if(ipArray.length>1){
      atxIP =  ipInfo.split("\n")[1]
    }else{
      atxIP =  ipInfo.split("\n")[0]
    }
  }
  return atxIP
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


// 上传文件
const installLoading = ref(false)
const uploadDialogVisiable = ref(false)

// 刷新应用列表
const RefreshAppList = async ()=>{
  console.log("刷新列表")
  GetAppList(await GetDeviceIP()).then(res=>{
    console.log(res)
    console.log(res.data)
    device.list = []
    res.data.forEach((item:Package)=>{
      device.list.push(item)
    })
  })
}

// 卸载app
const adbClient = CustomAdbClient.getClient()
const uninstallApp = (row:Package)=>{
  console.log(row)
  adbClient.uninstall(deviceStore.CurrentDevice.id,row.packageName)
  RefreshAppList()
}

// 上传相关组件
const filesData = ref<{
  name: string;
  size: number;
  type: string;
  path: string;
  lastModified: number }[]>([])
function onDrop(files: File[] | null) {
  filesData.value = []

  // 判断是否是一个apk文件
  if(files && files.length==1 && files[0].name.endsWith('.apk')){
    // 安装文件
    onInstallApp(files[0].path)
  }else{
    ElMessage.error({
      message:'err',
      duration:1000,
    })
  }

  if (files) {
    console.log(files)
    filesData.value = files.map(file => ({
      name: file.name,
      size: file.size,
      path: file.path,
      type: file.type,
      lastModified: file.lastModified,
    }))
  }
}

const dropZoneRef = ref<HTMLElement>()
const {isOverDropZone} = useDropZone(dropZoneRef,onDrop)

const onInstallApp = (apkPath:string)=>{
  installLoading.value = true
  client.install(deviceStore.CurrentDevice.id,apkPath,(err)=>{
    console.log(err)
    if(err){
      ElMessage.error({
        message:err.message,
        showClose:true,
        duration:3000,
      })
    }else{
      ElMessage.success({
        message:"安装成功",
        showClose:true,
        duration:3000,
      })
    }

    installLoading.value = false
    uploadDialogVisiable.value = false
  })
}

const getIconAddr = (packageName:string)=>{
  console.log(GetDeviceIP())
  console.log(`http://${atxIP}:7912/packages/${packageName}/icon`)
  return `http://${atxIP}:7912/packages/${packageName}/icon`
}


onMounted( ()=>{
 RefreshAppList()
})

</script>

<style scoped lang="less">
.table{
  width: 100%;
  height: 100%;
  margin: 1px 5px;
  border-radius: 7px;
  background: #e0e0e0;
  box-shadow:  5px 5px 10px #9f9f9f,
    -5px -5px 10px #ffffff;
}

.app-manager-container{
  width: 100%;
}

</style>