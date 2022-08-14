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


</script>

<style scoped lang="less">
@import "@/assets/less/home.less";

</style>