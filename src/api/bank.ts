import axios from 'axios'

// 定义API接口类型
interface BankAPI {
    getUserBankInfo: string;
    checkAccount: string;
    createAccount: string;
    deposit: string;
    withdraw: string;
    loanAdd: string;
    loanPageList: string;
    getDepositAndDrawnRecords: string;
    getInterestRecords: string;
    getBankStatInfo: string;
}

// 创建axios实例
const apiClient = axios.create({
    baseURL: '/bank-api/v1',
    timeout: 10000,
})

// 定义请求类型
export type PageParams = {
    pageNum: number;
    pageSize: number;
}

export type LoanParams = {
    loanAmt: number;
    loanTerm: number;
}

// API定义
const API: BankAPI = {
    getUserBankInfo: '/bank/getUserBankDetail',
    checkAccount: '/bankUserDetail/checkHadAccount',
    createAccount: '/bankUserDetail/createAccount',
    deposit: '/bank/deposit',
    withdraw: '/bank/drawn',
    loanAdd: '/bankLoanInfo/add',
    loanPageList: '/bankLoanInfo/pageList',
    getDepositAndDrawnRecords: '/bank/getDepositAndDrawnRecords',
    getInterestRecords: '/bankInterest/pageList',
    getBankStatInfo: '/bank/getBankStatInfo'
}

// API请求方法
export const checkAccount = () => apiClient.get(API.checkAccount)
export const createUserAccount = () => apiClient.post(API.createAccount)
export const getUserBankDetail = () => apiClient.get(API.getUserBankInfo)
export const getBankStatInfo = () => apiClient.get(API.getBankStatInfo)

export const getDepositAndDrawnRecords = (params: PageParams) =>
    apiClient.post(API.getDepositAndDrawnRecords, params)

export const getInterestRecords = (params: PageParams) =>
    apiClient.post(API.getInterestRecords, params)

export const getLoanRecords = (params: PageParams) =>
    apiClient.post(API.loanPageList, params)

export const deposit = (amount: number) =>
    apiClient.post(API.deposit, { amount })

export const withdraw = (amount: number) =>
    apiClient.post(API.withdraw, { amount })

export const loan = (params: LoanParams) =>
    apiClient.post(API.loanAdd, params)

export default API
