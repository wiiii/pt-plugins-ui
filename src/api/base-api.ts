// src/api/base-api.ts
import axios from 'axios'
import type {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse
} from 'axios'
import {ElMessage} from "element-plus";

// 定义基础请求参数类型
export interface BaseApiResponse<T = any> {
    code: number
    message: string
    data: T
}

// 创建 BaseApi 类
class BaseApi {
    instance: AxiosInstance

    constructor(baseURL: string = '/pt-api') {
        this.instance = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true // 👈 开启携带 Cookie
        })

        this.setupInterceptors()
    }

    // 设置拦截器
    setupInterceptors() {
        // 请求拦截器
        this.instance.interceptors.request.use(
            (config) => {
                // 可添加 token 或其他 header
                // const token = localStorage.getItem('token')
                // if (token) {
                //   config.headers.Authorization = `Bearer ${token}`
                // }
                return config
            },
            (error) => {
                console.error('[请求拦截错误]', error)
                return Promise.reject(error)
            }
        )
        // 响应拦截器
        // 响应拦截器
        this.instance.interceptors.response.use(
            (response: AxiosResponse<any>) => {
                const res = response.data;
                if (res.code !== 0) {
                    ElMessage.error(res.msg || '操作失败')
                    return null
                }
                return res;
            },
            (error) => {
                console.error('[响应网络错误]', error)
                return Promise.reject(error)
            }
        )
    }

    // 通用请求方法
    get<T = any>(url: string, config ?: AxiosRequestConfig):
        Promise<T> {
        return this.instance.get(url, config)
    }

    post<T = any>(url: string, data ?: any, config ?: AxiosRequestConfig):
        Promise<T> {
        return this.instance.post(url, data, config)
    }

    put<T = any>(url: string, data ?: any, config ?: AxiosRequestConfig):
        Promise<T> {
        return this.instance.put(url, data, config)
    }

    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.delete(url, config)
    }
}

export default BaseApi
