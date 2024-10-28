// src/App.tsx

import Header from "./components/Header";
import Footer from "./components/Footer";
import DataDisplayArea from "./components/DataDisplayArea";

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen text-white">
      <Header />
      <DataDisplayArea />
      <Footer />
    </div>
  );
};

export default App;
