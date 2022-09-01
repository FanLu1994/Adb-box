import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import router from "../src/router/index";
import 'element-plus/dist/index.css'
import './index.css'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'

const pinia = createPinia()
pinia.use(piniaPersist)

createApp(App).use(ElementPlus).use(router).use(pinia)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
