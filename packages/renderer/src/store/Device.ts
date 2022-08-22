/**
 * @Description:
 * @author fan
 * @date 2022/5/28 15:01
 */

import {defineStore} from "pinia";
import AdbDevice from "adb-ts/lib/device";
import {ElMessage} from "element-plus/es";
import {KeyCode} from "adb-ts";
import bus from "../utils/bus";
import axios from "axios";


const {app} = require('@electron/remote')
const child_process = require('child_process')

// 自定义class类
class MyDevice{
    public uid:string;
    public model:string;
    public adbDevice:AdbDevice;
    public ip:string;

    constructor(uid:string,model:string,device:AdbDevice) {
        this.uid = uid
        this.model = model
        this.adbDevice = device
        this.ip = ""
        this.adbDevice.getIpAddress((err, value)=>{
            let ip = value as string
            let ipArray = ip.split("\n")
            if(ipArray.length>1){
                this.ip = ip.split("\n")[1]
            }else{
                this.ip = ip.split("\n")[0]
            }
        })
    }
}

export const useDeviceStore = defineStore('device',{
    state:()=>{
        let deviceMap:Map<string,MyDevice> = new Map()
        let temp:any;
        return {
            currentDevice:temp,
            deviceMap:deviceMap,
        }
    },

    getters:{
        CurrentDevice:(state)=>state.currentDevice as MyDevice,
        DeviceMap:(state)=>state.deviceMap,
    },

    actions:{
        // 新设备连接
        async addDevice(deviceID:string,device:AdbDevice){
            if(!this.deviceMap.has(deviceID)){
                let model = await device.getProp('ro.product.model')
                let myDevice = new MyDevice(
                    deviceID,model,device
                )
                this.deviceMap.set(deviceID,myDevice)
                if(Array.from(this.deviceMap.keys()).length===1){
                    this.setCurrentDevice(myDevice)
                    this.initDevice(myDevice)
                }
                ElMessage.info({
                    message:`设备 ${model} 已连接`,
                    duration:1000,
                    showClose:true,
                })
            }
            this.deviceMap.entries()
        },
        // 设备断开连接
        removeDevice(deviceID:string,device:AdbDevice){
           if(this.deviceMap.has(deviceID)){
               ElMessage.info({
                   message:`设备 ${this.deviceMap!.get(deviceID)!.model} 已断开`,
                   duration:1000,
                   showClose:true,
               })
               this.deviceMap.delete(deviceID)
           }
           if(deviceID == this.currentDevice.uid){
               this.setCurrentDevice(null)
           }
        },

        // 选择当前设备
        setCurrentDevice(device:MyDevice|null){
            this.currentDevice = device
        },

        // 初始化atx-agent,minicap,minitouch
        async initDevice(device:MyDevice){
            await this.installAgent(device)
            await this.installMiniCap(device)
            await this.installMinitouch(device)
            await this.installSTFService(device)
            await this.runAgent(device)
            bus.emit('init-finished')
        },

        // 检查文件是否存在
        async exist(d:MyDevice,dir:string,path:string){
            let fileList = await d.adbDevice.execShell(`ls ${dir}`)
            return fileList.indexOf(path)!==-1
        },


        // 安装atx-agent
        async installAgent(d:MyDevice){
            let atxPath = app.getAppPath()+"/atx-agent/atx-agent"
            let atxDesPath = '/data/local/tmp/atx-agent'
            // 检查是否已存在
            if(!await this.exist(d,'/data/local/tmp/','atx-agent')){
                // 未安装，执行安装
                await d.adbDevice.push(atxPath,atxDesPath)
                await d.adbDevice.execShell('chmod 755 /data/local/tmp/atx-agent')
            }
        },

        // 安装minicap
        async installMiniCap(d:MyDevice){
            // 获取设备信息
            let sdk = await d.adbDevice.getProp("ro.build.version.sdk")
            let abi = await d.adbDevice.getProp("ro.product.cpu.abi")
            let minicapSoPath = `${app.getAppPath()}/stf/node_modules/@devicefarmer/minicap-prebuilt/prebuilt/${abi}/lib/android-${sdk}/minicap.so`
            let minicapPath = `${app.getAppPath()}/stf/node_modules/@devicefarmer/minicap-prebuilt/prebuilt/${abi}/bin/minicap`

            // 检查是否已存在
            if(!await this.exist(d,'/data/local/tmp/','minicap')){
                console.log("push minicap:",minicapPath)
                // 未安装，执行安装
                await d.adbDevice.push(minicapPath,'/data/local/tmp/minicap')
                await d.adbDevice.execShell('chmod 777 /data/local/tmp/minicap')
            }
            if(!await this.exist(d,'/data/local/tmp/','minicap.so')){
                console.log("push minicap.so:",minicapSoPath)
                // 未安装，执行安装
                await d.adbDevice.push(minicapSoPath,'/data/local/tmp/minicap.so')
                await d.adbDevice.execShell('chmod 777 /data/local/tmp/minicap.so')
            }
        },

        // 安装minitouch
        async installMinitouch(d:MyDevice){
            // 获取设备信息
            let abi = await d.adbDevice.getProp("ro.product.cpu.abi")
            let minitouchPath = `${app.getAppPath()}/stf/node_modules/@devicefarmer/minitouch-prebuilt/prebuilt/${abi}/bin/minitouch`
            console.log(minitouchPath)
            console.log("??????????????????????")
            if(!await this.exist(d,'/data/local/tmp/','minitouch')){
                console.log("push minitouch:",minitouchPath)
                // 未安装，执行安装
                await d.adbDevice.push(minitouchPath,'/data/local/tmp/minitouch')
                await d.adbDevice.execShell('chmod 777 /data/local/tmp/minitouch')
            }
        },

        // 安装stfagent
        async installSTFService(d:MyDevice){
            let sdk = await d.adbDevice.getProp("ro.build.version.sdk")
            sdk = parseInt(sdk,10)
            if(sdk>=10){
                let apkPath = `${app.getAppPath()}/stf/STFService.apk`
                await d.adbDevice.install(apkPath)
            }
        },

        // 启动atx-agent
        async runAgent(d:MyDevice){
            try{
                await d.adbDevice.execShell(
                    "/data/local/tmp/atx-agent server --stop")
                await d.adbDevice.execShell(
                    "killall minitouch")
                await d.adbDevice.execShell("killall stf.agent")
            }catch (e) {
                console.log(e)
            }


            let sdk = await d.adbDevice.getProp("ro.build.version.sdk")
            sdk = parseInt(sdk,10)
            if(sdk>=10){
                await d.adbDevice.push(`${app.getAppPath()}/stf/runStf.sh`,'/data/local/tmp/runStf.sh')
                await d.adbDevice.execShell('chmod 777 /data/local/tmp/runStf.sh ')
                // await d.adbDevice.execShell('sh /data/local/tmp/runStf.sh')
                try{
                    await d.adbDevice.execShell("am start -n jp.co.cyberagent.stf/.IdentityActivity")
                    await d.adbDevice.execShell("am startservice -n jp.co.cyberagent.stf/.Service")
                    await d.adbDevice.keyEvent(KeyCode.KEYCODE_HOME)
                }catch (e) {
                    console.log(e)
                }

                let cmd = `adb -s ${d.uid} shell  sh /data/local/tmp/runStf.sh`
                const ls = child_process.spawn(cmd,{shell:true})

                // let agent_path = await d.adbDevice.execShell("pm path jp.co.cyberagent.stf")
                // let agent_pkg_name = agent_path.split(":")[1].replace("\r", "").replace("\n", "")
                // let cmd = `export CLASSPATH=${agent_pkg_name}&&exec app_process /system/bin jp.co.cyberagent.stf.Agent`
                // console.log(cmd)
                // const shell = child_process.spawn(`adb -s ${d.uid} shell`)
                // const ls = child_process.spawn(cmd,{shell:true,stdio:[shell.stdin]})
                ls.stdout.on('data', (data:any) => {
                    console.log(`stdout: ${data}`);
                });

                ls.stderr.on('data', (data:any) => {
                    console.error(`stderr: ${data}`);
                });

                ls.on('close', (code:any) => {
                    console.log(`child process exited with code ${code}`);
                });
            }

            d.adbDevice.execShell('/data/local/tmp/atx-agent server -d --addr :7912')
        },

    }


})
