import React, { useCallback, useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { FaEdit, FaEye, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import Card from "../../components/card/Card";
import { useDispatch, useSelector } from "react-redux";
import { getVendors } from "../../app/features/Vendor/getVendorSlice";
import CardItem from "../../components/card/CardItem";
import vendor_type from "../../assets/vendor_type.png";
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
import VendorTypeModal from "../../components/modal/VendorTypeModal";
import AppSelect from "../../components/form/AppSelect";
import FilterSelect from "../../components/form/FilterSelect";

const Vendor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [viewType, setViewType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentId, setCurrentId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [vendorTypeModal, setVendorTypeModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

  // navigate("/add-vendor")

  const { textColor } = useSelector((state) => state.theme);
  const { isLoading } = useSelector((state) => state.deleteVendor);
  const { vendors, pagination, error } = useSelector(
    (state) => state?.getVendor
  );

  console.log("vendors", vendors);

  const CompanyOptions = vendors
    ?.filter((vendor) => vendor.company_name && vendor.company_name.trim() !== "")
    .map((vendor) => ({
      value: vendor.company_name,
      label: vendor.company_name
    }));

  const paymentTermOptions = vendors
    ?.filter((vendor) => vendor.payment_term_name && vendor.payment_term_name.trim() !== "")
    .map((vendor) => ({
      value: vendor.payment_term_name,
      label: vendor.payment_term_name
    }));

  const handleAddVendor = (text) => {
    navigate(`/add-vendor?vendor_type=${text}`)
  }

  const onChangePage = useCallback(handleChangePage(setCurrentPage), [
    currentPage,
  ]);
  const onChangeRowsPerPage = useCallback(
    handleChangeRowsPerPage(setRowsPerPage),
    [rowsPerPage]
  );
  const onSearch = useCallback(handleSearch(setSearchQuery), [searchQuery]);
  console.log("onSearch", searchQuery);

  const onDelete = useCallback(
    // console.log("vendor current ID", currentId)
    (id) => {
      handleDelete(dispatch, setCurrentId, setDeleteModal)(id);
    },
    [dispatch, currentId]
  );

  const vendorColumns = [
    {
      name: "Display Name",
      selector: (row) => row.vendor_display_name == null || undefined || row.vendor_display_name.length == 0 ? "-" : highlightSearchTerm(row.vendor_display_name),
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email == null || undefined || row.email.length == 0 ? "-" : row.email,
      sortable: true,
    },
    {
      name: "Company name",
      selector: (row) => row.company_name == null || undefined || row.company_name.length == 0 ? "-" : row.company_name,
      sortable: true,
    },
    {
      name: "Payment Term",
      selector: (row) => row.payment_term_name == null || undefined || row.payment_term_name.length == 0 ? "-" : row.payment_term_name,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phone_no == null || undefined || row.phone_no.lenght == 0 ? "-" : row.phone_no,
      sortable: true,
    },
    {
      name: "Country",
      selector: (row) => row?.country == null || undefined || row.country.length == 0 ? "-" : row.country,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="flex-center gap-2 cursor-pointer">
          <FaEye
            size={15}
            className="text-eye_black dark:text-eye_white"
            title="View"
            onClick={() => navigate(`/vendor-details?v_id=${row.id}`)}
          />
          <FaEdit
            size={15}
            className={`${textColor}`}
            title="Edit"
            onClick={() => navigate(`/edit-vendor?v_id=${row.id}`)}
          />
          <FaTrash
            size={15}
            className="text-red-600"
            title="Delete"
            onClick={() => {
              setCurrentId(row.id);
              setDeleteModal(true);
            }}
          />
        </div>
      )

    },
  ];

  // Handle row click
  const handleRowClick = (row) => {
    navigate(`/vendor-details?v_id=${row.id}`);
  };

  //* Hooks */

  useEffect(() => {
    dispatch(
      getVendors({
        page: currentPage,
        limit: rowsPerPage,
        search_vendor_display_name: searchQuery,
      })
    );
  }, [dispatch, onChangePage, onChangeRowsPerPage, onSearch, onDelete]);

  const highlightSearchTerm = (text) => {
    if (!searchQuery) return text;

    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-blue-100 rounded-sm">{part}</span>
      ) : part
    );
  };


  // Filter state
  const [providerType, setProviderType] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedPaymentTerm, setSelectedPaymentTerm] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false); // Track if filter is applied 
  const [loading, setLoading] = useState(false);

  // Combined filters state
  const getSelectedValues = () => {
    const selectedValues = [];
    if (providerType) selectedValues.push({ label: providerType, type: 'providerType' });
    if (selectedCompany) selectedValues.push({ label: selectedCompany, type: 'selectedCompany' });
    if (selectedPaymentTerm) selectedValues.push({ label: selectedPaymentTerm, type: 'selectedPaymentTerm' });
    return selectedValues;
  };

  const hasSelectedFilters = getSelectedValues().length > 0;

  // Fetch filtered data
  const fetchFilteredData = useCallback(() => {
    setLoading(true); // Start loader
    dispatch(
      getVendors({
        page: pagination.currentPage,
        limit: pagination.limit,
        payment_term_name: selectedPaymentTerm,
        search_company_name: selectedCompany,
        provider_type: providerType
      })
    ).finally(() => {
      setLoading(false); // Stop loader after the action is completed
    });
  }, [dispatch, pagination.currentPage, pagination.limit, selectedPaymentTerm, selectedCompany, providerType]);

  useEffect(() => {
    if (isFilterApplied) {
      console.log("fetchFilteredData()", fetchFilteredData());
      fetchFilteredData();
    }
  }, [fetchFilteredData, isFilterApplied]);

  // Clear all filters
  const clearFilters = () => {
    setLoading(true); // Start loader
    setProviderType('');
    setSelectedCompany('');
    setSelectedPaymentTerm('');
    setIsFilterApplied(false); // Reset filter applied status
    dispatch(getVendors({ page: 1, limit: 10 })).finally(() => {
      setLoading(false); // Stop loader after clearing filters
    });
  };

  // Function to remove a specific filter and reset the corresponding dropdown
  const removeFilter = (type) => {
    switch (type) {
      case 'providerType':
        setProviderType(''); // Clear the provider type
        break;
      case 'selectedCompany':
        setSelectedCompany(''); // Clear the selected company
        break;
      case 'selectedPaymentTerm':
        setSelectedPaymentTerm(''); // Clear the selected payment term
        break;
      default:
        break;
    }
  };

  const providerOptions = [
    { value: "SERVICE", label: "SERVICE" },
    { value: "PRODUCTS", label: "PRODUCTS" },
  ];

  return (
    <>

      <div className="my-5">
        <Header
          title={"Vendors"}
          buttonTitle={"Add"}
          buttonIcon={FaPlus}
          viewType={viewType}
          onViewType={setViewType}
          filtericon={filter}
          filterOnClick={() => setFilterModal(true)}
          onSearch={onSearch}
          onAddButtonClick={() => setVendorTypeModal(true)}
        />
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
                  data={vendors}
                  columns={vendorColumns}
                  pagination
                  onRowClicked={handleRowClick}
                  className="cursor-pointer"
                  paginationServer
                  paginationTotalRows={pagination.totalItems}
                  onChangeRowsPerPage={onChangeRowsPerPage}
                  onChangePage={onChangePage}
                />
              </>
            )}
          </>
        ) : (
          <div className="card-view">
            {vendors.map((item) => {
              return (
                <>
                  <div className="cursor-pointer card bg-white border-none" style={{ filter: "drop-shadow(0px 4px 3px rgba(0, 0, 0, 0.07)) drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.06))" }}>
                    <div className="card-body">

                      <div className="flex-between">
                        <h1 onClick={() => navigate(`/vendor-details?v_id=${item.id}`)} style={{ fontWeight: "bold", color: "#353535", fontSize: "20px" }}>
                          {item?.vendor_display_name}
                        </h1>

                        <div>
                          <div className="flex-center gap-2 cursor-pointer">
                            <FaEdit
                              size={15}
                              className={`${textColor}`}
                              title="Edit"
                              onClick={() => navigate(`/edit-vendor?v_id=${item.id}`)}
                            />
                            <FaTrash
                              size={15}
                              className="text-red-600"
                              title="Delete"
                              onClick={() => {
                                setCurrentId(item.id);
                                setDeleteModal(true);
                              }}
                            />
                          </div>

                        </div>
                      </div>

                      <div onClick={() => navigate(`/vendor-details?v_id=${item.id}`)} className="card-item"> {/* Added flexbox classes */}

                        <h1 className="font-medium" style={{ color: "#7A7A7A", fontSize: "16px" }}>
                          Company Name
                        </h1>
                        <h1 style={{ color: "#1F2937", fontWeight: "bold", fontSize: "16px" }}>{item?.company_name || "NOT YET"}</h1>
                      </div>

                      <div onClick={() => navigate(`/vendor-details?v_id=${item.id}`)} className="card-item"> {/* Added flexbox classes */}

                        <h1 className="font-medium" style={{ color: "#7A7A7A", fontSize: "16px" }}>
                          Type
                        </h1>
                        <h1 style={{ color: "#1F2937", fontWeight: "bold", fontSize: "16px" }}>{item?.v_type || "NOT YET"}</h1>
                      </div>

                      <div onClick={() => navigate(`/vendor-details?v_id=${item.id}`)} className="card-item"> {/* Added flexbox classes */}

                        <h1 className="font-medium" style={{ color: "#7A7A7A", fontSize: "16px" }}>
                          Phone #
                        </h1>
                        <h1 style={{ color: "#1F2937", fontWeight: "bold", fontSize: "16px" }}>{item?.phone_no || "NOT YET"}</h1>
                      </div>

                      <div onClick={() => navigate(`/vendor-details?v_id=${item.id}`)} className="card-item"> {/* Added flexbox classes */}

                        <h1 className="font-medium" style={{ color: "#7A7A7A", fontSize: "16px" }}>
                          Country
                        </h1>
                        <h1 style={{ color: "#1F2937", fontWeight: "bold", fontSize: "16px" }}>{item?.country || "NOT YET"}</h1>
                      </div>

                      <div onClick={() => navigate(`/vendor-details?v_id=${item.id}`)} className="card-item"> {/* Added flexbox classes */}

                        <h1 className="font-medium" style={{ color: "#7A7A7A", fontSize: "16px" }}>
                          Payment Term
                        </h1>
                        <h1 style={{ color: "#1F2937", fontWeight: "bold", fontSize: "16px" }}>{item?.payment_term_name || "NOT YET"}</h1>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        )}

        <Modal
          title={"Delete Vendor"}
          size="sm"
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
        >

          <div className="flex-col items-center">
            <img src={delete_icon} className="mb-6 w-20 mx-auto" />

            <h1 className="text-center mx-auto text-base font-semibold">
              Are you sure want to delete this vendor?{" "}
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
          title={"Delete Vendor"}
          size="sm"
          isOpen={vendorTypeModal}
          onClose={() => setVendorTypeModal(false)}
        >
          <div className="flex flex-col items-center "> {/* Added flex-col and items-center for centering */}

            <img src={vendor_type} alt="Vendor Type" className="mb-3 mx-auto" /> {/* Added mx-auto to center the image */}

            <p className="text-center font-bold mb-3" style={{ fontSize: "25px" }}>
              Vendor Type
            </p> {/* Title text */}

            <p
              className="text-center text-base font-medium mb-3 mx-auto"
              style={{ width: '90%', color: 'gray' }}  // Applied custom width and color
            >
              Please choose whether you're adding a Supplier or a Store to proceed{" "}
            </p> {/* Added custom width and ensured the container is centered */}

            <div className="flex gap-3 mt-3">
              <button
                style={{
                  width: "90px",
                  border: "1px solid black",
                  borderRadius: "10px",
                  padding: "8px",
                }}
                onClick={() => handleAddVendor("SUPPLIER")}
              >
                Supplier
              </button>
              <button
                style={{
                  width: "90px",
                  border: "1px solid black",
                  borderRadius: "10px",
                  padding: "8px",
                }}
                onClick={isLoading ? "" : () => handleAddVendor("STORE")}
              >
                Store
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
                label="Providers"
                options={providerOptions}
                value={providerType} // Bind the selected value
                onChange={(e) => setProviderType(e.target.value)} // Set provider type
                className="w-full border border-gray-300 p-2 rounded-lg"
              />

              <FilterSelect
                label="Company Name"
                options={CompanyOptions}
                value={selectedCompany} // Bind the selected value
                onChange={(e) => setSelectedCompany(e.target.value)} // Set selected company
                className="w-full border border-gray-300 p-2 rounded-lg"
              />

              <FilterSelect
                label="Payment Term"
                options={paymentTermOptions}
                value={selectedPaymentTerm} // Bind the selected value
                onChange={(e) => setSelectedPaymentTerm(e.target.value)} // Set selected payment term
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
    </>
  );
};

export default Vendor;
