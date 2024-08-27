import React from "react";
import { FaList } from "react-icons/fa";
import { IoGridOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const GridButton = ({ onListView, onGridView, grid }) => {
  const { textColor } = useSelector((state) => state.theme);
  return (
    <div className={`grid-button`}>
      <FaList
        size={20}
        onClick={onListView}
        className={`hover:opacity-60 ${!grid && textColor}`}
      />
      <IoGridOutline
        size={20}
        onClick={onGridView}
        className={`hover:opacity-60 ${grid && textColor}`}
      />
    </div>
  );
};

export default GridButton;
