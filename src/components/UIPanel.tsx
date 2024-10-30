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
      style={{
        width: "auto",
        height: "780px",
        padding: "24px",
        borderRadius: "4px",
        backgroundColor: "#F0F3F5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 表示内容を選択 */}
      <div
        style={{
          width: "311px",
          height: "auto",
          paddingBottom: "24px",
          gap: "24px",
        }}
      >
        <p
          style={{
            width: "112px",
            height: "24px",
            lineHeight: "24px",
            fontFamily: "Noto Sans JP",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          表示内容を選択
        </p>
      </div>

      {/* 場所 */}
      <div
        style={{
          width: "auto",
          height: "auto",
          padding: "24px 0px",
          borderTop: "1px solid #E5E5E5",
          gap: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <img src={MapIcon} alt="Map Icon" width="11" height="14" />
            <label>場所</label>
          </div>
          <select
            value={prefCode}
            onChange={(e) =>
              handlePrefChangeWithPrefName(Number(e.target.value))
            }
            style={{
              width: "240px",
              height: "auto",
              padding: "9px 12px 10px 12px",
              borderRadius: "2px",
            }}
            className="border border-gray-300 bg-white text-black"
          >
            {prefectures.map((pref) => (
              <option key={pref.code} value={pref.code}>
                {pref.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 年度 */}
      <div
        style={{
          width: "auto",
          height: "auto",
          padding: "24px 0px",
          borderTop: "1px solid #E5E5E5",
          gap: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <img
              src={CalendarIcon}
              alt="Calendar Icon"
              width="13"
              height="14"
            />
            <label>年度</label>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            style={{
              width: "240px",
              height: "auto",
              padding: "9px 12px 10px 12px",
              borderRadius: "2px",
            }}
            className="border border-gray-300 bg-white text-black"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 表示タイプ */}
      <div
        style={{
          width: "311px",
          height: "auto",
          padding: "24px 0px 0px 0px",
          borderTop: "1px solid #E5E5E5",
          gap: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <img src={TypeIcon} alt="Type Icon" width="14" height="14" />
            <label>種類</label>
          </div>

          <div
            style={{
              width: "239px",
              height: "auto",
              gap: "12px",
            }}
          >
            <label className="flex items-center" style={{ gap: "8px" }}>
              <input
                type="radio"
                value="landResidential"
                checked={displayType === 1}
                onChange={() => handleDisplayTypeChange(1)}
                className="mr-2"
              />
              土地(住宅地)
            </label>
            <label className="flex items-center" style={{ gap: "8px" }}>
              <input
                type="radio"
                value="landCommercial"
                checked={displayType === 2}
                onChange={() => handleDisplayTypeChange(2)}
                className="mr-2"
              />
              土地(商業地)
            </label>
            <label className="flex items-center" style={{ gap: "8px" }}>
              <input
                type="radio"
                value="usedApartment"
                checked={displayType === 3}
                onChange={() => handleDisplayTypeChange(3)}
                className="mr-2"
              />
              中古マンション等
            </label>
            <label className="flex items-center" style={{ gap: "8px" }}>
              <input
                type="radio"
                value="farmland"
                checked={displayType === 4}
                onChange={() => handleDisplayTypeChange(4)}
                className="mr-2"
              />
              農地
            </label>
            <label className="flex items-center" style={{ gap: "8px" }}>
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
      </div>
      <div
        style={{
          width: "311px",
          height: "316px",
          padding: "24px 0px 0px 0px",
          display: "flex", // フレックスボックスを使用
          flexDirection: "column", // 縦に並べる
          justifyContent: "flex-end", // ボタンを下部に配置
          gap: "24px",
        }}
      >
        <button
          onClick={() => console.log("データをダウンロード")}
          style={{
            width: "311px",
            height: "auto",
            padding: "13px 16px", // 指定されたパディング
            borderRadius: "2px 0px 0px 0px", // 左上の角だけ丸く
            backgroundColor: "#0071C1", // デフォルトの背景色
            color: "#ffffff", // テキストの色
            border: "none", // ボーダーを削除
            cursor: "pointer", // カーソルをポインターに
            transition: "background-color 0.3s", // ホバー時のスムーズな変化
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#005f99"; // ホバー時の色
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#0071C1"; // デフォルトの色に戻す
          }}
        >
          データをダウンロード
        </button>
      </div>
    </div>
  );
};

export default UIPanel;
