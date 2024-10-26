import { EstateTransactionResponse } from "./types";

// src/api.ts
const BASE_URL = "https://opendata.resas-portal.go.jp/api/v1";
const API_KEY = ""; // APIキーを設定

export const fetchEstateTransactionData = async (
  prefCode: number,
  year: number
): Promise<EstateTransactionResponse> => {
  try {
    const response = await fetch(
      `https://opendata.resas-portal.go.jp/api/v1/townPlanning/estateTransaction/bar?prefCode=${prefCode}&year=${year}`,
      {
        headers: {
          "X-API-KEY": "YOUR_API_KEY_HERE", // 自分のAPIキーをここに挿入
        },
      }
    );

    if (!response.ok) {
      throw new Error("ネットワークエラー");
    }

    const data = await response.json();

    if (data && data.result) {
      // ここでAPIレスポンスの構造に従って必要なデータを取得
      const yearData = data.result.years.map(
        (item: { year: number; value: number }) => ({
          year: item.year, // 年度
          price: item.value, // 不動産取引価格(面積あたり平均価格)
        })
      );

      return {
        year: data.result.year,
        data: yearData, // 整形したデータを返す
      };
    } else {
      throw new Error("データが不正です");
    }
  } catch (error) {
    console.error("APIデータの取得エラー:", error);
    throw error;
  }
};
