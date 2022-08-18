/**
 * @Description:
 * @author: fanlu
 * @date:  2022/8/17
 * @project: adb-box
 */
import { defineStore } from 'pinia'

interface MyDevice {
    model:string,
    product:string,
    id:string,
}

export const DeviceStore = defineStore('device',{
    state:()=>{
        let deviceList = new Map<string,MyDevice>;
        let currentDevice:MyDevice|null = null
        return{
            deviceList:deviceList,
            currentDevice:currentDevice,
        }
    },

    getters:{
      CurrentDevice:state => state.currentDevice,
      DeviceList: state => state.deviceList,
    },

    actions:{
        AddDevice(device:MyDevice){
            if(!this.deviceList.has(device.id)){
                this.deviceList.set(device.id,device)
            }
            console.log(this.DeviceList)
        },

        RemoveDevice(deviceID:string){
            if(this.deviceList.has(deviceID)){
                this.deviceList.delete(deviceID)
            }
            console.log(this.DeviceList)
        }

    }

})