/**
 * @Description: 常用adb命令管理
 * @author: fanlu
 * @date:  2022/8/25
 * @project: adb-box
 */
import {defineStore} from "pinia";
import {timelineItemProps} from "element-plus";

export interface AdbCommand {
    title:string,
    cmd:string,
}


export const AdbStore = defineStore('adb',{
    state:()=>{
        return{
            adbMap:new Map<string,string>([
                    ['Home','shell input keyevent 3'],
                    ['返回','shell input keyevent 4'],
                    ['设置','shell am start -a android.settings.SETTINGS'],
                    ['开发者','shell am start -a com.android.settings.APPLICATION_DEVELOPMENT_SETTINGS'],
                    ['电源键','shell input keyevent 26'],
                    ['解锁(Redmi K40)','shell input swipe 300 1000 300 500'],
                    ['屏幕密度','shell wm density'],
                ]
            )
        }
    },

    getters:{
        AdbList: (state):AdbCommand[]=>{
            let res:AdbCommand[] = []
            for (let [k,v] of state.adbMap) {
                res.push({
                    title:k,
                    cmd:v,
                })
            }
            console.log(res)
            return res
        },
    },

    actions:{
        AddCommand(title:string,cmd:string){
            if(!this.adbMap.has(title)){
                this.adbMap.set(title,cmd)
            }
        },

        RemoveCommand(title:string){
            this.adbMap.delete(title)
        }

    }
})