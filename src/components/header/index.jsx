import React from "react";
import SearchBar from "../form/SearchBar";
import Button from "../form/Button";
import GridButton from "../form/GridButton";
import FE_URL from "../../url_FE";

const Header = ({
  title,
  onSearch,
  onAddButtonClick,
  buttonTitle,
  buttonIcon,
  viewType,
  onViewType,
  selectedItems,
  onNewButtonClick,
  filtericon,
  filterOnClick
}) => {

  const handleSearch = (query) => {
    onSearch(query);
  };

  return (
    <div className="header flex flex-col sm:flex-row sm:justify-between sm:items-center p-4">
      <h1 className="cursor-pointer font-bold text-lg text-light_text_1 dark:text-dark_text_1 mb-2 sm:mb-0">
        {title}
      </h1>

      <div className="header-items flex flex-col sm:flex-row sm:items-center w-full">
        {window.location.href === `${FE_URL}puchase-order` ? (
          <>
            <SearchBar onChange={handleSearch} field="title" />
            <GridButton
              onGridView={() => onViewType("GRID")}
              onListView={() => onViewType("")}
              grid={viewType === "GRID"}
            />
          </>
        ) : window.location.href === `${FE_URL}puchase-requisition` ? (
          <>
            <div className="header-buttons flex space-x-2 mb-2 sm:mb-0">
              {selectedItems.length > 0 && (
                <Button
                  title="Convert To PO"
                  icon={""}
                  onClick={onNewButtonClick}
                />
              )}
              <Button
                title={buttonTitle}
                icon={buttonIcon}
                onClick={onAddButtonClick}
              />
              <GridButton
                onGridView={() => onViewType("GRID")}
                onListView={() => onViewType("")}
                grid={viewType === "GRID"}
              />
            </div>
          </>
        ) : (
          <>
            <SearchBar onChange={handleSearch} field="title" />
            {filtericon ? (
              <img
                onClick={filterOnClick}
                src={filtericon}
                alt="Filter Icon"
                title="Filter"
                className="w-5 cursor-pointer mb-2 sm:mb-0 sm:ml-2"
              />
            ) : null}

            <div className="header-buttons flex space-x-2">
              <Button
                title={buttonTitle}
                icon={buttonIcon}
                onClick={onAddButtonClick}
              />
              <GridButton
                onGridView={() => onViewType("GRID")}
                onListView={() => onViewType("")}
                grid={viewType === "GRID"}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
