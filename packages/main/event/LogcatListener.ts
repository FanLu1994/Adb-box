/**
 * @Description: 执行logcat的相关功能
 * @author: fanlu
 * @date:  2022/10/12
 * @project: adb-box
 */
import {BrowserWindow, ipcMain} from "electron";

import * as fs from 'fs-extra';
import * as path from 'path'

export function LogcatListener(window:BrowserWindow) {
    // 存储logcat
    ipcMain.on('save-logcat',(event,logcatList:string[])=>{
        console.log("保存")
        // 生成保存文件路径 创建文件路径

        // 创建文件

        // 写入文件

        // 通知渲染进程结果，并打开文件目录
    })


}
