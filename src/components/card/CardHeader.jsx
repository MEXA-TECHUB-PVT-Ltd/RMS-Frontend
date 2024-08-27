import React from "react";
import { useSelector } from "react-redux";

const CardHeader = ({ title }) => {
  const { textColor } = useSelector((state) => state.theme);
  return (
    <div
      className={`logo-text mt-2 mb-5 border-b-[.5px] dark:border-b-white/20 ${textColor}`}
    >
      {title}
    </div>
  );
};

export default CardHeader;
