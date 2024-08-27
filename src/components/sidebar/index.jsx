import React, { useEffect } from "react";

import logo from "../../assets/react.svg";
import SidebarLayout from "../../layouts/SidebarLayout";
import { useDispatch, useSelector } from "react-redux";
import { CgClose } from "react-icons/cg";
import { toggleSideBar } from "../../app/features/Theme/themeSlice";

const Sidebar = () => {
  const isSideBarOpen = useSelector((state) => state.theme.isSideBarOpen);
  const dispatch = useDispatch();

  const handleToggleSidebar = () => {
    dispatch(toggleSideBar());
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && isSideBarOpen) {
        dispatch(toggleSideBar());
      }
      if (window.innerWidth >= 1024 && !isSideBarOpen) {
        dispatch(toggleSideBar());
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isSideBarOpen, dispatch]);

  return (
    <>
      {isSideBarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={handleToggleSidebar}
        ></div>
      )}
      <div
        className={`sidebar  ${
          isSideBarOpen
            ? "visible absolute lg:relative z-50 md:w-[30%] sm:w-[40%] w-[70%] lg:w-[17vw]"
            : "hidden"
        }`}
      >
        <div className="row mb-5 flex-between">
          <div className="flex-center gap-2">
            <img src={logo} alt="Logo" />
            <h1 className="logo-text">Vite Template</h1>
          </div>
          <CgClose onClick={handleToggleSidebar} size={20} />
        </div>
        <SidebarLayout />
      </div>
    </>
  );
};

export default Sidebar;
