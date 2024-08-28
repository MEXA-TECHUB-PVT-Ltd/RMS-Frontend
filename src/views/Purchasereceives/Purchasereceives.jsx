import React, { useCallback, useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { FaEdit, FaEye, FaTrash, FaPlus } from "react-icons/fa";
import Card from "../../components/card/Card";
import { useDispatch, useSelector } from "react-redux";
import { getPR } from "../../app/features/Purchasereceives/getPurchaseReceivesSlice";
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

const Purchasereceive = () => {
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

    const prColumns = [
        // {
        //     name: "Order Number",
        //     selector: (row) => row.
        //         purchase_order_id == null || undefined ? "-" : row.purchase_order_id,
        //     sortable: true,
        //     style: {
        //         width: '100px',
        //     },
        // },
        {
            name: "PR Number",
            selector: (row) => row.purchase_received_number == null || undefined ? "-" : row.purchase_received_number,
            sortable: true,
            style: {
                width: '100px',
            },
        },
        {
            name: "Vendor",
            selector: (row) => row.items[0]?.vendor_details?.vendor_display_name == null || undefined ? "-" : row?.items[0]?.vendor_details?.vendor_display_name,
            sortable: true,
            style: {
                width: '100px', // Set the width you want
            },
        },
        {
            name: "Total Quantity",
            selector: (row) => row.items[0]?.total_quantity == null || undefined ? "-" : row?.items[0]?.total_quantity,
            sortable: true,
            style: {
                width: '100px', // Set the width you want
            },
        },
        {
            name: "Quantity Received",
            selector: (row) => row?.items[0]?.quantity_received == null ? "-" : row?.items[0]?.quantity_received,
            sortable: true,
            style: {
                width: '100px', // Set the width you want
            },
        },
        {
            name: "Received Date",
            selector: (row) => row.received_date == null ? "-" : row.received_date.slice(0, 10),
            sortable: true,
            style: {
                width: '100px', // Set the width you want
            },
        },
        {
            name: "Total Cost",
            selector: (row) => row?.items[0]?.total_cost == null ? "-" : <>{`$ ${row?.items[0]?.total_cost}`}</>,
            sortable: true,
            style: {
                width: '100px', // Set the width you want
            },
        },
        {
            name: "Action",
            selector: (row) => (
                <div className="flex-center gap-2 cursor-pointer">
                    <FaEye
                        size={15}
                        className="text-eye_black dark:text-eye_white flex-none"
                    // onClick={() => navigate(`/puchase-order-details?po_id=${row.purchase_order_id}`)}
                    />
                    <FaTrash
                        size={15}
                        className="text-red-600 flex-none"
                    // onClick={() => {
                    //     setCurrentId(row.purchase_order_id);
                    //     setDeleteModal(true);
                    // }}
                    />
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
                            getPR({
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
                            getPR({
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
    const { isLoading, purchase_receives, pagination, error } = useSelector((state) => state.getPRs);

    console.log("purchase_receives", purchase_receives);

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
        dispatch(getPR({ currentPage, perPage: rowsPerPage, search: searchQuery }));
    }, [dispatch, currentPage, rowsPerPage, searchQuery]);

    return (
        <div className="my-5">
            <Header
                title="Purchase Receives"
                buttonTitle="Add"
                // buttonIcon={FaPlus}
                viewType={viewType}
                onViewType={setViewType}
                // onSearch={handleSearch}
                onAddButtonClick={() => navigate("/add-purchase-receives")}
            />

            {/* <div className="py-5 px-10"> */}
            {isLoading ? (
                <Spinner size="lg" />
            ) : (
                <>
                    {viewType !== "GRID" ? (
                        <DataTable
                            data={purchase_receives}
                            columns={prColumns}
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

export default Purchasereceive;
