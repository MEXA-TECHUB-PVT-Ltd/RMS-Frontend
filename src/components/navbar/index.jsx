import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setThemeColor,
  toggleSideBar,
  toggleTheme,
} from "../../app/features/Theme/themeSlice";
import { FaBars, FaRegMoon } from "react-icons/fa";
import { MdOutlineLightMode } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import Modal from "../modal/Modal";
import ColorCard from "../theme/ColorCard";
import { logOutUser } from "../../app/features/User/userSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const [showSetting, setShowSetting] = useState(false);
  const [isActiveDropDown, setIsActiveDropDown] = useState(false);
  const theme = useSelector((state) => state.theme);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleThemeColor = (color) => {
    dispatch(setThemeColor(color));
  };

  const handleToggleDropDown = () => {
    setIsActiveDropDown((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsActiveDropDown(false);
    }
  };

  const handleLogout = () => {
    dispatch(logOutUser());
    navigate("/");
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSideBar());
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-50 navbar">
      <div className="flex-center gap-2">
        <FaBars
          size={20}
          className={`${!theme.isSideBarOpen ? "block" : "hidden"} `}
          onClick={handleToggleSidebar}
        />
        {/* {theme.mode === "light" ? (
          <FaRegMoon
            onClick={handleToggleTheme}
            className="text-light_text_1"
            size={20}
          />
        ) : (
          <MdOutlineLightMode
            onClick={handleToggleTheme}
            color="white"
            size={20}
          />
        )} */}
      </div>
      <div className="flex-center gap-2 relative">
        <CiSettings
          size={23}
          className="hover:opacity-60"
        // onClick={() => setShowSetting(true)}
        />
        <div
          className="flex-center gap-2"
          onClick={() => setIsActiveDropDown((prev) => !prev)}
        >
          <div className={`avatar bg-blue-950`}>A</div>
          <h1 className="avatar-text">Admin</h1>
        </div>

        {/* // ------------------------------------------- Dropdown Menu -------------------------------------------------------------- */}

        {isActiveDropDown && (
          <div className="dropdown-menu" ref={dropdownRef}>
            <p className="dropdown-item" onClick={handleToggleDropDown}>
              Change Password
            </p>
            <p className="dropdown-item" onClick={handleLogout}>
              Logout
            </p>
          </div>
        )}
      </div>

      {/* // ------------------------------------------- Theme Modal -------------------------------------------------------------- */}

      <Modal
        isOpen={showSetting}
        onClose={() => setShowSetting(false)}
        title="Settings"
      >
        <h1 className="sub-heading">Theme Color</h1>
        <div className="theme-color">
          <ColorCard
            color={"bg-yellow-500"}
            onClick={() => handleThemeColor("yellow-500")}
          />
          <ColorCard
            color={"bg-blue-500"}
            onClick={() => handleThemeColor("blue-500")}
          />
          <ColorCard
            color={"bg-green-500"}
            onClick={() => handleThemeColor("green-500")}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Navbar;
