import React from "react";

const CardItem = ({ title, value }) => {
  return (
    <div className="card-item">
      <h1 className="font-medium text-base text-black/60 dark:text-white/60">
        {title}
      </h1>
      <h1 className="text-sm">{value || "Not Yet"}</h1>
    </div>
  );
};

export default CardItem;
