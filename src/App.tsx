// src/App.tsx

import Header from "./components/Header";
import Footer from "./components/Footer";
import DataDisplayArea from "./components/DataDisplayArea";
import BackgroundImage from "./background image.svg";

const App: React.FC = () => {
  return (
    <div
      className="flex flex-col min-h-screen text-white"
      style={{
        backgroundColor: "#000000CC", // Semi-transparent black
        backgroundImage: `url(${BackgroundImage})`, // Set the background image
        backgroundSize: "cover", // Cover the entire area
        backgroundPosition: "center", // Center the image
        backgroundRepeat: "no-repeat", // Do not repeat the image
        width: "1920px", // Fixed width
        // height: "956px", // Fixed height
        // padding: "40px", // Padding of 40px
      }}
    >
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
