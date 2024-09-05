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

const AddPurchaseRequistion = () => {
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
        fetchVendors();
        fetchItems();
    }, []);

    const [itemdetails, setItemdetails] = useState([]);
    const fetchItemByID = async (item_id) => {

        try {
            const promises = item_id.map(async (id) => {
                // Fetch the item details by ID (assuming fetchSingleItemByID is your API call) 

                const response = await fetch(`${API_URL}/item/specific?id=${id}`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // console.log("data data", data);
                return data.result; // Adjust this based on your API response structure
            });

            const itemsDetailsArray = await Promise.all(promises);
            console.log("item detail", itemsDetailsArray);
            setItemdetails(itemsDetailsArray);


        } catch (error) {
            console.log(error.message);
        }
    };

    const [itemOptions, setItemOptions] = useState([]);
    const fetchItems = async () => {

        try {
            const response = await fetch(`${API_URL}/item/get/list`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            const formattedVendors = data.result.items.map((item) => ({
                value: item.id,
                label: item.name
            }));
            setItemOptions(formattedVendors);
        } catch (error) {
            console.log(error.message);
        }
    };

    const [vendorOptions, setVendorOptions] = useState([]);
    const fetchVendors = async () => {

        try {
            const response = await fetch(`${API_URL}/vendor`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            const formattedVendors = data.result.vendors.map((vendor) => ({
                value: vendor.id,
                label: `${vendor.first_name} ${vendor.last_name}`
            }));
            setVendorOptions(formattedVendors);
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
        console.log(data, data.items);

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

            formData.append("pr_number", data.pr_no);
            formData.append("status", "DRAFT");
            formData.append("pr_detail", data.pr_detail);
            formData.append("priority", data.priority);
            formData.append("requested_by", data.requested_by);
            formData.append("requested_date", formatDateToISO(data.requested_date));
            formData.append("required_date", formatDateToISO(data.required_date));
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
        pr_no: Yup.string().required('PR Number is required'),
        pr_detail: Yup.string().required('PR Detail is required'),
        priority: Yup.string().required('Priority is required'),
        requested_by: Yup.string().required('Requested By is required'),
        requested_date: Yup.date().required('Requested Date is required'),
        required_date: Yup.date().required('Required Date is required'),
        shipment_pre: Yup.string().required('Shipment Preference is required'),
        shipment_address: Yup.string().required('Shipment Address is required'),
        items: Yup.array().of(
            Yup.object().shape({
                item_id: Yup.string().required('Item ID is required'),
                available_stock: Yup.number().required('Stock in hand is required').typeError('Stock in hand must be a number'),
                required_quantity: Yup.number().required('Required quantity is required').typeError('Required quantity must be a number'),
                price: Yup.number().required('Price is required').typeError('Price must be a number'),
                preferred_vendor_ids: Yup.array()
                    .of(Yup.string().required('Vendor ID is required')) // Check if individual vendor IDs are required
                    .min(1, 'Preferred Vendor is required') // Ensures that at least one vendor is selected
                    .required('Preferred Vendor is required'),
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
            if (!item.preferred_vendor_ids || item.preferred_vendor_ids.length === 0) errors[`items[${index}].preferred_vendor_ids`] = 'Preferred Vendor is required';
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

                <h1 className="modal-item-heading">Add Purchase Requisition</h1>
            </div>

            <Formik
                initialValues={{
                    pr_no: "",
                    pr_detail: "",
                    priority: "",
                    requested_by: "",
                    requested_date: "",
                    required_date: "",
                    shipment_pre: "",
                    shipment_address: "",
                    items: [],
                    vendor: [],
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
                    const handleItemFieldChange = (index, field, value) => {
                        // Update the field value
                        setFieldValue(`items[${index}].${field}`, value);
                        // Clear the error for this field if there's a value
                        setItemErrors(prevErrors => {
                            const newErrors = { ...prevErrors };
                            if (value) {
                                delete newErrors[`items[${index}].${field}`];
                            }
                            return newErrors;
                        });
                        // Validate the field
                        validateField(`items[${index}].${field}`);
                    };

                    const handleItemSelection = (selectedItemIds) => {
                        const updatedItems = selectedItemIds.map(id => {
                            console.log("id", id)
                            const existingItem = values.items.find(item => item.item_id === id);
                            return existingItem || {
                                item_id: id,
                                available_stock: '',
                                required_quantity: '',
                                price: '',
                                preferred_vendor_ids: []
                            };
                        });
                        setFieldValue('items', updatedItems);
                        const errors = validateItems(updatedItems);
                        setItemErrors(errors);

                        fetchItemByID(updatedItems.map((item) => (item.item_id)));

                    };

                    const handlePreferredVendorChange = (index, selectedVendors) => {

                        setFieldValue(`items[${index}].preferred_vendor_ids`, selectedVendors);
                        // Clear the error for this field if there's a value
                        setItemErrors(prevErrors => {
                            const newErrors = { ...prevErrors };
                            if (selectedVendors) {
                                delete newErrors[`items[${index}].preferred_vendor_ids`];
                            }
                            return newErrors;
                        });
                        // Validate the field
                        validateField(`items[${index}].preferred_vendor_ids`);

                    };

                    return (
                        <Form>
                            <div>
                                <div className="modal-item-container">
                                    <div>
                                        <AppInput
                                            type="text"
                                            label="PR Number"
                                            name="pr_no"
                                            value={values.pr_no}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="pr_no" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>

                                    <div>
                                        <AppSelect
                                            label="Priority"
                                            name="priority"
                                            value={values.priority}
                                            options={priorityOptions}
                                            onChange={handleChange("priority")}
                                        />
                                        <ErrorMessage name="priority" />
                                    </div>
                                    <div>
                                        <AppInput
                                            type="text"
                                            label="Requested By"
                                            name="requested_by"
                                            value={values.requested_by}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="requested_by" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>
                                    <div>
                                        <AppInput
                                            type="date"
                                            label="Requested Date"
                                            name="requested_date"
                                            value={values.requested_date}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="requested_date" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>
                                    <div>
                                        <AppInput
                                            type="date"
                                            label="Required Date"
                                            name="required_date"
                                            value={values.required_date}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="required_date" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>
                                    <div>
                                        <AppInput
                                            type="text"
                                            label="Shipment Preference"
                                            name="shipment_pre"
                                            value={values.shipment_pre}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="shipment_pre" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div> 

                                    <div >
                                        <AppMultiSelect
                                            label="Item"
                                            name="items"
                                            value={values.items.map(item => item.item_id)} // Display only item IDs
                                            options={itemOptions}
                                            onChange={handleItemSelection}
                                            isMulti={true}
                                        />

                                        {errors.items && (
                                            <>
                                                {values.items && values.items.length == 0 ?
                                                    <div style={{ color: 'red', fontSize: "13px" }}>Item is required</div>
                                                    :
                                                    <></>
                                                }
                                                {/* {console.log(values.items && values.items)} */}
                                            </>
                                        )}
                                    </div>

                                    <div>
                                        <AppInput
                                            type="textarea"
                                            label="Shipment Address"
                                            name="shipment_address"
                                            value={values.shipment_address}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="shipment_address" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>

                                    <div>
                                        <AppInput
                                            type="textarea"
                                            label="PR Detail"
                                            name="pr_detail"
                                            value={values.pr_detail}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="pr_detail" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>

                                </div>

                                {values.items.map((item, index) => {
                                    const itemDetail = itemdetails.find(detail => detail.id === item.item_id);
                                    return (
                                        <div key={index} className="p-3 relative container mx-auto">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updatedItems = values.items.filter((_, idx) => idx !== index);
                                                    setFieldValue('items', updatedItems);
                                                    setItemdetails(prevDetails => prevDetails.filter(detail => detail.vendor_id !== item.vendor_id));
                                                }}
                                                className="absolute top-0 right-0 m-1 border border-gray-500 w-8 rounded text-red-500 hover:bg-red-500 hover:text-white transition"
                                            >
                                                &#10005; {/* Cross icon */}
                                            </button>

                                            <div className="m-4 grid grid-cols-12 gap-4">
                                                {/* Item Details Grid */}
                                                <div className="mt-6 md:col-span-3 flex items-center border border-gray-400 p-2 rounded-lg" style={{ height: '80%' }}>
                                                    <img
                                                        src={itemDetail?.image || imagePlaceholder}
                                                        alt="item"
                                                        className="border border-gray-400 rounded-lg p-2 w-20 h-20 mr-2"
                                                    />
                                                    <div>
                                                        <div className="font-bold text-lg">{itemDetail?.name}</div>
                                                        <div className="font-bold text-lg">{itemDetail?.type}</div>
                                                    </div>
                                                </div>

                                                {/* Fields Grid */}
                                                <div className="md:col-span-9 grid grid-cols-12 gap-4">
                                                    {/* Stock in Hand Field */}
                                                    <div className="md:col-span-4">
                                                        <AppInput
                                                            type="number"
                                                            label="Stock in hand"
                                                            name={`items[${index}].available_stock`}
                                                            value={item.available_stock}
                                                            onChange={(e) => handleItemFieldChange(index, 'available_stock', e.target.value)}
                                                        />
                                                        {itemErrors[`items[${index}].available_stock`] && (
                                                            <div style={{ color: "red", fontSize: "13px" }}>
                                                                {itemErrors[`items[${index}].available_stock`]}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Required Quantity Field */}
                                                    <div className="md:col-span-4">
                                                        <AppInput
                                                            type="number"
                                                            label="Required quantity"
                                                            name={`items[${index}].required_quantity`}
                                                            value={item.required_quantity}
                                                            onChange={(e) => handleItemFieldChange(index, 'required_quantity', e.target.value)}
                                                        />
                                                        {itemErrors[`items[${index}].required_quantity`] && (
                                                            <div style={{ color: "red", fontSize: "13px" }}>
                                                                {itemErrors[`items[${index}].required_quantity`]}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Price Field */}
                                                    <div className="md:col-span-4">
                                                        <AppInput
                                                            type="number"
                                                            label="Price"
                                                            name={`items[${index}].price`}
                                                            value={item.price}
                                                            onChange={(e) => handleItemFieldChange(index, 'price', e.target.value)}
                                                        />
                                                        {itemErrors[`items[${index}].price`] && (
                                                            <div style={{ color: "red", fontSize: "13px" }}>
                                                                {itemErrors[`items[${index}].price`]}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Preferred Vendor Field */}
                                                    <div className="md:col-span-12">
                                                        <AppMultiSelect
                                                            label="Preferred Vendor"
                                                            name={`items[${index}].preferred_vendor_ids`}
                                                            value={item.preferred_vendor_ids}
                                                            options={vendorOptions}
                                                            onChange={(selectedVendors) => handlePreferredVendorChange(index, selectedVendors)}
                                                            isMulti={true}
                                                        />
                                                        {itemErrors[`items[${index}].preferred_vendor_ids`] && (
                                                            <div style={{ color: "red", fontSize: "13px" }}>
                                                                {itemErrors[`items[${index}].preferred_vendor_ids`]}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

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

export default AddPurchaseRequistion;
