// src/App.tsx

import Header from "./components/Header";
import Footer from "./components/Footer";
import DataDisplayArea from "./components/DataDisplayArea";

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen text-white">
      <Header />
      <div className="flex flex-grow">
        <DataDisplayArea />
      </div>
      <Footer />
    </div>
  );
};

export default App;
