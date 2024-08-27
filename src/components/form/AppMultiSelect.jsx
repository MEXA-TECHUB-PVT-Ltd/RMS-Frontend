import React from "react";
import Select from "react-select";
import { useSelector } from "react-redux";

const AppMultiSelect = ({ value, onChange, options, label, error, isMulti = false }) => {
    const theme = useSelector((state) => state.theme);

    // Handle change for both single and multi-select
    const handleChange = (selectedOption) => {
        if (isMulti) {
            onChange(selectedOption ? selectedOption.map(option => option.value) : []);
        } else {
            onChange(selectedOption ? selectedOption.value : "");
        }
    };

    // Determine the selected value(s) for react-select
    const selectedValue = isMulti
        ? options.filter(option => value.includes(option.value))
        : options.find(option => option.value === value) || null;

    return (
        <div className="w-full">
            <label className="block text-sm font-normal text-light_text_1 dark:text-dark_text_1 mb-1 tracking-wide">
                {label}
            </label>
            <Select
                value={selectedValue}
                onChange={handleChange}
                options={options}
                isMulti={isMulti}
                classNamePrefix="react-select"
                className="w-full"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default AppMultiSelect;
