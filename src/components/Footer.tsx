// src/Footer.tsx
import React from "react";
import FooterNav from "../footerNav.svg";
import CopyrightLogo from "../copyright.svg";

const Footer: React.FC = () => {
  return (
    <footer
      className="flex justify-between items-center"
      style={{
        width: "1920px",
        height: "50px",
        backgroundColor: "#000000CC",
        padding: "16px 32px",
        borderTop: "1px solid #FFFFFF33",
      }}
    >
      <div className="flex items-center">
        <div
          className="flex items-center"
          style={{
            width: "232px", // Set width to 232px
            height: "18px", // Set height to 18px
            gap: "24px", // Set gap to 24px
          }}
        >
          <img src={FooterNav} alt="Terms Icon" />
        </div>
      </div>
      <div className="flex items-center" style={{ gap: "24px" }}>
        <img
          src={CopyrightLogo}
          alt="Copyright"
          style={{ width: "auto", height: "18px" }} // Height set to 18px
        />
      </div>
    </footer>
  );
};

export default Footer;
