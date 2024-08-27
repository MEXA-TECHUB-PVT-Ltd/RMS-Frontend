import React from "react";
import { useSelector } from "react-redux";

const AppSelect = ({ value, onChange, options, label, error }) => {
  const theme = useSelector((state) => state.theme);

  return (
    <div className="w-full">
      <label className="block text-sm font-normal text-light_text_1 dark:text-dark_text_1 mb-1 tracking-wide">
        {label}
      </label>

      <div
        className={`flex items-center border rounded-md overflow-hidden focus-within:${theme.borderColor}`}
      >
        <select value={value} onChange={onChange} className="app-input">
          <option value="">{label}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default AppSelect;
