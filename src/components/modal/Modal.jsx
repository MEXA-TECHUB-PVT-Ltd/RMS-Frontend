import React from "react";
import AppModal from "react-modal";
import Button from "../form/Button";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";

const Modal = ({ title, onClose, isOpen, size = "sm", children }) => {
  const theme = useSelector((state) => state.theme.mode);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      zIndex: 999,
    },
  };

  return (
    <AppModal
      appElement={document.getElementById("root")}
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      className={`${
        theme === "dark" && "dark"
      } fixed h-auto max-h-[97vh] w-[95%] ${
        size === "sm"
          ? "md:w-[35%]"
          : size === "md"
          ? "md:w-[60%]"
          : size === "lg"
          ? "md:w-[97%]"
          : "md:w-[35%]"
      }  bg-white dark:bg-dark_bg_4 shadow-sm outline-none rounded p-3 dark:text-dark_text_1  overflow-auto`}
    >
      <div className="flex-between cursor-pointer">
        <h1 className="font-semibold">{title}</h1>
        <p
          onClick={onClose}
          className="cursor-pointer text-3xl float-end  hover:opacity-90 hover:text-red-500  dark:text-dark_text_1"
        >
          <IoClose />
        </p>
      </div>
      <div className="mt-5">{children}</div>
    </AppModal>
  );
};

export default Modal;
