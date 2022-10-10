import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import router from "../src/router/index";
import 'element-plus/dist/index.css'
import './index.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate  from 'pinia-plugin-persistedstate'
import "./assets/icon/iconfont.css"

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(pinia).use(ElementPlus).use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
