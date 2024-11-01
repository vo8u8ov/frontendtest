export interface YearData {
  year: number; // 年度
  value: number; // 取引価格
}

export interface EstateTransactionResponse {
  prefCode: number; // 都道府県コード
  prefName: string; // 都道府県名
  displayType: number; // 表示タイプ
  years: YearData[]; // 年度データの配列
}
