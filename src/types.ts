// src/types.ts
export interface EstateTransaction {
  year: number; // 年
  price: number; // 不動産取引価格(面積あたり平均価格)
}

export interface EstateTransactionResponse {
  year: number; // 対象の年
  data: EstateTransaction[]; // 年ごとの不動産価格データ
}
