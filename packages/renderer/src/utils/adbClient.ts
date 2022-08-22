/**
 * @Description:
 * @author: fanlu
 * @date:  2022/8/17
 * @project: adb-box
 */
import {AdbClient} from "adb-ts";
import AdbDevice from "adb-ts/lib/device";
import {DeviceStore} from "../store/DeviceStore";

const client = new AdbClient()
const deviceStore = DeviceStore()
export class CustomAdbClient {

    // 获取adb客户端
    static getClient():AdbClient{
        if(client!==null){
            return client
        }
        return new AdbClient()
    }

    // 设备监听
    static trackDevice(){
        client.trackDevices()
            .then(function(tracker:any) {
                tracker.on('add', async function(device:AdbDevice) {
                    console.log('Device %s was plugged in', device.id)
                    console.log('Device %s was plugged in', device.product)
                    console.log('Device %s was plugged in', device.model)
                    // client.listPackages(device.id).then((properties:any)=>{
                    //     console.log(properties)
                    // })
                    deviceStore.AddDevice({product:device.product,id:device.id,model:device.model})
                })
                tracker.on('remove',async function(device:any) {
                    console.log('Device %s was unplugged', device.id)
                    deviceStore.RemoveDevice(device.id)
                })
                tracker.on('end', function() {
                    console.log('Tracking stopped')
                })
            })
            .catch(function(err:any) {
                console.error('Something went wrong:', err.stack)
            })
    }

    // 获取设备信息
    static getDeviceProp(deviceId:string){

    }

    // 执行adb命令
    static execAdb(deviceId:string,command:string){
        client.execDevice(deviceId, command).then((res:string) =>{
            console.log(res)
        })
    }

    // 推送文件到设备中
    static pushFile(deviceId:string,filePath:string,desPath:string){
        client.pushFile(deviceId, filePath, desPath).then((res:string)=>{
            console.log(res)
        })
    }

    // 获取logcat
    static logcat(deviceId:string){

    }
}