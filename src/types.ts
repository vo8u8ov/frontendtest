export interface EstateTransactionResponse {
  year: number;
  data: Array<{
    year: number;
    price: number;
  }>;
  averagePrice?: number; // optional, デフォルト値を扱うためにオプショナルにします
}
