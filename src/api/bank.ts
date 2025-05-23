// src/api/bank.ts
import BaseApi from './base-api'

// 银行模块 API 实例
const bankApi = new BaseApi('/pt-api/v1')

// 导出银行相关接口
export type PageParams = {
  pageNum: number
  pageSize: number
}

export type LoanParams = {
  loanAmt: number
  loanTerm: number
}

// 接口路径
const API = {
  getUserBankInfo: '/bank/getUserBankDetail',
  checkAccount: '/bankUserDetail/checkHadAccount',
  createAccount: '/bankUserDetail/createAccount',
  deposit: '/bank/deposit',
  drawn: '/bank/drawn',
  loanAdd: '/bankLoanInfo/add',
  loanPageList: '/bankLoanInfo/pageList',
  getDepositAndDrawnRecords: '/bank/getDepositAndDrawnRecords',
  getInterestRecords: '/bankInterest/pageList',
  getBankStatInfo: '/bank/getBankStatInfo'
}

// 封装接口调用
export const checkAccount = () => bankApi.get<void>(API.checkAccount)
export const createUserAccount = () => bankApi.post<void>(API.createAccount)
export const getUserBankDetail = () => bankApi.get<any>(API.getUserBankInfo)
export const getBankStatInfo = () => bankApi.get<any>(API.getBankStatInfo)

export const getDepositAndDrawnRecords = (params: PageParams) =>
  bankApi.post<any>(API.getDepositAndDrawnRecords, params)

export const getInterestRecords = (params: PageParams) =>
  bankApi.post<any>(API.getInterestRecords, params)

export const getLoanRecords = (params: PageParams) =>
  bankApi.post<any>(API.loanPageList, params)

export const deposit = (amount: number) =>
  bankApi.post<void>(API.deposit, { amount })

export const drawn = (amount: number) =>
  bankApi.post<void>(API.drawn, { amount })

export const loan = (params: LoanParams) =>
  bankApi.post<void>(API.loanAdd, params)

export default bankApi
