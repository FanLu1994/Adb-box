/**
 * @Description:
 * @author: fanlu
 * @date:  2022/8/17
 * @project: adb-box
 */
import { defineStore } from 'pinia'

interface MyDevice {
    model:string,
    name:string,
    deviceID:string,
}

export const DeviceStore = defineStore('device',{
    state:()=>{
        let deviceList = new Array<MyDevice>;
        let currentDevice:MyDevice|null = null
        return{
            deviceList:deviceList,
            currentDevice:currentDevice,
        }
    },

    getters:{
      CurrentDevice:state => state.currentDevice,
      DeviceList: state => state.deviceList,
    }
})