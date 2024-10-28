// src/components/UIPanel.tsx
import React from "react";
import { years } from "../years";
import { prefectures } from "../prefectures";
import MapIcon from "../marker.svg";
import CalendarIcon from "../calendar-check.svg";
import TypeIcon from "../resources.svg";

interface UIPanelProps {
  prefCode: number;
  selectedYear: number;
  displayType: number;
  handlePrefChange: (prefCode: number) => void;
  handlePrefNameChange: (prefName: string) => void;
  handleYearChange: (year: number) => void;
  handleDisplayTypeChange: (type: number) => void;
}

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
    <div
      className="w-full border p-4 rounded-sm text-black"
      style={{ backgroundColor: "#f0f3f5" }}
    >
      {/* 表示内容を選択 */}
      <h3 className="text-lg mb-2">表示内容を選択</h3>
      <hr className="border-gray-300 mb-4" />

      {/* 場所 */}
      <div className="flex items-center mb-4">
        <img
          src={MapIcon}
          alt="Map Icon"
          width="20"
          height="20"
          className="mr-2 text-gray-300"
        />
        <label className="w-1/3 mr-2">場所</label>
        <select
          value={prefCode}
          onChange={(e) => handlePrefChangeWithPrefName(Number(e.target.value))}
          style={{ width: "610px" }}
          className="border border-gray-300 p-2 bg-white text-black w-2/3 rounded-sm"
        >
          {prefectures.map((pref) => (
            <option key={pref.code} value={pref.code}>
              {pref.name}
            </option>
          ))}
        </select>
      </div>
      <hr className="border-gray-300 mb-4" />

      {/* 年度 */}
      <div className="flex items-center mb-4">
        <img
          src={CalendarIcon}
          alt="Calendar Icon"
          width="20"
          height="20"
          className="mr-2 text-gray-300"
        />
        <label className="w-1/3 mr-2">年度</label>
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          style={{ width: "610px" }}
          className="border border-gray-300 p-2 bg-white text-black w-2/3 rounded-sm"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <hr className="border-gray-300 mb-4" />

      {/* 表示タイプ */}
      <div className="flex items-start mb-4">
        <img
          src={TypeIcon}
          alt="Type Icon"
          width="20"
          height="20"
          className="mr-2 text-gray-300"
        />
        <label className="w-1/6 mr-2">種類</label>
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
