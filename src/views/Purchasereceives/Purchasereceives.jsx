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

    const [posOptions, setPOsOptions] = useState([]);

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
                        onClick={() => navigate(`/purchase-receive_details?pr_id=${row.id}`)}
                    />
                    {console.log("posOptions", posOptions)}
                    {posOptions?.map((item) => (
                        item?.status === "CANCELLED" ? <></>
                            :
                            <FaEdit
                                size={20}
                                className={`${textColor}`}
                                onClick={() => navigate(`/edit-purchase-receive?pr_id=${row.id}`)}
                            />
                    ))}

                    {/* <FaTrash
                        size={15}
                        className="text-red-600 flex-none"
                        onClick={() => {
                            setCurrentId(row);
                            setDeleteModal(true);
                        }}
                    /> */}
                </div >
            ),
            style: {
                width: '350px', // Set the width you want
            },
        },
    ];


    const onCancel = () => {

        console.log("currentId", currentId.purchase_order_id);
        console.log("Item IDs", currentId?.items?.map((item) => item?.item_id));
        setLoading(true);
        setTimeout(() => {
            const InsertAPIURL = `${API_URL}/purchase/receives/cancel`;
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };

            var Data = {
                purchase_order_id: currentId?.purchase_order_id,
                purchase_item_ids: currentId?.items?.map((item) => item?.item_id)
            }

            fetch(InsertAPIURL, {
                method: 'DELETE',
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

    const fetchPOs = async (value) => {
        console.log("category", value);
        try {
            const response = await fetch(`${API_URL}/purchase/order/get/purchase/order`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);

            setPOsOptions(data?.result?.orders);
            console.log("formattedOrders", data?.result?.orders);
        } catch (error) {
            console.log(error.message);
        }
    };


    useEffect(() => {
        fetchPOs();
    }, []);

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
                onSearch={handleSearch}
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
                            {purchase_receives.map((item) => {
                                return (
                                    <Card key={item?.id}>
                                        <CardItem title={"Purchase Number"} value={item.purchase_received_number == null || undefined ? "-" : item.purchase_received_number} />
                                        <CardItem title={"Vendor"} value={item.items[0]?.vendor_details?.vendor_display_name == null || undefined ? "-" : item?.items[0]?.vendor_details?.vendor_display_name} />
                                        <CardItem
                                            title={"Total Quantity"}
                                            value={item.items[0]?.total_quantity == null || undefined ? "-" : item?.items[0]?.total_quantity}
                                        />
                                        <CardItem
                                            title={"Quantity Received"}
                                            value={item?.items[0]?.quantity_received == null ? "-" : item?.items[0]?.quantity_received}
                                        />
                                        <CardItem
                                            title={"Received Date"}
                                            value={item?.received_date == null ? "-" : item?.received_date.slice(0, 10)}
                                        />
                                        <CardItem
                                            title={"Total Cost"}
                                            value={item?.items[0]?.total_cost == null ? "-" : <>{`$ ${item?.items[0]?.total_cost}`}</>}
                                        />
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            <Modal
                title={"Cancel Purchase Order"}
                size="sm"
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
            >
                <h1 className="flex-start text-base font-semibold">
                    Are you sure want to cancel this PO?{" "}
                </h1>

                <div className="flex-end gap-3 mt-5">
                    <Button
                        title={"Cancel"}
                        onClick={() => setDeleteModal(false)}
                        color={"bg-red-500"}
                    />
                    <Button
                        title={"Delete"}
                        onClick={loading ? "" : () => onCancel(currentId)}
                        spinner={loading ? <Spinner size="sm" /> : null}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default Purchasereceive;
