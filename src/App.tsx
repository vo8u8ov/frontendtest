// src/App.tsx
import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UIPanel from "./components/UIPanel";

const App: React.FC = () => {
  const [prefCode, setPrefCode] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(2009);
  const [displayType, setDisplayType] = useState<string>("landResidential");
  const [error, setError] = useState<string | null>(null);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handlePrefChange = (prefCode: number) => {
    setPrefCode(prefCode);
  };

  const handleDisplayTypeChange = (type: string) => {
    setDisplayType(type);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <div className="flex flex-grow p-4">
        <div className="flex-grow p-4">
          <h2 className="text-lg font-bold mb-1 flex items-center">
            {/* アイコン */}
            <span className="w-6 h-6 bg-gray-500 rounded mr-2"></span>
            <span className="text-2xl">取引価格</span>
            <span className="text-sm text-gray-400 ml-2 relative top-1">
              ※取引面積1㎡あたり
            </span>
          </h2>
          <hr className="border-t border-gray-500 my-2" />
        </div>
        <UIPanel
          prefCode={prefCode}
          selectedYear={selectedYear}
          displayType={displayType}
          handlePrefChange={handlePrefChange}
          handleYearChange={handleYearChange}
          handleDisplayTypeChange={handleDisplayTypeChange}
        />
      </div>
      <Footer />
    </div>
  );
};

export default App;
