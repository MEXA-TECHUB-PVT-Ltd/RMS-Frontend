import toast from "react-hot-toast";
import { deleteVendor } from "../../app/features/Vendor/deleteVendorSlice";

export const currency = (currency) =>
  currency?.map((c) => {
    return {
      label: c.ccy,
      value: c.id,
    };
  });

export const paymentTerm = (paymentTerm) =>
  paymentTerm?.map((term) => ({
    value: term.id,
    label: term.payment_term_name,
  }));

export const handleChangePage = (setCurrentPage) => (page) => {
  setCurrentPage(page);
};

export const handleChangeRowsPerPage = (setRowsPerPage) => (newRowsPerPage) => {
  setRowsPerPage(newRowsPerPage);
};

export const handleSearch = (setSearchQuery) => (query) => {
  setSearchQuery(query);
};

export const handleDelete =
  (dispatch, setCurrentId, setDeleteModal) => async (id) => {
    try {
      const { message, success } = await dispatch(
        deleteVendor({ id })
      ).unwrap();

      if (success) {
        toast.success(message);
        setCurrentId(null);
        setDeleteModal(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
