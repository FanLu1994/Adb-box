
/**
 * @Description:
 * @author: fanlu
 * @date:  2022/8/29
 * @project: adb-box
 */
import {CustomAdbClient} from "./adbClient";
import {app} from "@electron/remote";
import child_process from "child_process";
import {KeyCode} from "adb-ts";
import bus from "./bus";

let client = CustomAdbClient.getClient()
export const port = 7912

export const monitor = {

    // 初始化监控
    async StartMonitor(deviceID:string){
        await this.installAgent(deviceID)
        await this.installMiniCap(deviceID)
        await this.installSTFService(deviceID)
        await this.runAgent(deviceID)
        bus.emit('init-finished')
    },

    // 检查文件是否存在
    async exist(deviceID:string,dir:string,path:string){
        let fileList = await client.execDeviceShell(deviceID,`ls ${dir}`)
        return fileList.indexOf(path)!==-1
    },


    // 安装minicap
    async installMiniCap(deviceID:string){
        // 获取设备信息
        let sdk = await CustomAdbClient.getDeviceProp(deviceID,"ro.build.version.sdk")
        let abi = await CustomAdbClient.getDeviceProp(deviceID,"ro.product.cpu.abi")
        let minicapSoPath = `${app.getAppPath()}/vendor/@devicefarmer/minicap-prebuilt/prebuilt/${abi}/lib/android-${sdk}/minicap.so`
        let minicapPath = `${app.getAppPath()}/vendor/@devicefarmer/minicap-prebuilt/prebuilt/${abi}/bin/minicap`

        // 检查是否已存在
        if(!await this.exist(deviceID,'/data/local/tmp/','minicap')){
            console.log("push minicap:",minicapPath)
            // 未安装，执行安装
            await CustomAdbClient.pushFile(deviceID,minicapPath,'/data/local/tmp/minicap')
            await client.execDeviceShell(deviceID,'chmod 777 /data/local/tmp/minicap')
        }
        if(!await this.exist(deviceID,'/data/local/tmp/','minicap.so')){
            console.log("push minicap.so:",minicapSoPath)
            // 未安装，执行安装
            await CustomAdbClient.pushFile(deviceID,minicapPath,'/data/local/tmp/minicap.so')
            await client.execDeviceShell(deviceID,'chmod 777 /data/local/tmp/minicap.so')
        }
    },


    // 安装atx-agent
    async installAgent(deviceID:string){
        let atxPath = app.getAppPath()+"/vendor/atx-agent/atx-agent"
        let atxDesPath = '/data/local/tmp/atx-agent'
        // 检查是否已存在
        if(!await this.exist(deviceID,'/data/local/tmp/','atx-agent')){
            // 未安装，执行安装
            await CustomAdbClient.pushFile(deviceID,atxPath,atxDesPath)
            await client.execDeviceShell(deviceID,'chmod 755 /data/local/tmp/atx-agent')
        }
    },

    // 安装stfagent
    async installSTFService(deviceID:string){
        let sdk = await CustomAdbClient.getDeviceProp(deviceID,"ro.build.version.sdk")
        sdk = parseInt(sdk,10)
        if(sdk>=10){
            let apkPath = `${app.getAppPath()}/vendor/STFService.apk`
            await client.install(deviceID,apkPath)
        }
    },

    // 启动atx-agent
    async runAgent(deviceID:string){
        try{
            await client.execDeviceShell(deviceID,
                "/data/local/tmp/atx-agent server --stop")
            // await client.execDeviceShell(deviceID,
            //     "killall minitouch")
            await client.execDeviceShell(deviceID,"killall stf.agent")
        }catch (e) {
            console.log(e)
        }

        let sdk = await CustomAdbClient.getDeviceProp(deviceID,"ro.build.version.sdk")
        sdk = parseInt(sdk,10)
        if(sdk>=10){
            try{
                await client.execDeviceShell(deviceID,"am start -n jp.co.cyberagent.stf/.IdentityActivity")
                await client.execDeviceShell(deviceID,"am startservice -n jp.co.cyberagent.stf/.Service")
                await client.keyEvent(deviceID,KeyCode.KEYCODE_HOME)
            }catch (e) {
                console.log(e)
            }
        }

        client.execDeviceShell(deviceID,`/data/local/tmp/atx-agent server -d --addr :${port}`)
    },
}