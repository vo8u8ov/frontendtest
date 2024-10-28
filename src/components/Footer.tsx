// src/Footer.tsx
import React from "react";
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
        <a href="/terms" className="flex items-center mr-4">
          利用規約
          <svg
            className="h-5 w-5 mr-1 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v8m0 0v4m0-4H8m4 0h4"
            />
          </svg>
        </a>
        <a href="/privacy" className="flex items-center">
          プライバシーポリシー
          <svg
            className="h-5 w-5 mr-1 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v8m0 0v4m0-4H8m4 0h4"
            />
          </svg>
        </a>
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
