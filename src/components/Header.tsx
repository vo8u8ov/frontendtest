// src/components/Header.tsx
import React from "react";
import Logo from "../logo-landit.svg";

const Header: React.FC = () => {
  return (
    <header
      className="bg-gray-800 flex items-center gap-2"
      style={{
        height: "74px",
        width: "1920px",
        paddingRight: "24px",
        paddingLeft: "2px",
        backgroundColor: "#FFFFFF",
        gap: "10px",
      }}
    >
      <img src={Logo} alt="Landit Logo" style={{ width: "233px", height: "60px" }} />
    </header>
  );
};

export default Header;
