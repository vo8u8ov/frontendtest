// DataDisplayArea.tsx
import React, { useState } from "react";
import UIPanel from "./UIPanel";

const DataDisplayArea: React.FC = () => {
  const [prefCode, setPrefCode] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(2009);
  const [displayType, setDisplayType] = useState<string>("landResidential");

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
        <h2 className="text-lg">データ表示エリア（チャートなど）</h2>
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
