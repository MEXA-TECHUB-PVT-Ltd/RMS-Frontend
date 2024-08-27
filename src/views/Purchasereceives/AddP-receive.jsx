import React, { useCallback, useEffect, useState } from "react";
import Button from "../../components/form/Button";
import AppInput from "../../components/form/AppInput";
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from "yup";
import { currency, paymentTerm } from "../../utils/vendor";
import { useDispatch, useSelector } from "react-redux";
import { getCurrencies } from "../../app/features/currency/getCurrencySlice";
import { getPaymentTerms } from "../../app/features/paymentTerms/getPaymentTermSlice";
import AppSelect from "../../components/form/AppSelect";
import { useDropzone } from "react-dropzone";
import { FaChevronLeft, FaCloudUploadAlt, FaPlus, FaProductHunt } from "react-icons/fa";
import { addVendor } from "../../app/features/Vendor/addVendorSlice";
import toast from "react-hot-toast";
import { Spinner } from "../../components/theme/Loader";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import { getItems } from "../../app/features/Item/getItemSlice";
import ErrorMessage from "../../components/form/ErrorMessage";
import AppMultiSelect from "../../components/form/AppMultiSelect";
import imagePlaceholder from "../../assets/item_image.png";

const API_URL = import.meta.env.VITE_API_URL;

