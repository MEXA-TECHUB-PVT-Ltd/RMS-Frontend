import React, { useCallback, useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { FaEdit, FaEye, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
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
import FilterSelect from "../../components/form/FilterSelect";

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

    console.log("items", items);

    const categoryOptions = Array.from(
        new Set(
            items
                ?.filter((item) => item.product_category && item.product_category.trim() !== "")
                .map((item) => item.product_category) // Extracting only the category names
        )
    ).map((category) => ({
        value: category,
        label: category
    }));

    // const vendorOptions1 = items?.flatMap(item => item.vendors?.map(vendor => vendor.vendor_display_name)) || [];

    const vendorOptions = items
        ?.filter((item) => item.name && item.name.trim() !== "")
        .flatMap((item) =>
            item.vendors?.map((vendor) => ({
                value: vendor.vendor_display_name,  // Assuming 'vendor_display_name' is what you need for value
                label: vendor.vendor_display_name   // Using 'vendor_display_name' for label as well
            })) || [] // In case there are no vendors, fallback to an empty array
        );

    console.log("vendorOptions", vendorOptions);

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

    // Filter state
    const [itemType, setItemType] = useState('');
    const [productCatalog, setProductCatalog] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isFilterApplied, setIsFilterApplied] = useState(false);

    // Combined filters state
    const getSelectedValues = () => {
        const selectedValues = [];
        if (itemType) selectedValues.push({ label: itemType, type: 'itemType' });
        if (productCatalog) selectedValues.push({ label: productCatalog, type: 'productCatalog' });
        if (selectedCategory) selectedValues.push({ label: selectedCategory, type: 'selectedCategory' });
        return selectedValues;
    };

    const hasSelectedFilters = getSelectedValues().length > 0;

    // Fetch filtered data
    const fetchFilteredData = useCallback(() => {
        setLoading(true); // Start loader
        // console.log("productCatalog", productCatalog);
        dispatch(
            getItems({
                currentPage,
                perPage: rowsPerPage,
                search: searchQuery,
                product_catalog: productCatalog,
                product_category: selectedCategory,
                type: itemType
            })
        ).finally(() => {
            setLoading(false); // Stop loader after the action is completed
        });
    }, [dispatch, currentPage, rowsPerPage, productCatalog, selectedCategory, itemType]);

    useEffect(() => {
        if (isFilterApplied) {
            // console.log("getSelectedValues", getSelectedValues())
            fetchFilteredData(); // Only fetch if filters are applied
        }
    }, [fetchFilteredData, isFilterApplied]);

    // Clear all filters
    const clearFilters = () => {
        setLoading(true); // Start loader
        setItemType(''); // Reset all filters
        setProductCatalog('');
        setSelectedCategory('');
        setIsFilterApplied(false); // Reset filter applied status
        dispatch(getItems({ currentPage: 1, perPage: 10 })).finally(() => {
            setLoading(false); // Stop loader after clearing filters
        });
    };

    // Function to remove a specific filter and reset the corresponding dropdown
    const removeFilter = (type) => {
        switch (type) {
            case 'itemType':
                setItemType(''); // Clear the provider type
                break;
            case 'productCatalog':
                setProductCatalog(''); // Clear the selected company
                break;
            case 'selectedCategory':
                setSelectedCategory(''); // Clear the selected payment term
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        dispatch(getItems({ currentPage, perPage: rowsPerPage, search: searchQuery }));
    }, [dispatch, currentPage, rowsPerPage, searchQuery]);

    const itemTypeOptions = [
        { value: "SERVICE", label: "SERVICE" },
        { value: "PRODUCT", label: "PRODUCT" },
    ];

    const productCatalogOptions = [
        { value: "CONSUMER", label: "CONSUMER" },
        { value: "ASSETS", label: "ASSETS" },
    ];

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
                        <>
                            {loading ? (
                                <div className="flex justify-center items-center">
                                    {/* Add your loader/spinner here */}
                                    <Spinner size="sm" />
                                </div>
                            ) : (
                                <>
                                    {isFilterApplied && hasSelectedFilters && (
                                        <div className="mb-4 flex items-center space-x-4">
                                            {/* 'All' button */}
                                            <button
                                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                                                onClick={clearFilters}
                                            >
                                                All
                                            </button>

                                            {/* Display applied filter names */}
                                            {getSelectedValues().map((filter, index) => (
                                                <div
                                                    key={index}
                                                    className="border border-gray-300 text-sm rounded-full px-2 py-1 text-sm mr-2 mt-2 mb-2 flex items-center"
                                                >
                                                    <p className="ml-2 mr-2">{filter.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

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
                                </>
                            )}
                        </>
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

            {/* filter modal */}
            <VendorTypeModal
                size="sm"
                isOpen={filterModal}
                onClose={() => setFilterModal(false)}
            >
                <div className="flex flex-col items-center p-1">

                    {/* Title text */}
                    <p className="text-center font-bold mb-4" style={{ letterSpacing: "1px", fontSize: "25px" }}>Filter</p>

                    {/* Display selected values as tags only if there are selected filters */}
                    {hasSelectedFilters && (
                        <div className="w-full mb-4">
                            <div className="flex flex-wrap border border-gray-300 p-2 rounded-lg">
                                {getSelectedValues().map((item, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-150 text-xs rounded-full px-2 py-1 text-sm mr-2 mt-2 mb-2 flex items-center"
                                    >
                                        <p className="mr-2">{item.label}</p>
                                        <button
                                            onClick={() => removeFilter(item.type)} // Remove the specific filter
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Dropdowns */}
                    <div className="w-full space-y-3">

                        <FilterSelect
                            label="Category"
                            options={categoryOptions}
                            value={selectedCategory} // Bind the selected value
                            onChange={(e) => setSelectedCategory(e.target.value)} // Set selected payment term
                            className="w-full border border-gray-300 p-2 rounded-lg"
                        />

                        <FilterSelect
                            label="Item Type"
                            options={itemTypeOptions}
                            value={itemType} // Bind the selected value
                            onChange={(e) => setItemType(e.target.value)} // Set provider type
                            className="w-full border border-gray-300 p-2 rounded-lg"
                        />

                        <FilterSelect
                            label="Product Catalog"
                            options={productCatalogOptions}
                            value={productCatalog} // Bind the selected value
                            onChange={(e) => setProductCatalog(e.target.value)} // Set selected company
                            className="w-full border border-gray-300 p-2 rounded-lg"
                        />

                    </div>

                    {/* Filter Button */}
                    <div className="mt-6 w-full">
                        <button
                            style={{
                                width: "100%",
                                border: "1px solid #000000",
                                borderRadius: "10px",
                                padding: "5px",
                                backgroundColor: "#ffffff",
                            }}
                            className="hover:bg-gray-100 font-semibold"
                            onClick={() => {
                                setIsFilterApplied(true);
                                fetchFilteredData();
                                setFilterModal(false);
                                setLoading(true);
                            }}
                        >
                            {loading ? <><Spinner size="sm" />Filter </> : "Filter"}
                        </button>
                    </div>
                </div>
            </VendorTypeModal>

        </div>
    );
};

export default Item;
