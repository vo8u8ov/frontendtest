// src/Footer.tsx
import React from "react";
import FooterNav from "../footerNav.svg";
import TermsIcon from "../terms.svg";
import PrivacyPolicyIcon from "../privacypolicy.svg";
import CopyrightLogo from "../copyright.svg";

const Footer: React.FC = () => {
  return (
    <footer
      className="flex justify-between items-center"
      style={{
        width: "1920px",
        backgroundColor: "#000000CC",
        padding: "16px 32px",
        borderTop: "1px solid #FFFFFF33",
      }}
    >
      <div className="flex items-center" style={{ gap: "24px" }}>
        <div>
          <div
            className="flex items-center"
            style={{
              width: "auto",
              height: "auto",
              gap: "8px",
            }}
          >
            <p
              className="text-sm"
              style={{
                width: "48px",
                height: "18px",
                lineHeight: "18px",
                fontFamily: "Noto Sans JP",
                fontSize: "12px",
                fontWeight: 400,
                color: "#FFFFFF",
              }}
            >
              利用規約
            </p>
            <img
              src={TermsIcon}
              alt="Terms Icon"
              style={{ width: "12px", height: "12px" }}
            />
          </div>
        </div>
        <div
          className="flex items-center"
          style={{
            width: "auto",
            height: "auto",
            gap: "24px",
          }}
        >
          <div
            className="flex items-center"
            style={{
              width: "auto",
              height: "auto",
              gap: "8px",
            }}
          >
            <p
              className="text-sm"
              style={{
                width: "120px",
                height: "18px",
                lineHeight: "18px",
                fontFamily: "Noto Sans JP",
                fontSize: "12px",
                fontWeight: 400,
                color: "#FFFFFF",
              }}
            >
              プライバシーポリシー
            </p>
            <img
              src={PrivacyPolicyIcon}
              alt="Privacy Policy Icon"
              style={{ width: "12px", height: "12px" }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center" style={{ gap: "24px" }}>
        <img
          src={CopyrightLogo}
          alt="Copyright"
          style={{ width: "101px", height: "18px" }}
        />
      </div>
    </footer>
  );
};

export default Footer;
