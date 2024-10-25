import React from "react";
import { Bar } from "react-chartjs-2";

interface ChartData {
  year: number;
  price: number;
}

interface RealEstateChartProps {
  data: ChartData[]; // 受け取るdataの型を指定
  year: number; // 年を受け取る
}

const RealEstateChart: React.FC<RealEstateChartProps> = ({ data, year }) => {
  // Chart.js用のデータ整形
  const chartData = {
    labels: data.map((item) => item.year), // ラベルを年度に設定
    datasets: [
      {
        label: `不動産価格 (${year})`,
        data: data.map((item) => item.price), // 価格データを取得
        backgroundColor: "rgba(75, 192, 192, 0.6)", // バーの色
      },
    ],
  };

  return (
    <div>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default RealEstateChart;
