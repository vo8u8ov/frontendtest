// src/components/Header.tsx
import React from "react";
import Logo from "../logo-landit.svg";

const Header: React.FC = () => {
  return (
    <header
      className="bg-gray-800 flex items-center gap-10"
      style={{
        height: "74px",
        width: "100%",
        padding: "0px 24px 0px 2px",
        backgroundColor: "#FFFFFF",
      }}
    >
      <img
        src={Logo}
        alt="Landit Logo"
        style={{ width: "233px", height: "60px" }}
      />
    </header>
  );
};

export default Header;
