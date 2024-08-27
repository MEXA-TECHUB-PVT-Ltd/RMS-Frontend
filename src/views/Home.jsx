import React, { useState } from "react";
import DataTable from "../components/table/DataTable";
import SearchBar from "../components/form/SearchBar";
import Button from "../components/form/Button";
import { FaPlus } from "react-icons/fa";
import Card from "../components/card/Card";
import GridButton from "../components/form/GridButton";

const Home = () => {
  const [viewType, setViewType] = useState("");
  const [filterData, setFilterData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Director",
      selector: (row) => row.director,
      sortable: true,
    },
    {
      name: "Year",
      selector: (row) => row.year,
      sortable: true,
    },
  ];

  const data = [
    { id: 1, title: "Inception", director: "Christopher Nolan", year: "2010" },
    {
      id: 2,
      title: "Interstellar",
      director: "Christopher Nolan",
      year: "2014",
    },
    {
      id: 3,
      title: "The Dark Knight",
      director: "Christopher Nolan",
      year: "2008",
    },
    { id: 4, title: "Fight Club", director: "David Fincher", year: "1999" },
    { id: 5, title: "The Matrix", director: "The Wachowskis", year: "1999" },
    {
      id: 6,
      title: "Pulp Fiction",
      director: "Quentin Tarantino",
      year: "1994",
    },
    {
      id: 7,
      title: "Eternal Sunshine of the Spotless Mind",
      director: "Yannick Schwarzenegger",
      year: "2004",
    },
    {
      id: 8,
      title: "Casablanca",
      director: "Antoine de  Michelin",
      year: "1995",
    },
    { id: 9, title: "Psycho", director: "Leonardo DiCaprio", year: "1960" },
    {
      id: 10,
      title: "Pulp Fiction",
      director: "Quentin Tarantino",
      year: "1994",
    },
    {
      id: 11,
      title: "Eternal Sunshine of the Spotless Mind",
      director: "Yannick Schwarzenegger",
      year: "2004",
    },
    {
      id: 12,
      title: "Casablanca",
      director: "Antoine de  Michelin",
      year: "1995",
    },
    { id: 13, title: "Psycho", director: "Leonardo DiCaprio", year: "1960" },
    {
      id: 14,
      title: "Pulp Fiction",
      director: "Quentin Tarantino",
      year: "1994",
    },
    {
      id: 15,
      title: "Eternal Sunshine of the Spotless Mind",
      director: "Yannick Schwarzenegger",
      year: "2004",
    },
    {
      id: 16,
      title: "Casablanca",
      director: "Antoine de  Michelin",
      year: "1995",
    },
    { id: 17, title: "Psycho", director: "Leonardo DiCaprio", year: "1960" },
  ];

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
  };

  const handleSearch = (query) => {
    setFilterData(
      data?.filter((row) =>
        row?.title?.toLowerCase()?.includes(query?.toLowerCase())
      )
    );
  };

  const currentData = filterData || data;

  return (
    <div className="my-5">
      <div className="header">
        <h1 className="cursor-pointer font-bold text-lg text-light_text_1 dark:text-dark_text_1">
          Home
        </h1>

        <div className="header-items">
          <SearchBar onChange={handleSearch} field="title" />
          <div className="header-buttons">
            <Button
              title={"Add"}
              icon={FaPlus}
              onClick={() => alert("Button Works Fine... 🥰")}
            />
            <GridButton
              onGridView={() => setViewType("GRID")}
              onListView={() => setViewType("")}
              grid={viewType === "GRID"}
            />
          </div>
        </div>
      </div>

      {viewType !== "GRID" ? (
        <DataTable
          data={currentData.slice(
            (currentPage - 1) * rowsPerPage,
            currentPage * rowsPerPage
          )}
          columns={columns}
          pagination
          paginationServer
          paginationTotalRows={currentData.length}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onChangePage={handleChangePage}
        />
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {currentData.map((item) => {
            return (
              <Card key={item.id}>
                <h2>{item.title}</h2>
                <p>{item.director}</p>
                <p>{item.year}</p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
