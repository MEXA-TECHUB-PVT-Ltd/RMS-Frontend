import React, { useCallback, useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { FaEdit, FaEye, FaTrash, FaPlus } from "react-icons/fa";
import Card from "../../components/card/Card";
import { useDispatch, useSelector } from "react-redux";
import { getItems } from "../../app/features/Item/getItemSlice";
import CardItem from "../../components/card/CardItem";

const API_URL = import.meta.env.VITE_API_URL;

import {
    handleChangePage,
    handleChangeRowsPerPage,
    handleDelete,
    handleSearch,
} from "../../utils/vendor";
import Header from "../../components/header";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import Button from "../../components/form/Button";
import { Spinner } from "../../components/theme/Loader";
import toast from "react-hot-toast";

const Item = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [viewType, setViewType] = useState("");
    const [currentId, setCurrentId] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const { textColor } = useSelector((state) => state.theme);
    // const { isLoading } = useSelector((state) => state.deleteVendor); 

    const rows = [
        { name: "email@gmail.com", category: "category", catalog: "catalog", opening_stock: "opening_stock", available_stock: "available_stock" }
    ]

    const itemColumns = [
        {
            name: "Item Type",
            selector: (row) => row.type == null || undefined ? "-" : row.type,
            sortable: true,
        },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Category",
            selector: (row) => row.product_category == null || undefined ? "-" : row.product_category,
            sortable: true,
        },
        {
            name: "Catalog",
            selector: (row) => row.product_catalog == null || undefined ? "-" : row.product_catalog,
            sortable: true,
        },
        {
            name: "Opening Stock",
            selector: (row) => row.stock_in_hand == null || undefined ? "-" : row.stock_in_hand,
            sortable: true,
        },
        {
            name: "Re-order Unit",
            selector: (row) => row.reorder_unit == null || undefined ? "-" : row.reorder_unit,
            sortable: true,
        },
        {
            name: "Action",
            selector: (row) => (
                <div className="flex-center gap-2 cursor-pointer">
                    <FaEye
                        size={20}
                        className="text-eye_black dark:text-eye_white"
                        onClick={() => navigate(`/item-detail?item_id=${row.id}`)}
                    />
                    <FaEdit
                        size={20}
                        className={`${textColor}`}
                        onClick={() => navigate(`/edit-item?item_id=${row.id}`)}
                    />
                    <FaTrash
                        size={20}
                        className="text-red-600"
                        onClick={() => {
                            setCurrentId(row.id);
                            setDeleteModal(true);
                        }}
                    />
                </div>
            ),
        },
    ];

    const onDelete = () => {

        setLoading(true);
        setTimeout(() => {
            const InsertAPIURL = `${API_URL}/item/delete?id=${currentId}`;
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };

            fetch(InsertAPIURL, {
                method: 'DELETE',
                headers: headers,
                body: JSON.stringify(),
            })
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    setLoading(false);
                    if (response.success) {
                        setDeleteModal
                        setLoading(false);
                        toast.success(response.message);
                        setDeleteModal(false);
                        dispatch(
                            getItems({
                                currentPage,
                                perPage: rowsPerPage,
                                search: searchQuery, // Include searchQuery in the request
                            })
                        );
                    } else {
                        setLoading(false);
                        toast.error(response.message);
                        setDeleteModal(false);
                    }
                })
                .catch(error => {
                    setLoading(false);
                    toast.error(error.message);
                });
        }, 3000);

    }

    //* Hooks */ 

    // const { isLoading, items, pagination, error } = useSelector((state) => state.getItem || {});
    const { isLoading, items, pagination, error } = useSelector((state) => state.getItem);

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
        dispatch(getItems({ currentPage, perPage: rowsPerPage, search: searchQuery }));
    }, [dispatch, currentPage, rowsPerPage, searchQuery]);

    return (
        <div className="my-5">
            <Header
                title="Item"
                buttonTitle="Add"
                buttonIcon={FaPlus}
                viewType={viewType}
                onViewType={setViewType}
                onSearch={handleSearch}
                onAddButtonClick={() => navigate("/add-item")}
            />

            {/* <div className="py-5 px-10"> */}
            {isLoading ? (
                <Spinner size="lg" />
            ) : (
                <>
                    {viewType !== "GRID" ? (
                        <DataTable
                            data={items}
                            columns={itemColumns}
                            pagination
                            paginationServer
                            paginationTotalRows={pagination.totalItems}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            onChangePage={handleChangePage}
                        />
                    ) : (
                        <div className="card-view">
                            {items.map((item) => {
                                return (
                                    <Card key={item?.id}>
                                        <CardItem title={"Type"} value={item?.type} />
                                        <CardItem title={"Name"} value={item?.name} />
                                        <CardItem
                                            title={"Category"}
                                            value={item?.product_category}
                                        />
                                        <CardItem
                                            title={"Catalog"}
                                            value={item?.product_catalog}
                                        />
                                        <CardItem title={"Opening Stock"} value={item?.stock_in_hand} />
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            <Modal
                title={"Delete Item"}
                size="sm"
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
            >
                <h1 className="flex-start text-base font-semibold">
                    Are you sure want to delete this item?{" "}
                </h1>

                <div className="flex-end gap-3 mt-5">
                    <Button
                        title={"Cancel"}
                        onClick={() => setDeleteModal(false)}
                        color={"bg-red-500"}
                    />
                    <Button
                        title={"Delete"}
                        onClick={loading ? "" : () => onDelete(currentId)}
                        spinner={loading ? <Spinner size="sm" /> : null}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default Item;
