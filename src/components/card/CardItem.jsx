import React from "react";

const CardItem = ({ title, value }) => {
  return (
    // <div className="flex items-center gap-3"> {/* Added flexbox classes */}
    //   <h1 className="font-medium mb-1" style={{ color: "#353535", fontSize: "18px" }}>
    //     {title}:
    //   </h1>
    //   <h1 className="mb-1" style={{ color: "rgb(53, 53, 53,0.9)", fontSize: "16px" }}>{value || "Not Yet"}</h1>
    // </div>

    <div className="card-item">  

      <h1 className="font-medium" style={{ color: "#7A7A7A", fontSize: "16px" }}>
        {title}:
      </h1>
      <h1 style={{ color: "#1F2937", fontWeight: "bold", fontSize: "16px" }}>{value || "NOT YET"}</h1>
    </div>

  );
};

export default CardItem;
