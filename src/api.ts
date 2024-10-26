// src/api.ts
import { EstateTransactionResponse } from "./types";

const BASE_URL = "https://opendata.resas-portal.go.jp/api/v1";
const API_KEY = "76kvWSYLuEnBPH9z7TGFZsVwOiORa38Z2HVlZVpa"; // APIキーを設定

export const fetchEstateTransactionData = async (
  prefCode: number,
  year: number,
  displayType: number
): Promise<EstateTransactionResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}/townPlanning/estateTransaction/bar?prefCode=${prefCode}&year=${year}&displayType=${displayType}`,
      {
        headers: {
          "X-API-KEY": API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("ネットワークエラー");
    }

    const data = await response.json();

    // APIレスポンスが期待通りか確認
    if (data && data.result && data.result.years) {
      const yearData = data.result.years.map(
        (item: { year: number; value: number }) => ({
          year: item.year,
          price: item.value,
        })
      );

      return {
        year,
        data: yearData,
      };
    } else {
      throw new Error("データが不正です");
    }
  } catch (error) {
    console.error("APIデータの取得エラー:", error);
    throw error;
  }
};
