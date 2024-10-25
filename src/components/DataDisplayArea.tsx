// DataDisplayArea.tsx
import React from "react";

const DataDisplayArea: React.FC = () => {
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

      <div>
        <h2 className="text-lg">データ表示エリア（チャートなど）</h2>
      </div>
    </div>
  );
};

export default DataDisplayArea;
