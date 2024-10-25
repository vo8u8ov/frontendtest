// src/App.tsx

import Header from "./components/Header";
import Footer from "./components/Footer";
import DataDisplayArea from "./components/DataDisplayArea";

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <div className="flex flex-grow">
        <div className="flex-grow p-4">
          <DataDisplayArea />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
