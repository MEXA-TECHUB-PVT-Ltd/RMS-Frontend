import React from "react";

const Card = ({ children }) => {
  return (
    <div className="card bg-white border-none">
      <div className="card-body">{children}</div>
    </div>
  );
};

export default Card;
