// src/api/bank.ts
import BaseApi from './base-api'

// 抽奖模块 API 实例
const luckyApi = new BaseApi('/pt-api/v1')

// 相关接口
export type PageParams = {
    pageNum: number
    pageSize: number
}

export type DrawParams = {
    size?: number
}

// 接口路径
const API = {
    getRecordsByPage: '/lucky/luckyDrawRecord/getRecordsByPage',
    luckyDraw: '/lucky/luckyDraw',
}

// 封装接口调用

export const getRecordsByPage = (params: PageParams) => {
    return luckyApi.post<any>(API.getRecordsByPage, params)
}
export const luckyDraw = (params: DrawParams) => {
    return luckyApi.get<any>(API.luckyDraw, {
        params
    })
}

export default luckyApi
