<template>
  <div class="flex justify-center	">
    <div class="flex items-center  menus">
      <div v-for="item in menu" class="menu-item space-x-2" :class="[item.path===currentMenu?'menu-active':'']"
           @click="onClickMenu(item)">
        <i class="iconfont mr-1" :class="item.icon" ></i>
        {{item.title}}
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>

import {useRouter} from "vue-router";
import {Notification,Folder} from '@element-plus/icons-vue'
import {computed} from "vue";

interface menuItem{
  title:string,
  path:string,
}

const menu = [
  {
    title:'Adb命令',
    path:'/adb',
    icon:'icon-ic_adb',
  },
  {
    title:'终端',
    path:'/terminal',
    icon:'icon-zhongduan',
  },
  {
    title:'日志',
    path:'/logcat',
    icon:'icon-rizhi',
  },
  {
    title:'应用管理',
    path:'/appManager',
    icon:'icon-apps',
  },
]

const router = useRouter()
const onClickMenu = (menuItem:menuItem)=>{
  router.push(menuItem.path)
}

// 当前的路径
const currentMenu = computed(()=>{
  return router.currentRoute.value.path
})

</script>

<style scoped lang="less">
.menu-item{
  padding: 2px 5px;
  width: 100px;
  border-radius: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover{
    background: #34D399;
    color: white;
    border-radius: 5px;
  }
}

.menu-active{
  background: #34D399;
  color: white;
  border-radius: 5px;
}

.menus{
  padding: 3px 5px;
  margin: 5px 5px;
  width: 100%;
  border-radius: 10px;
  background: white;
  //border:1px solid #e4e7ed;
  box-shadow:0px 2px 10px rgba(0, 0, 0, .12);
}

</style>