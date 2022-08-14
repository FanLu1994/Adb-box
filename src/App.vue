<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Home from './Layout/Home.vue'
import createContextMenu from "@/utils/contextMenu";
import {onMounted} from "vue";

onMounted(()=>{
  createContextMenu()
})


</script>

<template>
<!--  <div class="logo-box">-->
<!--    <img style="height:140px;" src="./assets/electron.png" >-->
<!--    <span/>-->
<!--    <img style="height:140px;" src="./assets/vite.svg" >-->
<!--    <span/>-->
<!--    <img style="height:140px;" src="./assets/vue.png" >-->
<!--  </div>-->
<!--  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />-->
<!--  <div class="static-public bg-red-200">-->
<!--    Place static files into the <code>/public</code> folder-->
<!--    <img style="width:77px;" :src="'./node.png'" >-->
<!--  </div>-->
  <home></home>
</template>

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
