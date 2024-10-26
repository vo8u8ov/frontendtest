// DataDisplayArea.tsx
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
import { fetchEstateTransactionData } from "../api";
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
  const [selectedYear, setSelectedYear] = useState<number>(2009);
  const [displayType, setDisplayType] = useState<number>(1);
  const [priceData, setPriceData] = useState<EstateTransactionResponse | null>(
    null
  );
  const [averagePrice, setAveragePrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<{
    [key: string]: EstateTransactionResponse;
  }>({});

  // データ取得のハンドラー
  useEffect(() => {
    const cacheKey = `${prefCode}-${selectedYear}-${displayType}`; // キャッシュキーを作成

    if (cache[cacheKey]) {
      // キャッシュからデータを取得
      setPriceData(cache[cacheKey]);
      setError(null); // エラーをリセット
    } else {
      const fetchAndCacheData = async () => {
        try {
          // 選択都道府県データの取得
          const data = await fetchEstateTransactionData(
            prefCode,
            selectedYear,
            displayType
          );
          setPriceData(data);
          setCache((prevCache) => ({ ...prevCache, [cacheKey]: data }));

          // 全国データを取得して平均計算
          const allPrefDataPromises = Array.from({ length: 2 }, (_, i) =>
            fetchEstateTransactionData(i + 1, selectedYear, displayType)
          );
          const allPrefData = await Promise.all(allPrefDataPromises);

          // 全国平均価格を計算
          const totalValue = allPrefData.reduce((sum, prefData) => {
            return sum + (prefData.data[0]?.price || 0);
          }, 0);
          const avgPrice = totalValue / 47; // 都道府県数で割って平均を出す
          setAveragePrice(avgPrice);

          setError(null);
        } catch (err) {
          console.error("データ取得エラー:", err);
          setError("キャッシュにデータがありません。");
        }
      };

      fetchAndCacheData();
    }
  }, [prefCode, selectedYear, displayType, cache]);

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

  // グラフのデータと設定
  const chartData = {
    labels: ["選択した都道府県", "全国平均"],
    datasets: [
      {
        label: "取引価格 (円/㎡)",
        data: [priceData ? priceData.data[0]?.price : 0, averagePrice],
        backgroundColor: ["#4C9F70", "#FF6347"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 10,
          },
        },
      },
      title: {
        display: true,
        text: `${selectedYear}年の取引価格 (円/㎡)`,
        font: {
          size: 14,
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "取引価格 (円/㎡)",
          font: {
            size: 12,
          },
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 10,
          },
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
              <Bar data={chartData} options={chartOptions} />
            </div>
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
