// src/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 p-4 text-left flex justify-between items-center">
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
      <p>&copy; 2023 Landit Inc.</p> {/* ここを変更 */}
    </footer>
  );
};

export default Footer;
