import React from "react";
import { FaList } from "react-icons/fa";
import { IoGridOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const GridButton = ({ onListView, onGridView, grid }) => {
  const { textColor } = useSelector((state) => state.theme);

  return (
    <div className="grid-button bg-gray-200 rounded-lg">
      <div
        onClick={onListView}
        className={`flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-opacity duration-200 
                    ${!grid ? 'bg-white text-black' : 'bg-transparent'} 
                    hover:opacity-60`}
      >
        <FaList size={16} />
      </div>
      <div
        onClick={onGridView}
        className={`flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-opacity duration-200 
                    ${grid ? 'bg-white text-black' : 'bg-transparent'} 
                    hover:opacity-60`}
      >
        <IoGridOutline size={16} />
      </div>
    </div>
  );
};

export default GridButton;
