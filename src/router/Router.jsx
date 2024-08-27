import React, { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import router from "./routes";

const Router = () => {
  return (
    <Fragment>
      <Routes>
        {router.map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Fragment>
  );
};

export default Router;
