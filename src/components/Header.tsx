// src/components/Header.tsx
import React from "react";

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
    ></header>
  );
};

export default Header;
