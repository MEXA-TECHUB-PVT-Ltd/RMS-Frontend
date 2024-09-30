import React from "react";
import Table from "react-data-table-component";
import { useSelector } from "react-redux";

const DataTable = ({ columns, data, ...rest }) => {
  const theme = useSelector((state) => state?.theme?.mode);

  const customStyles = {
    header: {
      style: {
        // backgroundColor:
        //   theme === "dark"
        //     ? "var(--primary-background)"
        //     : "var(--header-background)", // Change the header background color
        color:
          theme === "dark" ? "#FFFFFF" : "", // Change header text color
        fontSize: "1.2rem",
        fontWeight: "medium",
        // borderBottom: "2px solid var(--border-color)",
      },
    },
    headRow: {
      style: {
        backgroundColor:
          theme === "dark"
            ? "var(--primary-background)"
            : "#F8FAFC", // Change the head row background color
        // borderBottom: "2px solid var(--border-color)",
        paddingLeft: ".7em",
        fontSize: "1.3em",
      },
    },
    headCells: {
      style: {
        color:
          theme === "dark" ? "#CCCCCC" : "#6B7280", // Change column heading text color
        padding: "12px",
      },
    },
    rows: {
      style: {
        backgroundColor:
          theme === "dark"
            ? "var(--primary-background)"
            : "var(--secondary-background)",
        color:
          theme === "dark" ? "var(--primary-text)" : "var(--secondary-text)",
        padding: "12px",
        // borderBottom: "1px solid var(--border-color)",
        "&:last-of-type": {
          borderBottom: "0",
        },
      },
      highlightOnHoverStyle: {
        backgroundColor: theme === "dark" ? "#333" : "#f5f5f5",
      },
    },
    pagination: {
      style: {
        backgroundColor:
          theme === "dark"
            ? "var(--primary-background)"
            : "var(--secondary-background)",
        color:
          theme === "dark" ? "var(--primary-text)" : "var(--secondary-text)",
        // borderTop: "1px solid var(--border-color)",
        padding: "12px",
      },
    },
    subHeader: {
      style: {
        backgroundColor:
          theme === "dark"
            ? "var(--primary-background)"
            : "var(--secondary-background)",
        color:
          theme === "dark" ? "var(--primary-text)" : "var(--secondary-text)",
        padding: "12px",
      },
    },
  };

  const NoData = () => {
    return (
      <div className="text-center font-semibold text-light_text_1 dark:text-dark_text_1 dark:bg-dark_bg_5 w-full">
        There are no records to display
      </div>
    );
  };

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg"> {/* Table border */}
      <Table
        customStyles={customStyles}
        className="font-bold"
        columns={columns}
        noDataComponent={<NoData />}
        data={data}
        {...rest}
      />
    </div>
  );
};

export default DataTable;
