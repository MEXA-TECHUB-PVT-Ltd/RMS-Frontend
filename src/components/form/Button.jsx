import React from "react";
import { useSelector } from "react-redux";

const Button = ({
  onClick,
  icon: BtnIcon,
  title,
  width = false,
  spinner = null,
  color = null,
}) => {
  const theme = useSelector((state) => state.theme);

  return (
    <div
      onClick={onClick}
      className={`h-10 px-4 py-1 ${color ? color : "bg-blue-950"} ${width && "w-full py-2"
        } rounded-lg text-white cursor-pointer flex-center gap-2`}
    >
      {spinner && spinner}

      {BtnIcon && <BtnIcon className="text-white size-4" />}
      {title && (
        <h1
          className={`text-white md:text-sm text-xs font-[700] tracking-widest`}
        >
          {title}
        </h1>
      )}
    </div>
  );
};

export default Button;
