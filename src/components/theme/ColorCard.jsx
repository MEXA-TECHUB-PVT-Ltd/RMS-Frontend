import React from "react";
import { CgTemplate } from "react-icons/cg";

const ColorCard = ({ color, onClick }) => {
  return <div className={`color-card ${color}`} onClick={onClick}></div>;
};

export default ColorCard;
