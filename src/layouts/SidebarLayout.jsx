import React, { useState, useEffect } from "react";
import routes from "../navigation/vertical";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const SidebarLayout = () => {
  const theme = useSelector((state) => state.theme);
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);

  // Effect to set the initial active menu but not trigger any content display
  useEffect(() => {
    routes.forEach((item) => {
      if (item.submenu && item.submenu.some(sub => location.pathname !== sub.path)) {
        setActiveMenu(item.id); // Set the active menu to open the submenu initially
      }
    });
  }, []);

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  // Update: Only handle active tab state without affecting submenu
  const handleLinkClick = (id, hasSubmenu) => {
    // if (!hasSubmenu) {
    //   setActiveMenu(null); // Close the active menu if it's a tab without a submenu
    // }
  };

  return (
    <div>
      {routes.map((item, i) => {
        const isActive = location.pathname === item.path;

        return (
          <div key={i}>
            <div
              className={`link-container ${isActive && `bg-slate-100 text-blue-950 font-bold`}`}
            >
              <Link
                to={item.path}
                className="links flex items-center justify-between w-full"
                onClick={() => handleLinkClick(item.id, item.submenu)}
              >
                <div className="flex items-center">
                  <p>{item.icon}</p>
                  <h1 className="text-xs font-semibold ml-4">{item.title}</h1>
                </div>
                {item.submenu && (
                  <span
                    className="ml-0 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default link click behavior
                      toggleMenu(item.id); // Only toggle submenu visibility when the icon is clicked
                    }}
                  >
                    {activeMenu === item.id ? <FaAngleDown size={16} /> : <FaAngleUp size={16} />}
                  </span>
                )}
              </Link>
            </div>
            {item.submenu && activeMenu === item.id && (
              <div className="ml-6 border-l-2 border-gray-400">
                {item.submenu.map((subItem, j) => (
                  <div
                    key={j}
                    className={`link-container ${location.pathname === subItem.path && `bg-slate-100 text-blue-950 text-xs font-bold`}`}
                  >
                    <Link to={subItem.path} className="links flex items-center">
                      <p>{subItem.icon}</p>
                      <h1 className="text-xs font-bold ml-1">{subItem.title}</h1>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SidebarLayout;
