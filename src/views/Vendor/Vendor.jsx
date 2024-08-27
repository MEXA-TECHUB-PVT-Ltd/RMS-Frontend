import React, { useCallback, useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { FaEdit, FaEye, FaTrash, FaPlus } from "react-icons/fa";
import Card from "../../components/card/Card";
import { useDispatch, useSelector } from "react-redux";
import { getVendors } from "../../app/features/Vendor/getVendorSlice";
import CardItem from "../../components/card/CardItem";

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

const Vendor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [viewType, setViewType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentId, setCurrentId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const { textColor } = useSelector((state) => state.theme);
  const { isLoading } = useSelector((state) => state.deleteVendor);
  const { vendors, pagination, error } = useSelector(
    (state) => state?.getVendor
  );

  const onChangePage = useCallback(handleChangePage(setCurrentPage), [
    currentPage,
  ]);
  const onChangeRowsPerPage = useCallback(
    handleChangeRowsPerPage(setRowsPerPage),
    [rowsPerPage]
  );
  const onSearch = useCallback(handleSearch(setSearchQuery), [searchQuery]);

  const onDelete = useCallback(
    // console.log("vendor current ID", currentId)
    (id) => {
      handleDelete(dispatch, setCurrentId, setDeleteModal)(id);
    },
    [dispatch, currentId]
  );

  const vendorColumns = [
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Display Name",
      selector: (row) => row.vendor_display_name,
      sortable: true,
    },
    {
      name: "Company name",
      selector: (row) => row.company_name,
      sortable: true,
    },
    {
      name: "Payment Term",
      selector: (row) => row.payment_term_name,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phone_no,
      sortable: true,
    },
    {
      name: "Country",
      selector: (row) => row.country,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="flex-center gap-2 cursor-pointer">
          <FaEye
            size={20}
            className="text-eye_black dark:text-eye_white"
            onClick={() => navigate(`/vendor-details?v_id=${row.id}`)}
          />
          <FaEdit
            size={20}
            className={`${textColor}`}
            onClick={() => navigate(`/edit-vendor?v_id=${row.id}`)}
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

  //* Hooks */

  useEffect(() => {
    dispatch(
      getVendors({
        page: currentPage,
        limit: rowsPerPage,
        search: searchQuery,
      })
    );
  }, [dispatch, onChangePage, onChangeRowsPerPage, onSearch, onDelete]);

  return (
    <div className="my-5">
      <Header
        title={"Vendors"}
        buttonTitle={"Add"}
        buttonIcon={FaPlus}
        viewType={viewType}
        onViewType={setViewType}
        onSearch={onSearch}
        onAddButtonClick={() => navigate("/add-vendor")}
      />
      {viewType !== "GRID" ? (
        <DataTable
          data={vendors}
          columns={vendorColumns}
          pagination
          paginationServer
          paginationTotalRows={pagination.totalItems}
          onChangeRowsPerPage={onChangeRowsPerPage}
          onChangePage={onChangePage}
        />
      ) : (
        <div className="card-view">
          {vendors.map((item) => {
            return (
              <Card key={item?.id}>
                <CardItem title={"Email"} value={item?.email} />
                <CardItem
                  title={"Display Name"}
                  value={item?.vendor_display_name}
                />
                <CardItem
                  title={"Payment Term"}
                  value={item?.payment_term_name}
                />
                <CardItem title={"Company Name"} value={item?.company_name} />
                <CardItem title={"Phone Number"} value={item?.phone_no} />
                <CardItem title={"Country"} value={item?.country} />
              </Card>
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
        <h1 className="flex-start text-base font-semibold">
          Are you sure want to delete this vendor?{" "}
        </h1>

        <div className="flex-end gap-3 mt-5">
          <Button
            title={"Cancel"}
            onClick={() => setDeleteModal(false)}
            color={"bg-red-500"}
          />
          <Button
            title={"Delete"}
            onClick={isLoading ? "" : () => onDelete(currentId)}
            spinner={isLoading ? <Spinner size="sm" /> : null}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Vendor;
