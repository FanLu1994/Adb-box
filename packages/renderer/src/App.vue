<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import createContextMenu from "../src/utils/contextMenu";
import {onMounted} from "vue";
import Home from "./Layout/Home.vue";
import ScreenCpy from "@/views/ScreenCpy.vue";
import OptHome from "@/views/opt/OptHome.vue";
import DeviceSelector from "@/views/DeviceSelector.vue";
import {CustomAdbClient} from "./utils/adbClient";

onMounted(()=>{
  CustomAdbClient.trackDevice()
  createContextMenu()
})


</script>

<template>
  <div class="home">
    <div class="screen">
      <ScreenCpy></ScreenCpy>
    </div>
    <div class="opt">
      <DeviceSelector></DeviceSelector>
      <OptHome></OptHome>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "./assets/less/home.less";

</style>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 752px;
  width: 100%;
}

.logo-box {
  display: flex;
  width: 100%;
  justify-content: center;
}
.logo-box span {
  width: 74px;
}
.static-public {
  display: flex;
  align-items: center;
  justify-content: center;
}
.static-public code {
  background-color: #eee;
  padding: 2px 4px;
  margin: 0 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
