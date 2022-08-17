/**
 * @Description:
 * @author: fanlu
 * @date:  2022/8/17
 * @project: adb-box
 */
import {AdbClient} from "adb-ts";
import AdbDevice from "adb-ts/lib/device";

const client = new AdbClient()
export class CustomAdbClient {

    constructor() {
    }

    // 获取adb客户端
    public static getClient():AdbClient{
        if(client!==null){
            return client
        }
        return new AdbClient()
    }

    // 设备监听
    public static trackDevice(){
        client.trackDevices()
            .then(function(tracker:any) {
                tracker.on('add', async function(device:AdbDevice) {
                    console.log('Device %s was plugged in', device.id)
                    console.log('Device %s was plugged in', device.product)
                    console.log('Device %s was plugged in', device.model)
                    client.listPackages(device.id).then((properties:any)=>{
                        console.log(properties)
                    })
                })
                tracker.on('remove',async function(device:any) {
                    console.log('Device %s was unplugged', device.id)
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
    public static getDeviceProp(deviceId:string){

    }

    // 执行adb命令
    public static execAdb(deviceId:string,command:string){
        client.execDevice(deviceId, command).then((res:string) =>{
            console.log(res)
        })
    }

    // 推送文件到设备中
    public static pushFile(deviceId:string,filePath:string,desPath:string){
        client.pushFile(deviceId, filePath, desPath).then((res:string)=>{
            console.log(res)
        })
    }

    // 获取logcat
    public static logcat(deviceId:string){

    }
}