const AddPurchaseReceive = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [cnic_back_img, setCnic_back_img] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onCnicBackDrop = useCallback((acceptedFile) => {
        setCnic_back_img(
            Object.assign(acceptedFile[0], {
                preview: URL.createObjectURL(acceptedFile[0]),
            })
        );
    }, []);

    const onDocumentDrop = useCallback((acceptedFile) => {
        setDocument(
            Object.assign(acceptedFile[0], {
                preview: URL.createObjectURL(acceptedFile[0]),
            })
        );
    }, []);

    const onCnicDrop = useCallback((acceptedFile) => {
        setCnic_front_img(
            Object.assign(acceptedFile[0], {
                preview: URL.createObjectURL(acceptedFile[0]),
            })
        );
    }, []);

    const priorityOptions = [
        { value: "HIGH", label: "HIGH" },
        { value: "MEDIUM", label: "MEDIUM" },
        { value: "LOW", label: "LOW" }
    ];

    useEffect(() => {
        fetchCategories();
        // fetchVendors();
        fetchItems();
        fetchPOs();
    }, []);

    const [posOptions, setPOsOptions] = useState([]);
    const fetchPOs = async (value) => {
        console.log("category", value);
        try {
            const response = await fetch(`${API_URL}/purchase/order/get/purchase/order`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            const formattedOrders = data.result.orders.map((order) => ({
                value: order.purchase_order_id,
                label: order.purchase_order_number
            }));
            setPOsOptions(formattedOrders);
            // fetchVendors(formattedOrders)
            console.log("formattedOrders", formattedOrders);
        } catch (error) {
            console.log(error.message);
        }
    };

    const [itemOptions, setItemOptions] = useState([]);
    const fetchItems = async (value) => {

        try {
            const response = await fetch(`${API_URL}/purchase/receives/get/purchase/item?purchase_order_id=${value}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            const formattedVendors = data.result.map((item) => ({
                value: item.purchase_item_id,
                label: item.purchase_item_id
            }));
            setItemOptions(formattedVendors);
        } catch (error) {
            console.log(error.message);
        }
    };

    const [poID, setpoID] = useState("");
    const [vendorOptions, setVendorOptions] = useState([]);
    const fetchVendors = async (value) => {
        console.log("value", value)

        try {
            const response = await fetch(`${API_URL}/purchase/receives/get/vendors?purchase_order_id=${value}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            const formattedVendors = data.result.map((vendor) => ({
                value: vendor.vendor_id,
                label: vendor.vendor_id
            }));
            setVendorOptions(formattedVendors);
        } catch (error) {
            console.log(error.message);
        }
    };

    const [itemdetails, setItemdetails] = useState([]);
    const fetchItemByID = async (setFieldValue, vendor_id) => {

        console.log(":ok12", poID, vendor_id);
        try {
            const promises = vendor_id.map(async (id) => {
                // Fetch the item details by ID (assuming fetchSingleItemByID is your API call) 

                const response = await fetch(`${API_URL}/purchase/receives/get/purchase/item?purchase_order_id=${poID}&vendor_id=${id}`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // console.log("data data", data);
                return data.result; // Adjust this based on your API response structure
            });

            const itemsDetailsArray = await Promise.all(promises);
            console.log("item detail", itemsDetailsArray);

            const flattenedItems = itemsDetailsArray.flat();

            console.log("flattenedItems", flattenedItems);

            setItemdetails(flattenedItems);

            flattenedItems.forEach((item, index) => {
                setFieldValue(`items[${index}].item_id`, item.item_id);
                setFieldValue(`items[${index}].quantity_received`, item.required_quantity);
                setFieldValue(`items[${index}].rate`, item.price);
                setFieldValue(`items[${index}].preferred_vendor_ids`, item.preffered_vendor_ids || []);
            });

        } catch (error) {
            console.log(error.message);
        }
    };

    const [categoryOptions, setCategoryOptions] = useState([]);
    const fetchCategories = async () => {

        try {
            const response = await fetch(`${API_URL}/product/category/get/all`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            const formattedCategories = data.result.categories.map((category) => ({
                value: category.id,
                label: category.name,
            }));
            setCategoryOptions(formattedCategories);
        } catch (error) {
            console.log(error.message);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onCnicBackDrop,
        multiple: false,
    });

    const image = () => {
        console.log(cnic_back_img)
    }

    const [newitem, setNewitem] = useState("");

    const handleAddPR = async (data) => {
        // console.log(data, data.items);  

        const formData = new FormData();

        const formatDateToISO = (dateString) => {
            const date = new Date(dateString);
            return date.toISOString();  // Converts to 'YYYY-MM-DDTHH:mm:ss.sssZ'
        };

        setIsLoading(true);
        setTimeout(() => {

            const totalAmount = data.items.reduce((total, item) => total + parseFloat(item.price || 0), 0);

            // console.log("Total Amount:", totalAmount);

            const InsertAPIURL = `${API_URL}/purchase-requisition/create`;

            formData.append("pr_number", data.po_no);
            formData.append("status", "DRAFT");
            formData.append("pr_detail", data.pr_detail);
            formData.append("priority", data.priority);
            formData.append("requested_by", data.requested_by);
            formData.append("requested_date", formatDateToISO(data.requested_date));
            formData.append("received_date", formatDateToISO(data.received_date));
            formData.append("shipment_preferences", data.shipment_pre);
            formData.append("delivery_address", data.shipment_address);

            const items = data.items.map((item) => ({
                "item_id": item.item_id,
                "available_stock": item.available_stock,
                "required_quantity": item.required_quantity,
                "price": item.price,
                "preffered_vendor_ids": item.preferred_vendor_ids
            }));

            formData.append("items", JSON.stringify(items));

            formData.append("total_amount", totalAmount);

            fetch(InsertAPIURL, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    setIsLoading(false);

                    if (response.success) {
                        setIsLoading(false);
                        toast.success(response.message);
                        navigate("/puchase-requisition");
                        // setItems([{
                        //     item_id: "",
                        //     available_stock: "",
                        //     required_quantity: "",
                        //     price: "",
                        //     preffered_vendor_ids: []
                        // }]);
                        // resetForm();
                    } else {
                        setIsLoading(false);
                        toast.error(response.error.message);
                    }
                })
                .catch(error => {
                    setIsLoading(false);
                    toast.error(error.message, {
                        position: toast.POSITION.BOTTOM_CENTER
                    });
                });
        }, 3000);

    };

    // 

    const [itemErrors, setItemErrors] = useState({});

    const validationSchemaProduct = Yup.object({
        po_no: Yup.string().required('PR Number is required'),
        pr_detail: Yup.string().required('PR Detail is required'),
        priority: Yup.string().required('Priority is required'),
        requested_by: Yup.string().required('Requested By is required'),
        requested_date: Yup.date().required('Requested Date is required'),
        received_date: Yup.date().required('Required Date is required'),
        shipment_pre: Yup.string().required('Shipment Preference is required'),
        shipment_address: Yup.string().required('Shipment Address is required'),
        items: Yup.array().of(
            Yup.object().shape({
                item_id: Yup.string().required('Item ID is required'),
                available_stock: Yup.number().required('Stock in hand is required').typeError('Stock in hand must be a number'),
                required_quantity: Yup.number().required('Required quantity is required').typeError('Required quantity must be a number'),
                price: Yup.number().required('Price is required').typeError('Price must be a number'),
                preferred_vendor_ids: Yup.array().of(Yup.string()).required('Preferred Vendor is required'),
            })
        ).min(1, 'At least one item is required'),
        vendor: Yup.array().of(Yup.string()).required('At least one vendor is required'),
    });

    // Function to validate items
    const validateItems = (items) => {
        const errors = {};
        items.forEach((item, index) => {
            if (!item.available_stock) errors[`items[${index}].available_stock`] = 'Stock in hand is required';
            if (!item.required_quantity) errors[`items[${index}].required_quantity`] = 'Required quantity is required';
            if (!item.price) errors[`items[${index}].price`] = 'Price is required';
            if (item.preferred_vendor_ids.length === 0) errors[`items[${index}].preferred_vendor_ids`] = 'Preferred Vendor is required';
        });
        return errors;
    };


    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const paddingLeftRight = windowWidth < 800 ? 0 : 300;

    //////////////////// 

    return (
        <>
            <div
                className="flex justify-start items-center gap-2 pb-5 w-fit"
            >
                <FaChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />

                <h1 className="modal-item-heading">Add Purchase Receive</h1>
            </div>
            <Formik
                initialValues={{
                    po_no: "",
                    received_date: "",
                    items: [],
                }}
                validationSchema={validationSchemaProduct}
                onSubmit={(values, { setErrors }) => {
                    const itemErrors = validateItems(values.items);
                    setItemErrors(itemErrors);

                    if (Object.keys(itemErrors).length > 0) {
                        setErrors(itemErrors);
                        return;
                    }
                    handleAddPR(values);
                }}
            >
                {({ values, handleChange, handleSubmit, setFieldValue, validateField, errors, touched }) => {

                    fetchVendors(values.po_number);

                    const handleItemFieldChange = (index, field, value) => {
                        setFieldValue(`items[${index}].${field}`, value);
                        setItemErrors(prevErrors => {
                            const newErrors = { ...prevErrors };
                            if (value) {
                                delete newErrors[`items[${index}].${field}`];
                            }
                            return newErrors;
                        });
                        validateField(`items[${index}].${field}`);
                    };

                    const handleItemSelection = (selectedItemIds) => {
                        const updatedItems = [];

                        selectedItemIds.forEach(id => {
                            const existingItems = updatedItems.filter(item => item.vendor_id === id);
                            updatedItems.push({
                                vendor_id: id,
                                available_stock: '',
                                required_quantity: '',
                                price: '',
                                preferred_vendor_ids: [],
                            });
                        });

                        setFieldValue('items', updatedItems);

                        console.log("ok ok", selectedItemIds);

                        fetchItemByID(setFieldValue, updatedItems.map((item) => (item.vendor_id)));

                        const errors = validateItems(updatedItems);
                        setItemErrors(errors);
                    };

                    const handlePreferredVendorChange = (index, selectedVendors) => {
                        setFieldValue(`items[${index}].preferred_vendor_ids`, selectedVendors);
                        validateField(`items[${index}].preferred_vendor_ids`);
                    };

                    return (
                        <Form>
                            <div>
                                <div className="modal-item-container">
                                    <div>
                                        <AppSelect
                                            label="PO Number"
                                            name="po_number"
                                            value={values.po_number}
                                            options={posOptions}
                                            onChange={(event) => {
                                                handleChange("po_number");
                                                fetchVendors(event.target.value);
                                                fetchItems(event.target.value)
                                                setpoID(event.target.value);
                                            }}
                                        />
                                        <ErrorMessage name="po_number" />
                                    </div>
                                    <div>
                                        <AppInput
                                            type="date"
                                            label="Receive Date"
                                            name="received_date"
                                            value={values.received_date}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="received_date" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>
                                    <div>
                                        <AppMultiSelect
                                            label="Vendors"
                                            name="items"
                                            value={values.items.map(item => item.vendor_id)}
                                            options={vendorOptions}
                                            onChange={handleItemSelection}
                                            isMulti={true}
                                        />
                                        {errors.items && values.items && values.items.length === 0 && (
                                            <div style={{ color: 'red', fontSize: "13px" }}>Item is required</div>
                                        )}
                                    </div>
                                </div>

                                {/* {values.items.map((item, index) => (
                                    <div className="m-4 grid xs:grid-cols-12 md:grid-cols-5 gap-2" key={`${item.item_id}-${index}`}>
                                        <div>
                                            <AppMultiSelect
                                                label="Purchase Item"
                                                // name={`items[${index}].preferred_vendor_ids`}
                                                // value={item.preferred_vendor_ids} 
                                                onChange={(selectedVendors) => handlePreferredVendorChange(index, selectedVendors)}
                                                isMulti={true}
                                            />
                                            {itemErrors[`items[${index}].preferred_vendor_ids`] && (
                                                <div style={{ color: "red", fontSize: "13px" }}>
                                                    {itemErrors[`items[${index}].preferred_vendor_ids`]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <AppInput
                                                type="number"
                                                label="Received quantity"
                                                name={`items[${index}].quantity_received`}
                                                value={item.quantity_received}
                                                onChange={(e) => handleItemFieldChange(index, 'quantity_received', e.target.value)}
                                            />
                                            {itemErrors[`items[${index}].quantity_received`] && (
                                                <div style={{ color: "red", fontSize: "13px" }}>
                                                    {itemErrors[`items[${index}].quantity_received`]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <AppInput
                                                type="number"
                                                label="Price"
                                                name={`items[${index}].rate`}
                                                value={item.rate}
                                                onChange={(e) => handleItemFieldChange(index, 'rate', e.target.value)}
                                            />
                                            {itemErrors[`items[${index}].rate`] && (
                                                <div style={{ color: "red", fontSize: "13px" }}>
                                                    {itemErrors[`items[${index}].rate`]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))} */}
                            </div>
                            <div className="flex-center">
                                <div className="my-5 w-52">
                                    <Button
                                        onClick={handleSubmit}
                                        title="Submit"
                                        width={true}
                                        spinner={isLoading ? <Spinner size="sm" /> : null}
                                    />
                                </div>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
};

export default AddPurchaseReceive;
