import React, { useState, useEffect } from "react";
import UIPanel from "./UIPanel";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { saveDataToFirebase, fetchDataFromFirebase } from "../api";
import { EstateTransactionResponse } from "../types";

// Chart.jsのコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DataDisplayArea: React.FC = () => {
  const [prefCode, setPrefCode] = useState<number>(1);
  const [prefName, setPrefName] = useState<string>("北海道");
  const [selectedYear, setSelectedYear] = useState<number>(2009);
  const [displayType, setDisplayType] = useState<number>(1);
  const [estateData, setEstateData] =
    useState<EstateTransactionResponse | null>(null);
  const [averagePrice, setAveragePrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // データ取得のハンドラー
  useEffect(() => {
    const fetchAndCacheData = async () => {
      try {
        console.log("トライ");
        const cachedData = await fetchDataFromFirebase(prefCode, displayType);
        if (cachedData) {
          setEstateData(cachedData);
          console.log("キャッシュデータを使用:", cachedData);
        } else {
          await saveDataToFirebase(prefCode, displayType, selectedYear);
          const apiData = await fetchDataFromFirebase(prefCode, displayType);
          setEstateData(apiData);
          console.log("APIから取得したデータをFirebaseに保存:", apiData);
        }

        // calculateAveragePriceをuseEffect内で定義
        const calculateAveragePrice = async () => {
          console.log("平均価格計算");
          const allPrices: number[] = [];

          // すべての都道府県データを取得
          for (let i = 1; i <= 2; i++) {
            const cachedData = await fetchDataFromFirebase(i, displayType);
            if (cachedData) {
              const value = cachedData.years.find(
                (yearData) => yearData.year === selectedYear
              )?.value;
              if (value) {
                allPrices.push(value);
              }
            }
          }

          // 全国平均価格を計算
          const totalValue = allPrices.reduce((sum, price) => sum + price, 0);
          const avgPrice =
            allPrices.length > 0 ? totalValue / allPrices.length : 0; // 都道府県数で割って平均を出す
          console.log("平均価格", avgPrice);
          setAveragePrice(avgPrice);
          setError(null);
        };

        // 全国平均価格を計算
        await calculateAveragePrice();
      } catch (err) {
        console.error("データ取得エラー:", err);
        setError("キャッシュにデータがありません。");
      }
    };

    fetchAndCacheData();
  }, [prefCode, displayType, selectedYear]);

  // 年度変更ハンドラー
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  // 都道府県変更ハンドラー
  const handlePrefChange = (prefCode: number) => {
    if (prefCode === 1) {
      setPrefCode(1);
      setPrefName("北海道");
    } else if (prefCode === 2) {
      setPrefCode(2);
      setPrefName("青森");
    }
  };

  const handlePrefNameChange = (prefName: string) => {
    setPrefName(prefName);
  };

  // 表示タイプ変更ハンドラー
  const handleDisplayTypeChange = (type: number) => {
    setDisplayType(type);
  };

  const displayTypeText =
    displayType === 1
      ? "土地(住宅地)"
      : displayType === 2
      ? "土地(商業地)"
      : displayType === 3
      ? "中古マンション等"
      : displayType === 4
      ? "農地"
      : displayType === 5
      ? "林地"
      : "";

  // グラフのデータと設定
  const chartData = {
    labels: [prefName, "全国平均"],
    datasets: [
      {
        label: "取引価格 (円/㎡)",
        data: [
          estateData
            ? estateData.years.find((year) => year.year === selectedYear)
                ?.value || 0
            : 0,
          averagePrice,
        ],
        backgroundColor: ["#4C9F70", "#FF6347"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // 凡例を非表示
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "円/㎡",
          font: {
            size: 12,
          },
        },
        grid: {
          drawOnChartArea: false, // グリッド線をチャートエリアには描画しない
          color: "rgba(255, 255, 255, 1)", // グリッド線の色を白に設定
          lineWidth: 1, // グリッド線の太さを設定
        },
        ticks: {
          font: {
            size: 10,
          },
        },
        border: {
          color: "rgba(255, 255, 255, 1)", // Y軸の外側の線の色
          width: 1, // Y軸の外側の線の太さ
        },
      },
      x: {
        ticks: {
          font: {
            size: 10,
          },
        },
        border: {
          color: "rgba(255, 255, 255, 1)", // X軸の外側の線の色
          width: 1, // X軸の外側の線の太さ
        },
      },
    },
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

      <div className="flex flex-col sm:flex-row justify-between mt-4 items-center">
        <div className="flex-grow flex justify-center">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div style={{ width: "50%", height: "500px" }}>
              <div className="text-center mb-2">
                <span className="text-lg font-semibold">
                  {prefName} {selectedYear}年 {displayTypeText}
                </span>
              </div>
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
        </div>
        <div className="w-full sm:w-1/4">
          {/* UIPanelをリスポンシブにする */}
          <UIPanel
            prefCode={prefCode}
            selectedYear={selectedYear}
            displayType={displayType}
            handlePrefChange={handlePrefChange}
            handlePrefNameChange={handlePrefNameChange}
            handleYearChange={handleYearChange}
            handleDisplayTypeChange={handleDisplayTypeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DataDisplayArea;
