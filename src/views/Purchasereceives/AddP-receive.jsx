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
    const fetchItemByID = async (vendor_id) => {
        try {
            const promises = vendor_id.map(async (id) => {
                const response = await fetch(`${API_URL}/purchase/receives/get/purchase/item?purchase_order_id=${poID}&vendor_id=${id}`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                return data.result;
            });

            const itemsDetailsArray = await Promise.all(promises);

            // Flatten the array to merge items from multiple vendors
            const flatItems = itemsDetailsArray.reduce((acc, details) => {
                details.items.forEach(item => {
                    acc.push({
                        item_id: item.item_id,
                        available_stock: item.available_stock,
                        required_quantity: item.required_quantity,
                        price: item.price,
                        purchase_item_ids: details.purchase_item_ids,
                    });
                });
                return acc;
            }, []);

            console.log("flatItems", flatItems);

            return flatItems;

        } catch (error) {
            console.log(error.message);
            return [];
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
        console.log(data);

        // const formData = new FormData();

        // const formatDateToISO = (dateString) => {
        //     const date = new Date(dateString);
        //     return date.toISOString();  // Converts to 'YYYY-MM-DDTHH:mm:ss.sssZ'
        // };

        // setIsLoading(true);
        // setTimeout(() => {

        //     const totalAmount = data.items.reduce((total, item) => total + parseFloat(item.price || 0), 0);

        //     // console.log("Total Amount:", totalAmount);

        //     const InsertAPIURL = `${API_URL}/purchase-requisition/create`;

        //     formData.append("pr_number", data.po_no);
        //     formData.append("status", "DRAFT");
        //     formData.append("pr_detail", data.pr_detail);
        //     formData.append("priority", data.priority);
        //     formData.append("requested_by", data.requested_by);
        //     formData.append("requested_date", formatDateToISO(data.requested_date));
        //     formData.append("received_date", formatDateToISO(data.received_date));
        //     formData.append("shipment_preferences", data.shipment_pre);
        //     formData.append("delivery_address", data.shipment_address);

        //     const items = data.items.map((item) => ({
        //         "item_id": item.item_id,
        //         "available_stock": item.available_stock,
        //         "required_quantity": item.required_quantity,
        //         "price": item.price,
        //         "preffered_vendor_ids": item.preferred_vendor_ids
        //     }));

        //     formData.append("items", JSON.stringify(items));

        //     formData.append("total_amount", totalAmount);

        //     fetch(InsertAPIURL, {
        //         method: 'POST',
        //         body: formData,
        //     })
        //         .then(response => response.json())
        //         .then(response => {
        //             console.log(response);
        //             setIsLoading(false);

        //             if (response.success) {
        //                 setIsLoading(false);
        //                 toast.success(response.message);
        //                 navigate("/puchase-requisition");
        //                 // setItems([{
        //                 //     item_id: "",
        //                 //     available_stock: "",
        //                 //     required_quantity: "",
        //                 //     price: "",
        //                 //     preffered_vendor_ids: []
        //                 // }]);
        //                 // resetForm();
        //             } else {
        //                 setIsLoading(false);
        //                 toast.error(response.error.message);
        //             }
        //         })
        //         .catch(error => {
        //             setIsLoading(false);
        //             toast.error(error.message, {
        //                 position: toast.POSITION.BOTTOM_CENTER
        //             });
        //         });
        // }, 3000);

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
                vendor_id: Yup.string().required('Item ID is required'),
                available_stock: Yup.number().required('Stock in hand is required').typeError('Stock in hand must be a number'),
                required_quantity: Yup.number().required('Required quantity is required').typeError('Required quantity must be a number'),
                price: Yup.number().required('Price is required').typeError('Price must be a number'),
                // purchase_item_ids: Yup.array().of(Yup.string()).required('purchase_item_ids is required'),
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
            if (!item.purchase_item_ids.length) errors[`items[${index}].purchase_item_ids`] = 'purchase_item_ids is required';
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
                validationSchema={Yup.object({
                    po_no: Yup.string().required('PR Number is required'),
                    received_date: Yup.date().required('Required Date is required'),
                    items: Yup.array().of(
                        Yup.object().shape({
                            vendor_id: Yup.string().required('Vendor ID is required'),
                            available_stock: Yup.number().required('Stock in hand is required'),
                            required_quantity: Yup.number().required('Required quantity is required'),
                            price: Yup.number().required('Price is required'),
                        })
                    ).min(1, 'At least one item is required'),
                })}
                onSubmit={(values) => {
                    const itemIds = new Set(); // To collect unique item IDs
                    const vendorItemsMap = new Map(); // To group items by vendor ID

                    values.items.forEach(item => {
                        itemIds.add(item.purchase_item_ids[0]); // Assuming only one ID per item

                        if (!vendorItemsMap.has(item.vendor_id)) {
                            vendorItemsMap.set(item.vendor_id, []);
                        }

                        vendorItemsMap.get(item.vendor_id).push({
                            quantity_received: item.required_quantity,
                            rate: item.price
                        });
                    });

                    const transformedData = {
                        purchase_order_id: values.po_no,
                        item_ids: Array.from(itemIds),
                        items: Array.from(vendorItemsMap.entries()).map(([vendor_id, items]) => ({
                            vendor_ids: [vendor_id],
                            ...items.reduce((acc, item) => {
                                acc.quantity_received = (acc.quantity_received || 0) + item.quantity_received;
                                acc.rate = item.rate; // Assuming rate is consistent for each vendor
                                return acc;
                            }, {})
                        })),
                        received_date: values.received_date
                    };

                    handleAddPR(transformedData); // Proceed with submission if there are no errors
                }}
            >
                {({ values, handleChange, handleSubmit, setFieldValue, validateField, errors, touched }) => {
                    const handlePOChange = async (event) => {
                        const poNumber = event.target.value;
                        // Update Formik's field value
                        setFieldValue('po_no', poNumber);

                        // Perform additional actions
                        await fetchVendors(poNumber);
                        await fetchItems(poNumber);
                        setpoID(poNumber);
                    };

                    const handleItemSelection = async (selectedVendorIds) => {
                        const updatedItems = selectedVendorIds.map(id => ({
                            vendor_id: id,
                            available_stock: '',
                            required_quantity: '',
                            price: '',
                            purchase_item_ids: [],
                        }));

                        setFieldValue('items', updatedItems);

                        const items = await fetchItemByID(selectedVendorIds);
                        const finalItems = items.map((item, index) => ({
                            ...updatedItems[index],
                            ...item,
                        }));

                        setFieldValue('items', finalItems);
                    };

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

                    return (
                        <Form>
                            <div className="modal-item-container">
                                <div>
                                    <AppSelect
                                        label="PO Number"
                                        name="po_number"
                                        value={values.po_no}
                                        options={posOptions}
                                        onChange={handlePOChange}
                                    />
                                    <ErrorMessage name="po_no" />
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
                                        name="vendor_id"
                                        value={values.items.map(item => item.vendor_id)}
                                        options={vendorOptions}
                                        onChange={handleItemSelection}
                                        isMulti={true}
                                    />
                                    {errors.items && values.items.length === 0 && (
                                        <div style={{ color: 'red', fontSize: "13px" }}>Item is required</div>
                                    )}
                                </div>
                            </div>

                            {values.items.map((item, index) => (
                                item.vendor_id && (
                                    <div className="m-4 grid xs:grid-cols-12 md:grid-cols-5 gap-2" key={`${item.item_id}-${index}`}>
                                        <div>
                                            <AppInput
                                                type="text"
                                                label="Item"
                                                name={`items[${index}].item_id`}
                                                value={item.item_id}
                                                onChange={(e) => handleItemFieldChange(index, 'item_id', e.target.value)}
                                            />
                                            {errors.items?.[index]?.item_id && touched.items?.[index]?.item_id && (
                                                <div style={{ color: "red", fontSize: "13px" }}>
                                                    {errors.items[index].item_id}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <AppInput
                                                type="number"
                                                label="Available Stock"
                                                name={`items[${index}].available_stock`}
                                                value={item.available_stock}
                                                onChange={(e) => handleItemFieldChange(index, 'available_stock', e.target.value)}
                                            />
                                            {errors.items?.[index]?.available_stock && touched.items?.[index]?.available_stock && (
                                                <div style={{ color: "red", fontSize: "13px" }}>
                                                    {errors.items[index].available_stock}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <AppInput
                                                type="number"
                                                label="Required Quantity"
                                                name={`items[${index}].required_quantity`}
                                                value={item.required_quantity}
                                                onChange={(e) => handleItemFieldChange(index, 'required_quantity', e.target.value)}
                                            />
                                            {errors.items?.[index]?.required_quantity && touched.items?.[index]?.required_quantity && (
                                                <div style={{ color: "red", fontSize: "13px" }}>
                                                    {errors.items[index].required_quantity}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <AppInput
                                                type="number"
                                                label="Price"
                                                name={`items[${index}].price`}
                                                value={item.price}
                                                onChange={(e) => handleItemFieldChange(index, 'price', e.target.value)}
                                            />
                                            {errors.items?.[index]?.price && touched.items?.[index]?.price && (
                                                <div style={{ color: "red", fontSize: "13px" }}>
                                                    {errors.items[index].price}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            ))}
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
