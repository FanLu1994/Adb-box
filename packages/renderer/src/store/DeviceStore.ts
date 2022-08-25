/**
 * @Description:
 * @author: fanlu
 * @date:  2022/8/17
 * @project: adb-box
 */
import {defineStore} from 'pinia'

interface MyDevice {
    model:string,
    product:string,
    id:string,
}

export const DeviceStore = defineStore('device',{
    state:()=>{
        let deviceList = new Map<string,MyDevice>;
        let currentDevice:MyDevice = null as any
        return{
            deviceList:deviceList,
            currentDevice:currentDevice,
        }
    },

    getters:{
      CurrentDevice:(state):MyDevice => state.currentDevice,
      DeviceList: (state):MyDevice[]=>{
          let result = []
          for(let device of state.deviceList.values()){
              result.push(device)
          }
          return result
      },
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
        },

        SetCurrentDevice(deviceID:string){
            this.currentDevice = this.deviceList.get(deviceID)??(null as any)
        }
    }



})