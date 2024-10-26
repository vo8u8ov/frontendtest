// DataDisplayArea.tsx
import React, { useState, useEffect } from "react";
import UIPanel from "./UIPanel";
import { fetchEstateTransactionData } from "../api";
import { EstateTransactionResponse } from "../types";

const DataDisplayArea: React.FC = () => {
  const [prefCode, setPrefCode] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(2009);
  const [displayType, setDisplayType] = useState<number>(1);
  const [priceData, setPriceData] = useState<EstateTransactionResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // データ取得のハンドラー
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null); // エラーをリセット
        const data = await fetchEstateTransactionData(
          prefCode,
          selectedYear,
          displayType
        );
        setPriceData(data);
      } catch (err) {
        setError("データの取得に失敗しました。");
      }
    };

    fetchData();
  }, [prefCode, selectedYear, displayType]);

  // 年度変更ハンドラー
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  // 都道府県変更ハンドラー
  const handlePrefChange = (prefCode: number) => {
    setPrefCode(prefCode);
  };

  // 表示タイプ変更ハンドラー
  const handleDisplayTypeChange = (type: number) => {
    setDisplayType(type);
  };

  return (
    <div className="flex flex-col p-4">
      {/* 取引価格セクション */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="mr-2">📊</span>
          取引価格
        </h2>
        <p className="text-sm mt-1">※取引面積1㎡あたり</p>
        <hr className="my-2 border-gray-600" />
      </div>

      <div className="flex flex-col sm:flex-row justify-between mt-4">
        <div className="flex-grow">
          {/* 価格データ表示 */}
          <h2 className="text-lg">データ表示エリア（チャートなど）</h2>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : priceData ? (
            <div>
              <p>年度: {priceData.year}</p>
              <ul>
                {priceData.data.map((item) => (
                  <li key={item.year}>
                    {item.year}: {item.price} 円/㎡
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>データを取得しています...</p>
          )}
        </div>
        <div className="w-full sm:w-1/4">
          {" "}
          {/* UIPanelをリスポンシブにする */}
          <UIPanel
            prefCode={prefCode}
            selectedYear={selectedYear}
            displayType={displayType}
            handlePrefChange={handlePrefChange}
            handleYearChange={handleYearChange}
            handleDisplayTypeChange={handleDisplayTypeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DataDisplayArea;
