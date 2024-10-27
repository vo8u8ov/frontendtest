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

        // すべての都道府県データを取得
        const allPrefData: Record<number, EstateTransactionResponse> = {};
        const fetchPromises = Array.from({ length: 47 }, (_, i) => i + 1).map(
          async (i) => {
            const localData = localStorage.getItem(
              `prefData_${i}_${displayType}_${selectedYear}`
            );
            if (localData) {
              allPrefData[i] = JSON.parse(localData);
              console.log("ローカルストレージからデータ取得:", i);
            } else {
              const apiData = await fetchDataFromFirebase(
                i,
                displayType,
                selectedYear
              );
              if (!apiData) {
                console.log("データがないため保存:", i);
                await saveDataToFirebase(i, displayType, selectedYear);

                // Firebaseから最新データを再取得
                const latestApiData = await fetchDataFromFirebase(
                  i,
                  displayType,
                  selectedYear
                );

                console.log("latestApiData:", latestApiData);
                if (!latestApiData) {
                  console.error("取得したデータがnullまたはundefinedです。");
                } else {
                  // latestApiDataが存在すればそれを使用、存在しなければデフォルトのオブジェクトを使用
                  allPrefData[i] = latestApiData;

                  // localStorageにはlatestApiDataを保存
                  localStorage.setItem(
                    `prefData_${i}_${displayType}_${selectedYear}`,
                    JSON.stringify(allPrefData[i]) // allPrefData[i]を保存
                  );

                  console.log(
                    "APIからデータ取得してローカルストレージに保存:",
                    i
                  );
                }
              } else {
                allPrefData[i] = apiData;
                localStorage.setItem(
                  `prefData_${i}_${displayType}_${selectedYear}`,
                  JSON.stringify(apiData)
                );
                console.log(
                  "APIからデータ取得してローカルストレージに保存:",
                  i
                );
              }
            }
          }
        );

        // すべての都道府県のデータ取得の完了を待つ
        await Promise.all(fetchPromises);
        console.log("都道府県データ：", allPrefData);

        // 全国平均の計算
        let totalValue = 0;

        for (let i = 1; i <= 47; i++) {
          const yearData = allPrefData[i]?.years.find(
            (year) => year.year === selectedYear
          );
          if (yearData?.value) {
            totalValue += yearData.value;
          }
        }

        let averagePrice = totalValue / 47;
        setAveragePrice(averagePrice);
        console.log("平均価格", averagePrice);

        // 現在選択されている都道府県のデータを取得
        if (allPrefData[prefCode]) {
          setEstateData(allPrefData[prefCode]);
          console.log("キャッシュデータを使用:", allPrefData[prefCode]);
        } else {
          console.log("現在の都道府県のデータが見つからなかったため保存します");
          const apiData = await fetchDataFromFirebase(
            prefCode,
            displayType,
            selectedYear
          );
          setEstateData(apiData);
          localStorage.setItem(
            `prefData_${prefCode}_${displayType}_${selectedYear}`,
            JSON.stringify(apiData)
          );
          console.log(
            "APIから取得したデータをローカルストレージに保存:",
            apiData
          );
        }
      } catch (err) {
        console.error("データ取得エラー:", err);
        setError("データ取得に失敗しました。");
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
    setPrefCode(prefCode);
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
