<template>
  <div class="flex justify-center	">
    <div class="flex items-center  menus">
      <div v-for="item in menu" class="menu-item" @click="onClickMenu(item)">
        {{item.title}}
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>

import {useRouter} from "vue-router";

interface menuItem{
  title:string,
  path:string,
}

const menu = [
  {
    title:'Adb命令',
    path:'/adb',
  },
  {
    title:'终端',
    path:'/terminal',
  },
  {
    title:'日志',
    path:'/logcat',
  },
  {
    title:'应用管理',
    path:'/appManager',
  },
]

const router = useRouter()
const onClickMenu = (menuItem:menuItem)=>{
  router.push(menuItem.path)
}

</script>

<style scoped lang="less">
.menu-item{
  border: 1px solid #eeeeee;
  padding: 2px 5px;
  width: 100px;
  background: #10B981;
  color:white;
  border-radius: 0px;
  &:hover{
    background: #34D399;
  }
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