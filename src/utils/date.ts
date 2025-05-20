// src/utils/date.ts

/**
 * 格式化时间戳为标准日期字符串
 * @param timestamp 时间戳（毫秒）
 * @returns 格式化后的字符串，如 "2025-04-05 14:30"
 */
export function formatDate(timestamp: number | null | undefined): string {
  if (!timestamp) return '未知'

  const date = new Date(timestamp)
  const pad = (num: number) => num.toString().padStart(2, '0')

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())

  return `${year}-${month}-${day} ${hours}:${minutes}`
}
