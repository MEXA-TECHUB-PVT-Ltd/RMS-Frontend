import "./App.css";
import { useSelector } from "react-redux";
import Router from "./router/Router";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import AuthNavigator from "./navigation/auth/AuthNavigator";

function App() {
  const theme = useSelector((state) => state.theme);
  const { token } = useSelector((state) => state.user);

  return (
    <div
      className={`full ${
        theme.mode === "dark" && "dark"
      }  dark:bg-dark_bg_4 bg-white dark:text-dark_text_1`}
    >
      {/* {token ? ( */}
      <>
        <Sidebar />
        <div className={`routes-container ${!theme.isSideBarOpen && "w-full"}`}>
          <Navbar />
          <div className="main-content">
            <Router />
          </div>
        </div>
      </>
      {/* ) : (
        <AuthNavigator />
      )} */}
    </div>
  );
}

export default App;
