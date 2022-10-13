/**
 * @Description: 执行logcat的相关功能
 * @author: fanlu
 * @date:  2022/10/12
 * @project: adb-box
 */
import {BrowserWindow, ipcMain,app,shell} from "electron";

import * as fs from 'fs-extra';
import * as path from 'path'
import moment from "moment";

export function LogcatListener(window:BrowserWindow) {
    // 存储logcat
    ipcMain.on('save-logcat',(event,saveLog:string)=>{
        console.log("保存")
        // 创建目录
        let dirPath = path.join(app.getPath('documents'),"adbBox")
        if(!fs.existsSync(dirPath)){
            fs.mkdirpSync(dirPath)
        }

        // 生成保存文件路径 创建文件
        let fileName = moment().format("YYYY-MM-DD_hh_mm_ss")+".log"
        let filePath = path.join(dirPath,fileName)
        // 写入文件
        const logList = JSON.parse(saveLog) as string[]
        console.log(logList.length)
        for (let i = 0; i < logList.length; i++) {
            fs.appendFileSync(filePath,logList[i])
        }

        // 通知渲染进程结果，并打开文件目录
        shell.openPath(dirPath)
    })


}
