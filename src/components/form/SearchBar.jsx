import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

const SearchBar = ({ onChange, field }) => {
  const { borderColor } = useSelector((state) => state.theme);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onChange(value);
  };

  return (
    <div className={`search-container focus-within:${borderColor}`}>
      <FaSearch className="text-gray-600 text-lg" />
      <input
        className="search-input"
        type="text"
        placeholder={`Search by ${field}`}
        value={searchQuery}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
