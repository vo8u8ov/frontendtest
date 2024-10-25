// src/App.tsx
import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UIPanel from "./components/UIPanel";
import DataDisplayArea from "./components/DataDisplayArea";

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
      <div className="flex flex-grow">
        <div className="flex-grow p-4">
          <DataDisplayArea />
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
