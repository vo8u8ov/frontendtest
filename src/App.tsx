// src/App.tsx

import Header from "./components/Header";
import Footer from "./components/Footer";
import DataDisplayArea from "./components/DataDisplayArea";

const App: React.FC = () => {
  return (
    <div
      style={{
        width: "1920px", // プロジェクト全体の固定幅
        height: "1080px", // プロジェクト全体の固定高さ
        display: "flex", // フレックスボックスを使用
        flexDirection: "column", // 垂直方向に並べる
        gap: "0px", // 要素間の間隔
      }}
    >
      <Header />
      <DataDisplayArea />
      <Footer />
    </div>
  );
};

export default App;
