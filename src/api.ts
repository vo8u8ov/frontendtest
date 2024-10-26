// src/api.ts
import { EstateTransactionResponse } from "./types";
import prefecturesData from "./prefecturesData";

// 都道府県の年度データを取得する関数
export const fetchEstateTransactionData = async (
  prefCode: number,
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
  const yearsData = filteredData.years; // 対応する年度のデータを取得

  // 成果物を返す
  const result: EstateTransactionResponse = {
    prefCode: filteredData.prefCode,
    displayType: filteredData.displayType,
    years: yearsData.map((yearData) => ({
      year: yearData.year, // 年度
      value: yearData.value, // 価格
    })),
  };

  return result; // 指定されたprefCodeとdisplayTypeに関連する全年度のデータを返す
};
