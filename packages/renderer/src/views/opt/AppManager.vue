<template>
  <div class="app-manager-container">
    <div class="flex items-center justify-end pr-5 mb-2">
      <el-button @click="RefreshAppList" type="primary">刷新</el-button>
      <el-button @click="uploadDialogVisiable = true" type="primary">安装应用</el-button>
    </div>


    <div class="flex justify-center items-center pb-5">
      <el-table :data="device.list" stripe  max-height="600" class="table" >
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
        width="50%"
    >
      <el-upload
          v-model:file-list="apkList"
          class="upload-demo"
          :auto-upload="false"
          drag
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          accept=".apk"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
         拖动文件或者 <em>点击上传按钮</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            仅支持apk文件
          </div>
        </template>
      </el-upload>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="uploadDialogVisiable = false">取消</el-button>
        <el-button type="primary" @click="onInstallApp"
        >确定</el-button
        >
      </span>
      </template>
    </el-dialog>
  </div>

</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import {GetAppList} from "../../utils/api";
import {onMounted, reactive, ref, unref} from "vue";
import {CustomAdbClient} from "../../utils/adbClient";
import {DeviceStore} from "../../store/DeviceStore";
import {ElMessage, UploadProps, UploadUserFile} from "element-plus";

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


// 上传文件
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

const adbClient = CustomAdbClient.getClient()
const uninstallApp = (row:Package)=>{
  console.log(row)
  adbClient.uninstall(deviceStore.CurrentDevice.id,row.packageName)
  RefreshAppList()
}

// 上传文件相关钩子
const apkList=ref<UploadUserFile[]>([])
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
      `The limit is 3, you selected ${files.length} files this time, add up to ${
          files.length + uploadFiles.length
      } totally`
  )
}


const onInstallApp = ()=>{
  console.log(unref(apkList)[0].raw?.path)
  client.install(deviceStore.CurrentDevice.id,unref(apkList)[0].raw?.path as string,(err)=>{
    console.log(err)
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