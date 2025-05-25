// src/types/lucky.ts

export interface LuckyDrawRecord {
  id: number;
  createTime: string;
  costTadpoles: number;
  prizeName: string;
  prizeType: number;
  prizeValue: string;
  unitName: string;
}

export interface LuckyDrawPageResponse {
  records: LuckyDrawRecord[];
  total: number;
}
