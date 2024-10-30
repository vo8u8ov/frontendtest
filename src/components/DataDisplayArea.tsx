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
import BackgroundImage from "../backgroundimage.svg";
import Frame1395 from "../Frame1395.svg";
import MapIcon from "../marker2.svg";
import CalendarIcon from "../calendar-check2.svg";
import TypeIcon from "../resources2.svg";
import GraphIcon from "../graphicon.svg";

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
                if (latestApiData) {
                  allPrefData[i] = latestApiData;
                  // localStorageに最新データを保存
                  localStorage.setItem(
                    `prefData_${i}_${displayType}_${selectedYear}`,
                    JSON.stringify(allPrefData[i]) // allPrefData[i]を保存
                  );
                  console.log(
                    "APIからデータ取得してローカルストレージに保存:",
                    i
                  );
                } else {
                  console.error("取得したデータがnullまたはundefinedです。");
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
        // 現在選択されている都道府県のデータを取得
        if (allPrefData[prefCode]) {
          setEstateData(allPrefData[prefCode]);
          console.log("キャッシュデータを使用");
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

  // グラデーションを生成する関数
  const getGradient = (
    ctx: CanvasRenderingContext2D,
    chartArea: { left: number; right: number; top: number; bottom: number },
    colorStart: string,
    colorEnd: string
  ) => {
    const gradient = ctx.createLinearGradient(
      chartArea.right, // 右下
      chartArea.bottom, // 右下
      chartArea.left, // 左上
      chartArea.top // 左上
    );
    gradient.addColorStop(0, colorStart); // 開始色: 緑
    gradient.addColorStop(1, colorEnd); // 終了色: 黄緑
    return gradient;
  };

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
        backgroundColor: (context: {
          chart: {
            ctx: CanvasRenderingContext2D;
            chartArea: {
              left: number;
              right: number;
              top: number;
              bottom: number;
            } | null;
          };
          dataIndex: number;
        }) => {
          const { ctx, chartArea } = context.chart;

          // chartAreaが未定義の場合はシンプルな色配列を返す
          if (!chartArea) {
            return context.dataIndex === 0 ? "#97BF4A" : "#f8c471";
          }

          // chartAreaが利用可能な場合はグラデーションを作成して返す
          const color1 = getGradient(ctx, chartArea, "#97BF4A", "#009984"); // prefName用
          const color2 = getGradient(ctx, chartArea, "#57544C", "#706D65"); // 全国平均用
          return context.dataIndex === 0 ? color1 : color2;
        },
        maxBarThickness: 200, // バーの最大幅（px単位）
        minBarLength: 200, // バーの最小幅（px単位）
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
          font: {
            size: 12,
          },
          color: "rgba(255, 255, 255, 1)",
        },
        grid: {
          drawOnChartArea: false, // グリッド線をチャートエリアには描画しない
          color: "rgba(255, 255, 255, 1)", // グリッド線の色を白に設定
          lineWidth: 1, // グリッド線の太さを設定
        },
        ticks: {
          color: "rgba(255, 255, 255, 1)",
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
          color: "rgba(255, 255, 255, 1)",
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
    <div
      style={{
        backgroundColor: "#000000",
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "1920px",
        height: "956px",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "40px",
      }}
    >
      <div
        style={{
          width: "1840px",
          height: "56px",
          padding: "0 0 16px 0",
          borderBottom: "1px solid",
        }}
      >
        {/* 取引価格セクション */}
        <div
          className="flex flex-col"
          style={{
            width: "1840px",
            height: "auto",
            padding: "0px 0px 16px 0px",
            gap: "16px",
            border: "0px 0px 1px 0px",
            borderBottom: "1px solid #FFFFFF33",
          }}
        >
          <div
            className="flex items-center"
            style={{
              width: "auto",
              height: "auto",
              gap: "8px",
            }}
          >
            <div
              className="flex items-center"
              style={{
                width: "auto",
                height: "auto",
                padding: "0px 5px 0px 0px",
                gap: "10px",
              }}
            >
              <img
                src={GraphIcon} // GraphIconに変更
                alt="取引価格"
                style={{ width: "27px", height: "30px" }}
              />
              <p
                className="text-sm"
                style={{
                  width: "128px",
                  height: "40px",
                  lineHeight: "40px",
                  fontFamily: "Noto Sans JP",
                  fontSize: "32px",
                  fontWeight: 400,
                  color: "#FFFFFF",
                }}
              >
                取引価格
              </p>
            </div>
            <div className="flex items-center">
              <p
                style={{
                  width: "131px",
                  height: "21px",
                  lineHeight: "20.57px",
                  fontFamily: "Noto Sans JP",
                  fontSize: "13.71px",
                  fontWeight: 400,
                  whiteSpace: "nowrap", // Prevent text wrapping
                  overflow: "visible", // Allow overflow to be visible
                  color: "#FFFFFF",
                }}
              >
                ※取引面積1㎡あたり
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "1840px",
          height: "780px",
          display: "flex",
          gap: "24px",
        }}
      >
        <div
          style={{
            width: "1457px",
            height: "780px",
            display: "flex",
            flexDirection: "column",
            gap: "80px",
          }}
        >
          {/* {error ? (
          <p className="text-red-500">{error}</p>
        ) : ( */}
          <div
            style={{
              width: "1457px",
              height: "780px",
              display: "flex",
              justifyContent: "center", // 横方向の中央寄せ
              alignItems: "center", // 縦方向の中央寄せ
            }}
          >
            {/* 子1と子2をラップするコンテナ */}
            <div
              style={{
                display: "flex",
                flexDirection: "column", // 子1と子2を縦並びにする
                gap: "48px",
              }}
            >
              {/* 子1 */}
              <div
                style={{
                  width: "auto",
                  height: "auto",
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                }}
              >
                {/* MapIconとprefNameのセット */}
                <div
                  className="flex items-center"
                  style={{
                    gap: "12px",
                  }}
                >
                  <img src={MapIcon} alt="Map Icon" width="14" height="18" />

                  <p
                    style={{
                      width: "72px",
                      height: "30px",
                      lineHeight: "30px",
                      fontFamily: "Noto Sans JP",
                      fontSize: "24px",
                      fontWeight: 400,
                      color: "#FFFFFF",
                    }}
                  >
                    {prefName}
                  </p>
                </div>
                {/* MapIconとprefNameのセット */}
                <div
                  className="flex items-center"
                  style={{
                    gap: "12px",
                  }}
                >
                  <img src={MapIcon} alt="Map Icon" width="14" height="18" />

                  <p
                    style={{
                      width: "72px",
                      height: "30px",
                      lineHeight: "30px",
                      fontFamily: "Noto Sans JP",
                      fontSize: "24px",
                      fontWeight: 400,
                      color: "#FFFFFF",
                    }}
                  >
                    {prefName}
                  </p>
                </div>
                {/* MapIconとprefNameのセット */}
                <div
                  className="flex items-center"
                  style={{
                    gap: "12px",
                  }}
                >
                  <img src={MapIcon} alt="Map Icon" width="14" height="18" />

                  <p
                    style={{
                      width: "72px",
                      height: "30px",
                      lineHeight: "30px",
                      fontFamily: "Noto Sans JP",
                      fontSize: "24px",
                      fontWeight: 400,
                      color: "#FFFFFF",
                    }}
                  >
                    {prefName}
                  </p>
                </div>
              </div>

              {/* 子2 */}
              <div
                style={{
                  width: "53px",
                  height: "12px",
                  marginLeft: "15px",
                  marginBottom: "-30px",
                }}
              >
                <p
                  style={{
                    fontFamily: "Noto Sans JP",
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "12px",
                    textAlign: "right",
                    color: "#FFFFFF",
                  }}
                >
                  (円/㎡)
                </p>
              </div>

              {/* 子3 */}
              <div
                style={{
                  width: "auto",
                  height: "auto",
                }}
              >
                <div
                  style={{
                    width: "660px", // temp
                    height: "446px", // 高さを446pxに固定
                    padding: "0px 0px 5px 0px",
                    gap: "10px",
                  }}
                >
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {" "}
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
