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
  const [averagePrice, setAveragePrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<{
    [key: string]: EstateTransactionResponse;
  }>({});

  // 初期データの取得
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const allPrefDataPromises = Array.from({ length: 47 }, (_, i) =>
          fetchEstateTransactionData(i + 1, selectedYear, displayType)
        );

        const allPrefData = await Promise.all(allPrefDataPromises);

        // キャッシュに全データを保存
        const newCache: { [key: string]: EstateTransactionResponse } = {};

        allPrefData.forEach((data, index) => {
          // データが正しいか確認
          if (data && data.data) {
            newCache[`${index + 1}-${selectedYear}-${displayType}`] = data; // 正しいキーでキャッシュに保存
          }
        });

        setCache(newCache);

        // 全国平均価格を計算
        const allPrices = allPrefData.flatMap((data) =>
          data.data.map((item) => item.price)
        );
        const avgPrice =
          allPrices.length > 0
            ? allPrices.reduce((sum, price) => sum + price, 0) /
              allPrices.length
            : 0;

        setAveragePrice(avgPrice);

        // 東京都のデータを取得
        const tokyoData = allPrefData[0]; // 東京都のデータを取得
        setPriceData(tokyoData);
      } catch (err) {
        console.error("データの取得エラー:", err);
        setError("データの取得に失敗しました。");
      }
    };

    fetchInitialData();
  }, [selectedYear, displayType]); // 初期データ取得時に依存

  // データ取得のハンドラー
  useEffect(() => {
    const cacheKey = `${prefCode}-${selectedYear}-${displayType}`; // キャッシュキーを作成

    if (cache[cacheKey]) {
      // キャッシュからデータを取得
      setPriceData(cache[cacheKey]);
      setError(null); // エラーをリセット
    } else {
      // キャッシュにデータがない場合のみAPI呼び出しとエラーメッセージ設定
      const fetchAndCacheData = async () => {
        try {
          const data = await fetchEstateTransactionData(
            prefCode,
            selectedYear,
            displayType
          );
          setPriceData(data);

          // キャッシュに新たに保存
          setCache((prevCache) => ({
            ...prevCache,
            [cacheKey]: data,
          }));

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
              {/* 全国平均取引価格を表示 */}
              <p>東京都の価格: {priceData.data[0]?.price} 円/㎡</p>
              <p>全国平均の価格: {averagePrice.toFixed(2)} 円/㎡</p>
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
