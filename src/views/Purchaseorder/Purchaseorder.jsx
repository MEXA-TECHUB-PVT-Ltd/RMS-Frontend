import React, { useCallback, useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { FaEdit, FaEye, FaTrash, FaPlus } from "react-icons/fa";
import Card from "../../components/card/Card";
import { useDispatch, useSelector } from "react-redux";
import { getPOs } from "../../app/features/Purchaseorder/getPurchaseOrderSlice";
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

const Purchaseorder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [viewType, setViewType] = useState("");
    const [currentId, setCurrentId] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const { textColor } = useSelector((state) => state.theme);
    // const { isLoading } = useSelector((state) => state.deleteVendor); 

    const rows = [
        { vendor: "John Doe", order_number: "1234567", delivery_date: "29-07-2024", status: "cancel" },
        { vendor: "Harry Pottar", order_number: "1234567", delivery_date: "29-07-2024", status: "cancel" },
        { vendor: "Harry Pottar", order_number: "1234567", delivery_date: "29-07-2024", status: "cancel" }
    ]

    const poColumns = [
        {
            name: "Vendor",
            selector: (row) => row.purchase_items[0]?.preferred_vendors[0]?.first_name == null ? "-" : `${row.purchase_items[0]?.preferred_vendors[0]?.first_name} ${row.purchase_items[0]?.preferred_vendors[0]?.last_name}`,
            sortable: true,
            style: {
                width: '100px', // Set the width you want
            },
        },
        {
            name: "Order Number",
            selector: (row) => row.purchase_order_number,
            sortable: true,
            style: {
                width: '100px', // Set the width you want
            },
        },
        {
            name: "Delivery Date",
            selector: (row) => row.required_date == null ? "-" : row.required_date.slice(0, 10),
            sortable: true,
            style: {
                width: '100px', // Set the width you want
            },
        },
        {
            name: "Status",
            selector: (row) => (
                <div style={{

                    fontWeight: "bold",
                    borderRadius: "50px",
                    backgroundColor: row.status === "DRAFT" ? 'darkblue' :
                        row.status === "ISSUED" ? 'purple' :
                            row.status === "FULLY DELIVERED" ? 'green' :
                                row.status === "CANCELLED" ? 'orange' :
                                    'yellow',
                    padding: 8,
                    color: "white",
                    width: '100px',
                }}>
                    <div style={{ textAlign: "center" }}>
                        {row.status == null ? "-" : row.status}
                    </div>
                </div>
            ),
            sortable: true,
            style: {
                width: '100px', // Set the width you want
            },
        },
        {
            name: "Required Quantity",
            selector: (row) => (
                <div style={{ color: " " }}>
                    {row.purchase_items[0]?.required_quantity == null ? "-" : row.purchase_items[0]?.required_quantity}
                </div>
            ),
            sortable: true,
            style: {
                width: '50px', // Set the width you want
            },
        },
        {
            name: "Action",
            selector: (row) => (
                <div className="flex-center gap-2 cursor-pointer">
                    <FaEye
                        size={15}
                        className="text-eye_black dark:text-eye_white flex-none"
                        onClick={() => navigate(`/puchase-order-details?po_id=${row.purchase_order_id}`)}
                    />
                    {row.status === "DRAFT" && (
                        <FaTrash
                            size={15}
                            className="text-red-600 flex-none"
                            onClick={() => {
                                setCurrentId(row.purchase_order_id);
                                setDeleteModal(true);
                            }}
                        />
                    )}
                    <button
                        onClick={row.status === "DRAFT" ? () => sendtovendor(row) : undefined}
                        style={{
                            backgroundColor: row.status === "ISSUED" ? 'lightgray' : 'orange',
                            color: row.status === "ISSUED" ? 'gray' : '#ffffff',
                            fontWeight: "bold",
                            padding: 8,
                            borderRadius: "10px",
                            cursor: row.status === "DRAFT" ? 'pointer' : 'not-allowed',
                            opacity: row.status === "DRAFT" ? 1 : 0.6,
                        }}
                        disabled={row.status !== "DRAFT"}
                    >
                        {loading ? <><Spinner size="sm" /> "Send to vendor"</> : "Send to vendor"}
                    </button>
                </div >
            ),
            style: {
                width: '350px', // Set the width you want
            },
        },
    ];


    const onDelete = () => {

        setLoading(true);
        setTimeout(() => {
            const InsertAPIURL = `${API_URL}/purchase/order/delete?purchase_order_id=${currentId}`;
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
                            getPOs({
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

    const sendtovendor = (row) => {

        // console.log(row);
        // console.log("purchase_requisition_id", row.purchase_requisition_id);
        // console.log("vendor ids", row?.vendors_ids);
        setLoading(true);
        setTimeout(() => {
            const InsertAPIURL = `${API_URL}/purchase/order/send/vendor?purchase_order_id=${row?.purchase_order_id}`;
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };

            var Data = {
                "vendorIds": row?.vendors_ids
            }

            fetch(InsertAPIURL, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(Data),
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
                            getPOs({
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

    // const {isLoading, items, pagination, error} = useSelector((state) => state.getItem || { });
    const { isLoading, po, pagination, error } = useSelector((state) => state.getPO);

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

    const fetchPO = async () => {

        try {
            const response = await fetch(`${API_URL}/purchase/order/get/all`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        dispatch(getPOs({ currentPage, perPage: rowsPerPage, search: searchQuery }));
        fetchPO();
    }, [dispatch, currentPage, rowsPerPage, searchQuery]);

    // useEffect(() => {
    //     fetchPO();
    // }, []);

    return (
        <div className="my-5">
            <Header
                title="Purchase Order"
                buttonTitle="Add"
                // buttonIcon={FaPlus}
                viewType={viewType}
                onViewType={setViewType}
            // onSearch={handleSearch}
            // onAddButtonClick={() => navigate("/add-item")}
            />

            {/* <div className="py-5 px-10"> */}
            {isLoading ? (
                <Spinner size="lg" />
            ) : (
                <>
                    {viewType !== "GRID" ? (
                        <DataTable
                            data={po}
                            columns={poColumns}
                            pagination
                            paginationServer
                            paginationTotalRows={pagination.totalItems}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            onChangePage={handleChangePage}
                        />
                    ) : (
                        <div className="card-view">
                            {po.map((item) => {
                                return (
                                    <Card key={item?.id}>
                                        <CardItem title={"Vendor"} value={item?.purchase_items[0]?.preferred_vendors[0]?.first_name == null ? "-" : `${item?.purchase_items[0]?.preferred_vendors[0]?.first_name} ${item?.purchase_items[0]?.preferred_vendors[0]?.last_name}`} />
                                        <CardItem title={"Order Number"} value={item?.purchase_order_number} />
                                        <CardItem
                                            title={"Delivery Date"}
                                            value={item?.required_date.slice(0, 10)}
                                        />
                                        <CardItem
                                            title={"Required Quantity"}
                                            value={item?.purchase_items[0]?.required_quantity == null ? "-" : item?.purchase_items[0]?.required_quantity}
                                        />
                                        <div className="card-item">
                                            <div className="font-medium text-base text-sm text-black/60 dark:text-white/60">
                                                Status
                                            </div>
                                            <h1 className="text-sm" style={{
                                                fontWeight: "medium",
                                                borderRadius: "40px",
                                                backgroundColor: item.status === "DRAFT" ? 'darkblue' :
                                                    item.status === "ISSUED" ? 'purple' :
                                                        item.status === "FULLY DELIVERED" ? 'green' :
                                                            item.status === "CANCELLED" ? 'orange' :
                                                                'yellow',
                                                padding: 6,
                                                color: "white",
                                                width: "100px",
                                                textAlign: "center"
                                            }}>{item?.status}</h1>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            <Modal
                title={"Delete Purchase Order"}
                size="sm"
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
            >
                <h1 className="flex-start text-base font-semibold">
                    Are you sure want to delete this PO?{" "}
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

export default Purchaseorder;
