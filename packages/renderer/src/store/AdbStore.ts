/**
 * @Description: 常用adb命令管理
 * @author: fanlu
 * @date:  2022/8/25
 * @project: adb-box
 */
import {defineStore} from "pinia";
import {ElMessage, timelineItemProps} from "element-plus";

export interface AdbCommand {
    title:string,
    cmd:string,
}


export const AdbStore = defineStore('adb',{
    state:()=>{
        return{
            adbList:[
                {
                    title:"Home",
                    cmd:"shell input keyevent 3",
                },
                {
                    title:"返回",
                    cmd:"shell input keyevent 4",
                },
                {
                    title:"设置",
                    cmd:"shell am start -a android.settings.SETTINGS",
                },
                {
                    title:"开发者",
                    cmd:"shell am start -a com.android.settings.APPLICATION_DEVELOPMENT_SETTINGS",
                },
                {
                    title:"电源键",
                    cmd:"shell input keyevent 26",
                },
                {
                    title:"解锁(Redmi K40)",
                    cmd:"shell input swipe 300 1000 300 500",
                },
                {
                    title:"屏幕密度",
                    cmd:"shell wm density",
                },
            ],
        }
    },

    persist: {
        storage: localStorage,
        paths: ['adbList'],
    },


    getters:{
        AdbList: (state):AdbCommand[]=>{
            return state.adbList
        },
    },

    actions:{
        AddCommand(title:string,cmd:string){
            for (let i = 0; i < this.adbList.length; i++) {
                if(this.adbList[i].title===title){
                    ElMessage.error({
                        message:'命令名已存在！',
                        showClose:true,
                        duration:3000,
                    })
                    return
                }
                if(this.adbList[i].cmd===cmd){
                    ElMessage.error({
                        message:'命令已存在！',
                        showClose:true,
                        duration:3000,
                    })
                    return
                }
            }
            this.adbList.push({
                title:title,
                cmd:cmd
            })
        },

        RemoveCommand(title:string){
            let titleList:string[] = []
            for (let i = 0; i < this.adbList.length; i++) {
                titleList.push(this.adbList[i].title)
            }
            this.adbList.splice(titleList.indexOf(title),1)
        },

    }
})