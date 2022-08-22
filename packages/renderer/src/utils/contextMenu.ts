/**
 * @Description:
 * @author: fanlu
 * @date:  2022/8/14
 * @project: adb-box
 */

const remote = require("@electron/remote")

const Menu = remote.Menu


// 定义右键菜单
const menuTemplate = [
    {
        label:'调试面板开关',
        click : function () {
            if(remote.getCurrentWindow().webContents.isDevToolsOpened()){
                remote.getCurrentWindow().webContents.closeDevTools()
            }else{
                remote.getCurrentWindow().webContents.openDevTools()
            }
        },
    },
    {
        label: '重新加载页面',
        click: function (){
            remote.getCurrentWindow().reload()
        }
    },
]
const menu = Menu.buildFromTemplate(menuTemplate)

function createContextMenu():void {
    window.addEventListener('contextmenu',function (e) {
        e.preventDefault();
        menu.popup({
            window: remote.getCurrentWindow(),
        });
    },false)
}

export default createContextMenu



