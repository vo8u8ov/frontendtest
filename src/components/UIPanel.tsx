// src/components/UIPanel.tsx
import React from "react";
import { years } from "../years";
import { prefectures } from "../prefectures";

interface UIPanelProps {
  prefCode: number;
  prefName: string;
  selectedYear: number;
  displayType: number;
  handlePrefChange: (prefCode: number) => void;
  handlePrefNameChange: (prefName: string) => void;
  handleYearChange: (year: number) => void;
  handleDisplayTypeChange: (type: number) => void;
}

const MapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    className="mr-2 text-gray-300"
  >
    <path
      fill="currentColor"
      d="M12 2C10.343 2 9 3.343 9 5c0 .182.018.357.052.529C6.353 6.434 4 8.716 4 11.5 4 14.365 7.582 17 12 17s8-2.635 8-5.5c0-2.784-2.353-5.066-5.052-5.971C12.982 2.357 12 2 12 2z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    className="mr-2 text-gray-300"
  >
    <path
      fill="currentColor"
      d="M19 3h-2V1h-2v2H7V1H5v2H1v16h22V3h-4zm0 18H5V8h14v13z"
    />
  </svg>
);

const TypeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    className="mr-2 text-gray-300"
  >
    <path
      fill="currentColor"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z"
    />
  </svg>
);

const UIPanel: React.FC<UIPanelProps> = ({
  prefCode,
  selectedYear,
  displayType,
  handlePrefChange,
  handlePrefNameChange,
  handleYearChange,
  handleDisplayTypeChange,
}) => {
  // 都道府県コードが変更された時の処理
  const handlePrefChangeWithPrefName = (code: number) => {
    handlePrefChange(code);
    const selectedPref = prefectures.find((pref) => pref.code === code);
    if (selectedPref) {
      handlePrefNameChange(selectedPref.name); // 日本語名を渡す
    }
  };
  return (
    <div className="w-full border bg-gray-700  p-4 rounded-lg">
      {/* 表示内容を選択 */}
      <h3 className="text-lg font-bold mb-2">表示内容を選択</h3>
      <hr className="border-gray-500 mb-4" />

      {/* 場所 */}
      <div className="flex items-center mb-4">
        <MapIcon />
        <label className="w-1/3 mr-2">場所</label>
        <select
          value={prefCode}
          onChange={(e) => handlePrefChangeWithPrefName(Number(e.target.value))}
          className="border border-gray-300 p-2 bg-gray-600 w-2/3"
        >
          {prefectures.map((pref) => (
            <option key={pref.code} value={pref.code}>
              {pref.name}
            </option>
          ))}
        </select>
      </div>

      {/* 年度 */}
      <div className="flex items-center mb-4">
        <CalendarIcon />
        <label className="w-1/3 mr-2">年度</label>
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          className="border border-gray-300 p-2 bg-gray-600 w-2/3"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* 表示タイプ */}
      <div className="flex items-start mb-4">
        <TypeIcon />
        <label className="w-1/3 mr-2">種類</label>
        <div className="flex flex-col w-2/3">
          <label className="flex items-center mb-1">
            <input
              type="radio"
              value="landResidential"
              checked={displayType === 1}
              onChange={() => handleDisplayTypeChange(1)}
              className="mr-2"
            />
            土地(住宅地)
          </label>
          <label className="flex items-center mb-1">
            <input
              type="radio"
              value="landCommercial"
              checked={displayType === 2}
              onChange={() => handleDisplayTypeChange(2)}
              className="mr-2"
            />
            土地(商業地)
          </label>
          <label className="flex items-center mb-1">
            <input
              type="radio"
              value="usedApartment"
              checked={displayType === 3}
              onChange={() => handleDisplayTypeChange(3)}
              className="mr-2"
            />
            中古マンション等
          </label>
          <label className="flex items-center mb-1">
            <input
              type="radio"
              value="farmland"
              checked={displayType === 4}
              onChange={() => handleDisplayTypeChange(4)}
              className="mr-2"
            />
            農地
          </label>
          <label className="flex items-center mb-1">
            <input
              type="radio"
              value="forestLand"
              checked={displayType === 5}
              onChange={() => handleDisplayTypeChange(5)}
              className="mr-2"
            />
            林地
          </label>
        </div>
      </div>
      <div>
        <button
          className="bg-blue-600 mt-80 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 w-full"
          onClick={() => console.log("データをダウンロード")} // クリック時の動作（仮実装）
        >
          データをダウンロード
        </button>
      </div>
    </div>
  );
};

export default UIPanel;
