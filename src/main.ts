import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import router from "@/router";
import 'element-plus/dist/index.css'
import './index.css'

createApp(App).use(ElementPlus).use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
