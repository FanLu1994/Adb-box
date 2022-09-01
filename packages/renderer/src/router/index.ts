/**
 * @Description:
 * @author: fanlu
 * @date:  2022/8/14
 * @project: adb-box
 */
import {createRouter, RouteRecordRaw, Router, createWebHashHistory} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        redirect:'/adb',
        component: () => import('@/Layout/Home.vue'),
        meta: {
            title: '首页',
            keepAlive:true,
        },
        children:[
            {
                path:'/adb',
                name: 'Adb',
                component:()=>import('@/views/opt/AdbCommand.vue'),
                meta:{
                    title:'adb命令',
                    keepAlive:true,
                }
            },
            {
                path:'/terminal',
                name: 'Terminal',
                component:()=>import('@/views/opt/Terminal.vue'),
                meta:{
                    title:'终端',
                    keepAlive:true,

                }
            },
            {
                path:'/logcat',
                name: 'Logcat',
                component:()=>import('@/views/opt/Logcat.vue'),
                meta:{
                    title:'日志',
                    keepAlive:true,
                }
            },
            {
                path:'/appManager',
                name: 'AppManager',
                component:()=>import('@/views/opt/AppManager.vue'),
                meta:{
                    title:'应用管理',
                    keepAlive:true,
                }
            },
        ]
    }

]

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router