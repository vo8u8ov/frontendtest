// src/api.ts
import { EstateTransactionResponse } from "./types";
import prefecturesData from "./prefecturesData";
// const BASE_URL = "https://opendata.resas-portal.go.jp/api/v1";
// const API_KEY = "76kvWSYLuEnBPH9z7TGFZsVwOiORa38Z2HVlZVpa"; // APIキーを設定

export const fetchEstateTransactionData = async (
  prefCode: number,
  year: number,
  displayType: number
): Promise<EstateTransactionResponse> => {
  // データをフィルタリング
  const filteredData = prefecturesData.find(
    (data) => data.prefCode === prefCode && data.displayType === displayType
  );
  console.log("API呼び出し filteredData:", filteredData);

  if (!filteredData) {
    console.error(
      "指定された都道府県または表示タイプのデータが見つかりません:",
      prefCode,
      displayType
    );
    throw new Error(
      "指定された都道府県または表示タイプのデータが見つかりません"
    );
  }

  // 年データを取得
  const yearData = filteredData.years.find((item) => item.year === year);

  if (!yearData) {
    throw new Error("指定された年度のデータが見つかりません");
  }

  // 成果物を返す
  return {
    year: yearData.year,
    data: [{ year: yearData.year, price: yearData.value }],
  };
};
