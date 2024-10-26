// DataDisplayArea.tsx
import React, { useState, useEffect } from "react";
import UIPanel from "./UIPanel";

const data = [
  {
    prefCode: 1,
    year: 2009,
    type: "landResidential",
    pricePerSquareMeter: 50000,
  },
  {
    prefCode: 1,
    year: 2010,
    type: "landResidential",
    pricePerSquareMeter: 52000,
  },
  {
    prefCode: 2,
    year: 2009,
    type: "landCommercial",
    pricePerSquareMeter: 75000,
  },
  // ここに他のデータも追加できます
];

const DataDisplayArea: React.FC = () => {
  const [prefCode, setPrefCode] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(2009);
  const [displayType, setDisplayType] = useState<string>("landResidential");
  const [pricePerSquareMeter, setPricePerSquareMeter] = useState<number | null>(
    null
  );

  // 年度変更ハンドラー
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  // 都道府県変更ハンドラー
  const handlePrefChange = (prefCode: number) => {
    setPrefCode(prefCode);
  };

  // 表示タイプ変更ハンドラー
  const handleDisplayTypeChange = (type: string) => {
    setDisplayType(type);
  };

  // データ取得関数
  useEffect(() => {
    const result = data.find(
      (entry) =>
        entry.prefCode === prefCode &&
        entry.year === selectedYear &&
        entry.type === displayType
    );
    setPricePerSquareMeter(result ? result.pricePerSquareMeter : null);
  }, [prefCode, selectedYear, displayType]);

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
        <h3>
          選択した条件の取引価格:{" "}
          {pricePerSquareMeter ? `${pricePerSquareMeter} 円/㎡` : "データなし"}
        </h3>
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
