<template>
  <div>
    <div v-for="(adbCommand,index) in adbList" :key="index">
      {{adbCommand.title}}
    </div>
  </div>
</template>

<script setup lang="ts">
import {AdbCommand, AdbStore} from "../../store/AdbStore";
import {computed} from "vue";

const adbStore = AdbStore()
const adbList = computed(()=>{
  return adbStore.AdbList
})



</script>

<style scoped >

</style>