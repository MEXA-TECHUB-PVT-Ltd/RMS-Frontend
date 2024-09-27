import React from "react";
import AppModal from "react-modal";
import Button from "../form/Button";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";

const VendorTypeModal = ({ title, onClose, isOpen, size = "sm", children }) => {
    const theme = useSelector((state) => state.theme.mode);

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "20px",
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
            className={`${theme === "dark" && "dark"
                } fixed h-auto max-h-[97vh] w-[95%] ${size === "sm"
                    ? "md:w-[30%]"
                    : size === "md"
                        ? "md:w-[60%]"
                        : size === "lg"
                            ? "md:w-[97%]"
                            : "md:w-[30%]"
                }  bg-white dark:bg-dark_bg_4 shadow-sm outline-none rounded p-3 dark:text-dark_text_1  overflow-auto`}
        >
            <div className="cursor-pointer text-3xl float-end  hover:opacity-90 hover:text-red-500  dark:text-dark_text_1">
                <IoClose onClick={onClose} />
            </div>

            <div className="p-7 align-right">
                <div className="mt-5">{children}</div>
            </div>

        </AppModal>
    );
};

export default VendorTypeModal;
