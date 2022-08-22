/**
 * @Description:
 * @author fan
 * @date 2022/5/26 22:50
 */
import {ipcMain,BrowserWindow} from 'electron'

export function StartSystemListener(window:BrowserWindow) {
    // 窗口最大化
   ipcMain.on('max',()=>{
       if(window.isMaximized()){
           window.restore()
       }else{
           window.maximize()
       }
   })

    // 窗口最小化
    ipcMain.on('min',()=>{
        window.minimize()
    })

    // 退出程序
    ipcMain.on('close',()=>{
        window.close()
    })

}
