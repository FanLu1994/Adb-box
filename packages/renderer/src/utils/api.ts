/**
 * @Description: 请求atx-agent http
 * @author: fanlu
 * @date:  2022/9/5
 * @project: adb-box
 */
import axios from "axios";
import {port} from "./monitor";

export const GetAppList = (ip:string)=>{
    return axios.get(`http://${ip}:${port}/packages`)
}

export const GetDeviceInfo = (ip:string)=>{
    return axios.get(`http://${ip}:${port}/info`)
}