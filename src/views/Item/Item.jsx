import React, { useCallback, useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { FaEdit, FaEye, FaTrash, FaPlus } from "react-icons/fa";
import Card from "../../components/card/Card";
import { useDispatch, useSelector } from "react-redux";
import { getItems } from "../../app/features/Item/getItemSlice";
import CardItem from "../../components/card/CardItem";
import item_type from "../../assets/item_type.png";
import filter from "../../assets/filter.png";
import delete_icon from "../../assets/delete_icon.png";
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
import VendorTypeModal from "../../components/modal/VendorTypeModal";

const API_URL = import.meta.env.VITE_API_URL;

const Item = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [viewType, setViewType] = useState("");
    const [currentId, setCurrentId] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [vendorTypeModal, setVendorTypeModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filterModal, setFilterModal] = useState(false);

    const { textColor } = useSelector((state) => state.theme);
    // const { isLoading } = useSelector((state) => state.deleteVendor); 

    const rows = [
        { name: "email@gmail.com", category: "category", catalog: "catalog", opening_stock: "opening_stock", available_stock: "available_stock" }
    ]

    const itemColumns = [
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Item Type",
            selector: (row) => row.type == null || undefined ? "-" : row.type,
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
            name: "Stock in Hand",
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
                        size={15}
                        className="text-eye_black dark:text-eye_white"
                        title="view"
                        onClick={() => navigate(`/item-detail?item_id=${row.id}`)}
                    />
                    <FaEdit
                        size={15}
                        className={`${textColor}`}
                        title="edit"
                        onClick={() => navigate(`/edit-item?item_id=${row.id}`)}
                    />
                    <FaTrash
                        size={15}
                        className="text-red-600"
                        title="delete"
                        onClick={() => {
                            setCurrentId(row.id);
                            setDeleteModal(true);
                        }}
                    />
                </div>
            ),
        },
    ];

    // Handle row click
    const handleRowClick = (row) => {
        navigate(`/item-detail?item_id=${row.id}`);
    };

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
                        toast.error(response.error.message);
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

    const handleAddItem = (text) => {
        navigate(`/add-item?item_type=${text}`)
    }

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
                filtericon={filter}
                filterOnClick={() => setFilterModal(true)}
                onSearch={handleSearch}
                onAddButtonClick={() => setVendorTypeModal(true)}
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
                            onRowClicked={handleRowClick}
                            className="cursor-pointer"
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
                                        <div className="cursor-pointer flex-between">
                                            <div className="flex gap-3">
                                                {item?.image ? (
                                                    <a href={item?.image} target="_blank">
                                                        <img src={item?.image} alt="item" className="rounded-sm text-center mx-auto w-10" />
                                                    </a>
                                                ) : null}

                                                <h1 onClick={() => navigate(`/item-detail?item_id=${item.id}`)} style={{ fontWeight: "bold", color: "#353535", fontSize: "20px" }}>
                                                    {item?.name}
                                                </h1>
                                            </div>

                                            <div>
                                                <div className="flex-center gap-2 cursor-pointer">
                                                    <FaEdit
                                                        size={15}
                                                        className={`${textColor}`}
                                                        title="edit"
                                                        onClick={() => navigate(`/edit-item?item_id=${item.id}`)}
                                                    />
                                                    <FaTrash
                                                        size={15}
                                                        className="text-red-600"
                                                        title="delete"
                                                        onClick={() => {
                                                            setCurrentId(item.id);
                                                            setDeleteModal(true);
                                                        }}
                                                    />
                                                </div>

                                            </div>
                                        </div>

                                        <div className="cursor-pointer" onClick={() => navigate(`/item-detail?item_id=${item.id}`)}>
                                            <CardItem title={"Type"} value={item?.type} />
                                            <CardItem
                                                title={"Category"}
                                                value={item?.product_category}
                                            />
                                            <CardItem
                                                title={"Catalog"}
                                                value={item?.product_catalog}
                                            />
                                            <CardItem title={"Opening Stock"} value={item?.stock_in_hand} />
                                        </div>
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
                <div className="flex-col items-center">
                    <img src={delete_icon} className="mb-6 w-20 mx-auto" />

                    <h1 className="text-center mx-auto text-base font-semibold">
                        Are you sure want to delete this item?{" "}
                    </h1>

                </div>

                <div className="flex-center gap-3 mt-10 mb-3">
                    <Button
                        title={"Cancel"}
                        onClick={() => setDeleteModal(false)}
                        color={"bg-slate-50"}
                        borderColor
                        textColor={"text-slate-950"}
                    />
                    <Button
                        title={"Delete"}
                        onClick={isLoading ? "" : () => onDelete(currentId)}
                        spinner={isLoading ? <Spinner size="sm" /> : null}
                        color={"bg-red-500"}
                    />
                </div>
            </Modal>

            {/* vendor type */}
            <VendorTypeModal
                size="sm"
                isOpen={vendorTypeModal}
                onClose={() => setVendorTypeModal(false)}
            >
                <div className="flex flex-col items-center "> {/* Added flex-col and items-center for centering */}

                    <img src={item_type} alt="Item Type" className="mb-3 mx-auto w-20" /> {/* Added mx-auto to center the image */}

                    <p className="text-center font-bold mb-3" style={{ fontSize: "25px" }}>
                        Item Type
                    </p> {/* Title text */}

                    <p
                        className="text-center text-base font-medium mb-3 mx-auto"
                        style={{ width: '90%', color: 'gray' }}  // Applied custom width and color
                    >
                        Please choose whether you are adding a Product or a Service to proceed.{" "}
                    </p> {/* Added custom width and ensured the container is centered */}

                    <div className="flex gap-3 mt-3">
                        <button
                            style={{
                                width: "90px",
                                border: "1px solid black",
                                borderRadius: "10px",
                                padding: "8px",
                            }}
                            onClick={() => handleAddItem("PRODUCT")}
                        >
                            Product
                        </button>
                        <button
                            style={{
                                width: "90px",
                                border: "1px solid black",
                                borderRadius: "10px",
                                padding: "8px",
                            }}
                            onClick={isLoading ? "" : () => handleAddItem("SERVICE")}
                        >
                            Service
                        </button>
                    </div>
                </div>
            </VendorTypeModal>

        </div>
    );
};

export default Item;
