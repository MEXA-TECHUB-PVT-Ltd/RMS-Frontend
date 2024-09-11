import React, { useCallback, useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { FaEdit, FaEye, FaTrash, FaPlus } from "react-icons/fa";
import Card from "../../components/card/Card";
import { useDispatch, useSelector } from "react-redux";
import { getRecipes } from "../../app/features/Recipes/getRecipeSlice";
import CardItem from "../../components/card/CardItem";

const API_URL = import.meta.env.VITE_API_URL;

import {
    handleChangePage,
    handleChangeRowsPerPage,
    handleDelete,
    handleSearch,
} from "../../utils/vendor";
import Header from "../../components/header";
import { json, useNavigate } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import Button from "../../components/form/Button";
import { Spinner } from "../../components/theme/Loader";
import toast from "react-hot-toast";

const Recipes = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [viewType, setViewType] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingApproval, setLoadingApproval] = useState({});

    const { textColor } = useSelector((state) => state.theme);
    // const { isLoading } = useSelector((state) => state.deleteVendor); 

    const recipeColumns = [
        {
            name: "Recipe Name",
            selector: (row) => (
                <div className="flex-center gap-2">
                    <img src={`${row.image == null || undefined ? "-" : row.image}`} alt="..." style={{ width: "7vh", height: "7vh" }} />
                    {row.recipe_name == null || undefined ? "-" : row.recipe_name}
                </div>
            ),
            sortable: true,
            style: {
                width: '100px',
            },
        },
        {
            name: "Category",
            selector: (row) => row.category_name == null || undefined ? "-" : row.category_name,
            sortable: true,
            style: {
                width: '100px',
            },
        },
        {
            name: "Added By",
            selector: (row) => row.added_by == null || undefined ? "-" : row.added_by,
            sortable: true,
            style: {
                width: '100px',
            },
        },
        {
            name: "Price",
            selector: (row) => row.price == null || undefined ? "-" : <>{`$ ${row.price}`}</>,
            sortable: true,
            style: {
                width: '10px',
            },
        },
        // {
        //     name: "Cooking Time",
        //     selector: (row) => row.cooking_time == null || undefined ? "-" : row.cooking_time,
        //     sortable: true,
        //     style: {
        //         width: '100px',
        //     },
        // },
        {
            name: "Action",
            selector: (row) => (
                <div className="flex-center gap-2 cursor-pointer">
                    <FaEye
                        size={20}
                        className="text-eye_black dark:text-eye_white"
                        onClick={() => navigate(`/recipe_detail?recipe_id=${row.id}`)}
                    />
                    <FaEdit
                        size={20}
                        className={`${textColor}`}
                    // onClick={() => navigate(`/edit-item?item_id=${row.id}`)}
                    />
                    <FaTrash
                        size={20}
                        className="text-red-600"
                    // onClick={() => {
                    //     setCurrentId(row.id);
                    //     setDeleteModal(true);
                    // }}
                    />
                </div>
            ),
            style: {
                width: '100px',
            },
        },
    ];

    const updateStatus = (row) => {
        console.log(row.id,
            "Paid");
        setLoadingApproval(prev => ({ ...prev, [row.id]: true }));
        setTimeout(() => {
            const InsertAPIURL = `${API_URL}/invoice/update/status`;

            // const formData = new FormData();

            // formData.append("status", "ACCEPTED");

            var Data = {
                "id": row.id,
                "status": "Paid" //'Paid', 'Draft', 'Unpaid'
            }

            fetch(InsertAPIURL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',  // Specify JSON content type
                },
                body: JSON.stringify(Data),
            })
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    setLoadingApproval(false);

                    if (response.success) {
                        setLoadingApproval(prev => ({ ...prev, [row.id]: false }));
                        toast.success(response.message);
                        dispatch(getRecipes(
                            {
                                currentPage,
                                perPage: rowsPerPage,
                                search: searchQuery
                            }
                        ));
                    } else {
                        setLoadingApproval(prev => ({ ...prev, [row.id]: false }));
                        toast.error(response.error.message);
                    }
                })
                .catch(error => {
                    setLoadingApproval(prev => ({ ...prev, [row.id]: false }));
                    toast.error(error.message, {
                        position: toast.POSITION.BOTTOM_CENTER
                    });
                });
        }, 3000);
    }

    const { isLoading, recipe, pagination, error } = useSelector((state) => state.getRecipe);

    console.log("recipe", recipe);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    const handleChangePage = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page on search
    };

    useEffect(() => {
        dispatch(getRecipes({ currentPage, perPage: rowsPerPage, search: searchQuery }));
    }, [dispatch, currentPage, rowsPerPage, searchQuery]);

    return (
        <div className="my-5">
            <Header
                title="Recipes"
                buttonTitle="Add"
                // buttonIcon={FaPlus}
                viewType={viewType}
                onViewType={setViewType}
                onSearch={handleSearch}
                onAddButtonClick={() => navigate("/add_invoice")}
            />

            {/* <div className="py-5 px-10"> */}
            {isLoading ? (
                <Spinner size="lg" />
            ) : (
                <>
                    {viewType !== "GRID" ? (
                        <DataTable
                            data={recipe}
                            columns={recipeColumns}
                            pagination
                            paginationServer
                            paginationTotalRows={pagination.totalItems}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            onChangePage={handleChangePage}
                        />
                    ) : (
                        <div className="card-view">
                            {recipe.map((item) => {
                                return (
                                    <Card key={item?.id}>
                                        <div className="flex gap-3">
                                            <img src={`${item?.image == null || undefined ? "-" : item?.image}`} alt="..." style={{ width: "10vh", height: "10vh" }} />
                                            <div className="card-item">
                                                <h1 className="text-lg" style={{
                                                    fontWeight: "bold"
                                                }}>{item?.recipe_name == null ? "-" : item?.recipe_name}</h1>
                                            </div>
                                        </div>
                                        <CardItem title={"Category"} value={item?.category_name == null ? "-" : item?.category_name} />
                                        <CardItem
                                            title={"Added By"}
                                            value={item?.added_by == null ? "-" : item?.added_by}
                                        />
                                        <CardItem
                                            title={"Price"}
                                            value={item?.price == null ? "-" : <>{`$ ${item.price}`}</>}
                                        />
                                        <CardItem
                                            title={"Cooking Time"}
                                            value={item?.cooking_time == null ? "-" : item.cooking_time} />
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Recipes;
