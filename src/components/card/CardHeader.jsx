import React from "react";
import { useSelector } from "react-redux";

const CardHeader = ({ title }) => {
  const { textColor } = useSelector((state) => state.theme);
  return (
    <div
      // border-b-[.5px] dark:border-b-white/20 ${textColor}
      className={`mt-2 mb-5`}
      style={{ color: "#000000", fontWeight: 600, letterSpacing: "1px", fontSize: "20px" }}
    >
      {title}
    </div>
  );
};

export default CardHeader;
