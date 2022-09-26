<template>
  <div class="opt-container">
    <TopMenu class="menu"></TopMenu>
<!--    <router-view></router-view>-->
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
      </keep-alive>
      <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import TopMenu from "@/views/opt/TopMenu.vue";

</script>

<style scoped lang="less">
.opt-container{
  width: 100%;
  overflow: hidden;
}

//.menu{
//  width: 98%;
//}

</style>