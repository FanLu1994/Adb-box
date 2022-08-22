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

<script  setup lang="ts">
import ScreenCpy from "@/views/ScreenCpy.vue";
import OptHome from "@/views/opt/OptHome.vue";
import DeviceSelector from "@/views/DeviceSelector.vue";
import {CustomAdbClient} from "../utils/adbClient";
import {onMounted} from "vue";

onMounted(()=>{
  CustomAdbClient.trackDevice()
})

</script>

<style scoped lang="less">
@import "@/assets/less/home.less";

</style>