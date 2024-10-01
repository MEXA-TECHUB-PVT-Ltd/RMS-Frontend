import React from "react";

const Card = ({ children }) => {
  return (
    <div className="card bg-white border-none" style={{ filter: "drop-shadow(0px 4px 3px rgba(0, 0, 0, 0.07)) drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.06))" }}>
      <div className="card-body">

        <h1 className="font-medium" style={{ color: "#7A7A7A", fontSize: "16px" }}>
          {children}
        </h1>
      </div>
    </div>

  );
};

export default Card;
