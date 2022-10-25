<template>
  <div class="app-manager-container">
    <div class="operate-btn">
<!--      <el-button @click="RefreshAppList" type="primary">刷新</el-button>-->
<!--      <el-button @click="uploadDialogVisiable = true" type="primary">安装应用</el-button>-->
      <i class="iconfont icon-shuaxin  init-icon" @click="RefreshAppList"></i>
      <i class="iconfont icon-anzhuang  init-icon" @click="showUploadBlock = true"></i>
    </div>

    <transition name="upload-block">
      <div class="upload-block block-color" v-show="showUploadBlock" ref="dropZoneRef">
        <div class="upload-info">
          <i class="iconfont icon-apk apk-icon" ></i>
          <span>拖动apk文件到此处</span>
        </div>
      </div>
    </transition>

    <div class=" pb-5 app-table" ref="tableRegion">
      <el-table :data="device.list" stripe  :max-height="getTableHeight"
                :style="{width:getTableWidth}"
                class="table"
                v-loading="loading">
        <el-table-column prop="label" label="icon" :min-width="10">
          <template #default="scope">
            <el-image :src="getIconAddr(scope.row.packageName)" class="icon" fit="fill">
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>

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
<!--            <el-button class="text-sm" @click="uninstallApp(scope.row)" type="text" >卸载应用</el-button>-->
            <i class="iconfont icon-shanchu uninstall-icon" title="卸载" @click="uninstallApp(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>

</template>

<script setup lang="ts">
import {GetAppList} from "../../utils/api";
import {computed, onMounted, reactive, ref, unref, watch} from "vue";
import {CustomAdbClient} from "../../utils/adbClient";
import {DeviceStore} from "../../store/DeviceStore";
import {ElMessage, install, UploadProps, UploadUserFile} from "element-plus";
import {onClickOutside, useDropZone, useElementSize} from "@vueuse/core";
import {Picture} from "@element-plus/icons-vue";

const deviceStore = DeviceStore()
const client = CustomAdbClient.getClient()
let atxIP = ''
const GetDeviceIP = async ()=>{
  atxIP = await CustomAdbClient.GetCurrentDeviceIP()
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

// 加载
const loading = ref(true)


// 上传文件
const installLoading = ref(false)
const uploadDialogVisiable = ref(false)
const showUploadBlock = ref(false)

// 刷新应用列表
const RefreshAppList = async ()=>{
  console.log("刷新列表")
  loading.value = true
  GetAppList(await GetDeviceIP()).then(res=>{
    device.list = []
    res.data.forEach((item:Package)=>{
      device.list.push(item)
    })
    loading.value = false
  })
}

// 卸载app
const adbClient = CustomAdbClient.getClient()
const uninstallApp = (row:Package)=>{
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
watch(isOverDropZone,()=>{
  if(isOverDropZone.value){
    dropZoneRef.value?.classList.replace('block-color','block-over-color')
  }else{
    dropZoneRef.value?.classList.replace('block-over-color','block-color')
  }
})

onClickOutside(dropZoneRef, (event) => {
  showUploadBlock.value = false
})

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
  return `http://${atxIP}:7912/packages/${packageName}/icon`
}

// 监听元素尺寸
const tableRegion = ref(null)
const tableRegionSize = useElementSize(tableRegion)

// 计算当前视口适应的表格高度
const getTableHeight = computed(()=>{
  console.log(tableRegionSize.height.value - 50)
  return tableRegionSize.height.value - 50
})

const getTableWidth = computed(()=>{
  return tableRegionSize.width.value+'px'
})




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
  box-shadow:  2px 2px 2px #9f9f9f,
    -2px -2px 2px #ffffff;
}
//
//.app-table{
//  position: relative;
//  .el-table{
//    position: absolute;
//  }
//}

.app-manager-container{
  width: 100%;
  overflow: hidden;
}

.icon{
  height: 40px;
  border-radius: 5px;
}

.app-table{
  //height: calc(100vh - 100px);
  height: 100vh
}

.operate-btn{
  position: absolute;
  display: flex;
  flex-direction: column;
  right: 10px;
  bottom: 10px;
  z-index: 9999;
}

.init-icon{
  color: black;
  font-size: 25px;
  cursor: pointer;
}

@keyframes myRotate{
  0%{
    -webkit-transform: rotate(-90deg);
    transform-origin: 100% 100%;
  }
  100%{
    -webkit-transform: rotate(0deg);
    transform-origin: 100% 100%;
  }
}

@keyframes myRotate-leave{
  0%{
    -webkit-transform: rotate(0deg);
    transform-origin: 100% 100%;
  }
  100%{
    -webkit-transform: rotate(-90deg);
    transform-origin: 100% 100%;
  }
}

.block-color{
  background: #7bf9cb;
}

.block-over-color{
  background: #065F46;
}

.upload-block{
  position: absolute;
  right: 0;
  bottom: 0;
  height: 200px;
  width: 200px;
  z-index: 9999999;

  border-radius: 300px 0 0 0  ;
  box-shadow:  -9px -9px 18px #60c29e,
  9px 9px 18px #96fff8;
  overflow: hidden;

  .upload-info{
    display: flex;
    flex-direction: column;
    margin-top: 60px;
    margin-left: 20px;
    color:black;
  }

  .apk-icon{
    font-size: 50px;
  }

  .uninstall-icon{
    font-size: 20px;
    cursor: pointer;
  }
}

.upload-block-enter-active{
  animation-name:myRotate ;
  animation-duration: 1s;
  animation-iteration-count: 1;
}

.upload-block-leave-active{
  animation-name:myRotate ;
  animation-direction: reverse;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
}



</style>
