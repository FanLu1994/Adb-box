<template>
  <div class="log-container">
    <div class="flex">
      <el-select>
        <el-option v-for="(item,index) in logLevel"
                   :key="index"
                   :label="item"
                   :value="item"
                   v-html="
                      `<span style='color:${getColor(item)}'>${
                        item}</span>`">
        </el-option>
      </el-select>
      <el-input placeholder="请输入筛选内容" class="w-1/4"></el-input>
    </div>
    <div class="logcat-window">

    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

const logLevel = ref([
    'debug',
    'info',
    'warn',
    'error',
    'fatal'
])

const getColor = (level:string)=>{
  switch (level) {
    case 'debug':
      return "#10B981"
    case 'info':
      return "#3B82F6"
    case 'warn':
      return "#F59E0B"
    case 'error':
      return "#EF4444"
    case 'fatal':
      return "#6B7280"
    default:
      return "black"
  }
}

</script>

<style scoped lang="less">
.log-container{
  padding: 5px 10px;
}


.logcat-window{
  width: 100%;
  height: 600px;
  margin-top: 2px;
  background: #2c3e50;
  border-radius: 5px;
  color:white;
  text-align: left;
  padding: 0 5px;
  overflow-y:scroll;
  cursor:text;
  user-select: text;
  box-shadow:  6px 6px 12px #bebebe,
    -6px -6px 12px #ffffff;
}

</style>