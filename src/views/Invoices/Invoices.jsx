import React, { useCallback, useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { FaEdit, FaEye, FaTrash, FaPlus } from "react-icons/fa";
import Card from "../../components/card/Card";
import { useDispatch, useSelector } from "react-redux";
import { getInvoices } from "../../app/features/Invoices/getInvoiceSlice";
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

const Invoice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [viewType, setViewType] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingApproval, setLoadingApproval] = useState({});

    const { textColor } = useSelector((state) => state.theme);
    // const { isLoading } = useSelector((state) => state.deleteVendor); 

    const invoiceColumns = [
        {
            name: "Bill Number",
            selector: (row) => row.bill_number == null || undefined ? "-" : row.bill_number,
            sortable: true,
            style: {
                width: '100px',
            },
        },
        // {
        //     name: "Bill Date",
        //     selector: (row) => row.bill_date.slice(0, 10) == null || undefined ? "-" : row.bill_date.slice(0, 10),
        //     sortable: true,
        //     style: {
        //         width: '100px',
        //     },
        // },
        // {
        //     name: "Total Items",
        //     selector: (row) => row.total_items == null || undefined ? "-" : row.total_items,
        //     sortable: true,
        //     style: {
        //         width: '50px',
        //     },
        // },
        {
            name: "Total Amount",
            selector: (row) => row.total_price == null || undefined ? "-" : <>{`$ ${row.total_price}`}</>,
            sortable: true,
            style: {
                width: '50px',
            },
        },
        {
            name: "Tax",
            selector: (row) => row.tax_percentage == null || undefined ? "-" : <>{`${row.tax_percentage}%`}</>,
            sortable: true,
            style: {
                width: '50px',
            },
        },
        {
            name: "Net Price",
            selector: (row) => row.net_price == null || undefined ? "-" : <>{`$ ${row.net_price}`}</>,
            sortable: true,
            style: {
                width: '50px',
            },
        },
        {
            name: "Status",
            selector: (row) => (
                <div style={{
                    fontWeight: "bold",
                    borderRadius: "50px",
                    backgroundColor: row.status === "Draft" ? 'darkblue' :
                        row.status === "Paid" ? 'green' :
                            'red',
                    padding: 8,
                    letterSpacing: "1px",
                    color: "white",
                    width: '100px',
                }}>
                    <div style={{ textAlign: "center" }}>
                        {row?.status == null ? "-" : row?.status}
                    </div>
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
                        onClick={() => navigate(`/invoice_detail?invoice_id=${row.id}`)}
                    />

                    <div key={row.id} className="flex-center gap-2 cursor-pointer">
                        <button
                            onClick={row.status === "Unpaid" ? () => updateStatus(row) : undefined}
                            style={{
                                backgroundColor: row.status === "Paid" ? 'lightgray' : 'orange',
                                color: row.status === "Paid" ? 'gray' : '#ffffff',
                                fontWeight: "bold",
                                padding: 7,
                                borderRadius: "10px",
                                cursor: row.status === "Unpaid" ? 'pointer' : 'not-allowed',
                                opacity: row.status === "Unpaid" ? 1 : 0.6,
                            }}
                            disabled={row.status !== "Unpaid"}
                        >
                            {/* {loading ? <><Spinner size="sm" /> "Send to vendor"</> : "Send to vendor"} */}
                            {loadingApproval[row.id] ? (
                                <>
                                    <Spinner size="sm" />
                                    Update Pay Status
                                </>
                            ) : (
                                "Update Pay Status"
                            )}
                        </button>
                    </div>
                </div >
            ),
            style: {
                width: '100px',
            },
        } 
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
                        dispatch(getInvoices(
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

    const { isLoading, invoice, pagination, error } = useSelector((state) => state.getInvoice);

    console.log("invoice", invoice);

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
        dispatch(getInvoices({ currentPage, perPage: rowsPerPage, search: searchQuery }));
    }, [dispatch, currentPage, rowsPerPage, searchQuery]);

    return (
        <div className="my-5">
            <Header
                title="Invoices"
                buttonTitle="Create"
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
                            data={invoice}
                            columns={invoiceColumns}
                            pagination
                            paginationServer
                            paginationTotalRows={pagination.totalItems}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            onChangePage={handleChangePage}
                        />
                    ) : (
                        <div className="card-view">
                            {invoice.map((item) => {
                                return (
                                    <Card key={item?.id}>
                                        <CardItem title={"Bill Number"} value={item?.bill_number == null ? "-" : item?.bill_number} />
                                        <CardItem title={"Bill Date"} value={item?.bill_date.slice(0, 10) == null ? "-" : item?.bill_date.slice(0, 10)} />
                                        <CardItem
                                            title={"Total Items"}
                                            value={item?.total_items == null ? "-" : item?.total_items}
                                        />
                                        <CardItem
                                            title={"Total Amount"}
                                            value={item?.total_price == null ? "-" : <>{`$ ${item.total_price}`}</>}
                                        />
                                        <CardItem
                                            title={"Tax"}
                                            value={item?.tax_percentage == null ? "-" : <>{`${item.tax_percentage}%`}</>}
                                        />
                                        <CardItem
                                            title={"Net Amount"}
                                            value={item?.net_price == null ? "-" : <>{`$ ${item.net_price}`}</>}
                                        />
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

export default Invoice;
