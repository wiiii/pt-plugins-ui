import BaseApi from './base-api'

const luckyApi = new BaseApi('/pt-api/v1')

// 导出银行相关接口
export type PageParams = {
    pageNum: number
    pageSize: number
}

const API = {
  getRecordsByPage: '/lucky/luckyDrawRecord/getRecordsByPage',
  luckyDraw: '/lucky/luckyDraw',
}

export const getRecordsByPage = (params: PageParams) => {
  return luckyApi.post<any>(API.getRecordsByPage, params)
}

export const luckyDraw = (params: { size?: number }) => {
  return luckyApi.get<any>(API.luckyDraw, { params })
}
