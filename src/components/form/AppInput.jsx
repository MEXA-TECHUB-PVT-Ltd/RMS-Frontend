import React from "react";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AppInput = ({
  label,
  value,
  name,
  onChange,
  type = "text",
  icon: BtnIcon,
  onIconClick,
  ...otherProps
}) => {
  const theme = useSelector((state) => state.theme);

  // Handle date changes if the type is 'date'
  const handleDateChange = (date) => {
    onChange({ target: { name, value: date } });
  };

  return (
    <div className="text-light_text_1 dark:text-dark_text_1 w-full">
      {label && (
        <label
          htmlFor={label}
          className="block text-lg font-normal text-light_text_1 dark:text-dark_text_1 mb-1 tracking-wide"
        >
          {label}
        </label>
      )}
      {/* ${theme.borderColor} */}
      <div
        className={`flex items-center border rounded-md overflow-hidden`}
      >
        {type === "date" ? (
          <div className="flex-1">
            <DatePicker
              selected={value ? new Date(value) : null} // Convert string to Date object
              onChange={handleDateChange}
              dateFormat="MM/dd/yyyy" // Customize date format as needed
              className="app-input w-full px-3 py-2" // Ensure full width and padding
              {...otherProps}
            />
          </div>
        ) : type === "textarea" ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            {...otherProps}
            className="app-input resize-none h-32 w-full px-3 py-2" // Ensure textarea takes full width and has padding
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            {...otherProps}
            className="app-input w-full px-3 py-2" // Ensure input takes full width and has padding
          />
        )}
        {BtnIcon && (
          <button
            type="button"
            className="flex items-center justify-center px-4 py-2 text-white border-none outline-none"
            onClick={onIconClick}
          >
            <BtnIcon className="text-lg text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AppInput;
