// src/api/index.ts

// 导出银行模块
export * as bankApi from './bank'

// 可选：导出 BaseApi 类（供其他模块继承使用）
export { default as BaseApi } from './base-api'
