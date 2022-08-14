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
        component: () => import('@/Layout/Home.vue'),
        meta: {
            title: '首页'
        }
    }
]

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router