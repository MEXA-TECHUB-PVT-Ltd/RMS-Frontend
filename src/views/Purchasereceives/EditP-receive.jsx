import React, { useCallback, useEffect, useState } from "react";
import Button from "../../components/form/Button";
import AppInput from "../../components/form/AppInput";
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from "yup";
import { currency, paymentTerm } from "../../utils/vendor";
import { useDispatch, useSelector } from "react-redux";
import { getPRDetails } from "../../app/features/Purchasereceives/getPurchaseReceivesSlice";
import AppSelect from "../../components/form/AppSelect";
import { useDropzone } from "react-dropzone";
import { FaChevronLeft, FaCloudUploadAlt, FaPlus, FaProductHunt } from "react-icons/fa";
import { addVendor } from "../../app/features/Vendor/addVendorSlice";
import toast from "react-hot-toast";
import { Spinner } from "../../components/theme/Loader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import { getItems } from "../../app/features/Item/getItemSlice";
import ErrorMessage from "../../components/form/ErrorMessage";
import AppMultiSelect from "../../components/form/AppMultiSelect";
import imagePlaceholder from "../../assets/item_image.png";

const API_URL = import.meta.env.VITE_API_URL;

const EditPurchaseReceive = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const prId = searchParams.get("pr_id");

    const { purchase_receives, error } = useSelector((state) => state.getPRs);

    console.log("prdetail prdetail", purchase_receives);

    const [isLoading, setIsLoading] = useState(false);
    const [cnic_back_img, setCnic_back_img] = useState(null);

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
            const filteredOrders = data.result.orders.filter(order => order.status !== 'CANCELLED' && order.status !== 'FULLY DELIVERED');
            const formattedOrders = filteredOrders.map((order) => ({
                value: order.purchase_order_id,
                label: order.purchase_order_number
            }));
            setPOsOptions(formattedOrders);
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

    const [poID, setpoID] = useState(purchase_receives?.purchase_order_id);
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
                label: vendor?.vendor_details?.vendor_display_name
            }));
            setVendorOptions(formattedVendors);
            console.log("formattedVendors", formattedVendors);
        } catch (error) {
            console.log(error.message);
        }
    };

    const [itemdetails, setItemdetails] = useState([]);
    const fetchItemByID = async (vendor_id) => {
        try {
            console.log("fetchItemByID", vendor_id)
            const promises = vendor_id.map(async (id) => {

                console.log("poID", purchase_receives?.purchase_order_id)
                let response;

                if (poID == null || undefined) {
                    response = await fetch(`${API_URL}/purchase/receives/get/purchase/item?purchase_order_id=${purchase_receives?.purchase_order_id}&vendor_id=${id}`);
                } else {
                    response = await fetch(`${API_URL}/purchase/receives/get/purchase/item?purchase_order_id=${poID}&vendor_id=${id}`);
                }


                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                return data.result;
            });

            const itemsDetailsArray = await Promise.all(promises);

            setItemdetails(itemsDetailsArray);
            console.log("itemsDetailsArray", itemsDetailsArray);

            // Flatten the array to merge items from multiple vendors
            const flatItems = itemsDetailsArray.reduce((acc, details) => {
                details.items.forEach(item => {
                    acc.push({
                        vendor_id: item.vendor_id,
                        item_id: item.purchase_item_id,
                        name: item.name,
                        type: item.type,
                        image: item.image,
                        available_stock: item.available_stock,
                        // received_quantity: item.received_quantity,
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


    useEffect(() => {
        fetchCategories();
        fetchVendors(purchase_receives?.purchase_order_id);
        fetchItems(purchase_receives?.purchase_order_id);
        fetchItemByID(purchase_receives?.purchase_order_id);
        fetchPOs();
    }, [purchase_receives, poID]);

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

    const [vendorLimitExceeded, setVendorLimitExceeded] = useState(false);

    const handleEditPR = async (data) => {
        // console.log(data);

        const formatDateToISO = (dateString) => {
            const date = new Date(dateString);
            return date.toISOString();  // Converts to 'YYYY-MM-DDTHH:mm:ss.sssZ'
        };

        // const vendorIds = Array.from(new Set(data.items.map(item => item.vendor_id)));

        // const transformedData = {
        //     purchase_receive_id: purchase_receives?.purchase_receive_id,
        //     vendor_ids: vendorIds,
        //     items: data.items.map(item => ({
        //         item_id: item.item_id,
        //         quantity_received: item.received_quantity,
        //         rate: item.price,
        //     })),
        //     received_date: formatDateToISO(data.received_date),
        //     description: data.description || "Received items for Purchase order",
        // };

        // console.log("transformedData", transformedData);

        setIsLoading(true);
        setTimeout(async () => {
            const InsertAPIURL = `${API_URL}/purchase/receives/update`;
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };

            const vendorIds = Array.from(new Set(data.items.map(item => item.vendor_id)));

            const transformedData = {
                purchase_receive_id: purchase_receives?.purchase_receive_id,
                vendor_ids: vendorIds,
                items: data.items.map(item => ({
                    item_id: item.item_id,
                    quantity_received: item.received_quantity,
                    rate: item.price,
                })),
                received_date: formatDateToISO(data.received_date),
                description: data.description || "Received items for Purchase order",
            };


            await fetch(InsertAPIURL, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(transformedData),
            })
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    setIsLoading(false);
                    if (response.success) {
                        setIsLoading(false);
                        toast.success(response.message);
                        // console.log("API", result.success);
                        navigate("/purchase-receives");
                    } else {
                        setIsLoading(false);
                        toast.error(response.message);
                    }
                }).catch(error => {
                    setIsLoading(false);
                    toast.error(error.message);
                });
        }, 3000);
    };

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

    useEffect(() => {
        try {
            dispatch(getPRDetails({ id: prId })).unwrap();
        } catch (error) {
            toast.error(error.message);
        }
    }, [prId]);

    return (
        <>
            <div
                className="flex justify-start items-center gap-2 pb-5 w-fit"
            >
                <FaChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />

                <h1 className="modal-item-heading">Edit Purchase Receive</h1>
            </div>
            <Formik
                initialValues={{
                    po_no: purchase_receives?.purchase_order_id ?? "",
                    received_date: purchase_receives?.received_date ?? "",
                    description: purchase_receives?.description ?? "",
                    items: purchase_receives ? purchase_receives?.items?.map(item => ({
                        vendor_id: item?.vendors[0]?.vendor_id || "",  // Assuming one vendor per item
                        item_id: item?.item_id,
                        name: item?.name,
                        type: item?.type,
                        image: item?.image,
                        available_stock: item?.stock_in_hand,
                        required_quantity: item?.required_quantity,
                        received_quantity: item?.quantity_received,
                        price: item?.rate,
                        // purchase_item_ids: [item.item_id], // This may vary depending on your structure
                    })) : []
                }}
                enableReinitialize={true}
                validationSchema={Yup.object({
                    po_no: Yup.string().required('PR Number is required'),
                    received_date: Yup.date().required('Received Date is required'),
                    description: Yup.string().required('Description is required'),
                    items: Yup.array().of(
                        Yup.object().shape({
                            vendor_id: Yup.string().required('Vendor ID is required'),
                            available_stock: Yup.number().required('Stock in hand is required'),
                            received_quantity: Yup.number().required('Received quantity is required'),
                            required_quantity: Yup.number().required('Required quantity is required'),
                            price: Yup.number().required('Price is required'),
                        })
                    ).min(1, 'At least one item is required'),
                })}
                onSubmit={handleEditPR}
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
                        if (selectedVendorIds.length > 10) {
                            setVendorLimitExceeded(true);
                            return;
                        } else {
                            setVendorLimitExceeded(false);
                        }

                        const addedVendorIds = selectedVendorIds.filter(id => !values.items.find(item => item.vendor_id === id));
                        const removedVendorIds = values.items.map(item => item.vendor_id).filter(id => !selectedVendorIds.includes(id));

                        if (addedVendorIds.length > 0) {
                            const addedItems = await fetchItemByID(addedVendorIds);
                            const newItems = addedItems.map(item => ({
                                vendor_id: item.vendor_id,
                                item_id: item.item_id,
                                name: item.name,
                                type: item.type,
                                image: item.image,
                                available_stock: item.available_stock,
                                required_quantity: item.required_quantity,
                                // received_quantity: item.received_quantity,
                                price: item.price,
                                purchase_item_ids: item.purchase_item_ids,
                            }));

                            setFieldValue('items', [...values.items, ...newItems]);

                        }

                        if (removedVendorIds.length > 0) {
                            const updatedItems = values.items.filter(item => !removedVendorIds.includes(item.vendor_id));
                            setFieldValue('items', updatedItems);
                        }
                    };


                    const handleItemFieldChange = (index, field, value) => {
                        setFieldValue(`items[${index}].${field}`, value);
                        console.log("prevErrors", `items[${index}].${field}`, value);
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
                            <div className="modal-item-container grid grid-cols-2 gap-2">
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
                                        value={values?.items?.map(item => item?.vendor_id)}
                                        options={vendorOptions}
                                        onChange={handleItemSelection}
                                        isMulti={true}
                                    />
                                    {vendorLimitExceeded && (
                                        <div style={{ color: 'red', fontSize: "13px" }}>You cannot select more than 10 vendors.</div>
                                    )}
                                    {errors.items && values.items.length === 0 && (
                                        <div style={{ color: 'red', fontSize: "13px" }}>Vendor is required</div>
                                    )}
                                </div>

                                <div>
                                    <AppInput
                                        type="textarea"
                                        rows={2}
                                        label="Description"
                                        name="description"
                                        value={values.description}
                                        onChange={handleChange}
                                    />
                                    <ErrorMessage name="description" />
                                </div>

                            </div>

                            {values?.items?.map((item, index) => {
                                return (
                                    item.vendor_id && (
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

                                            <div className="grid grid-cols-6 gap-2 p-3 items-center">
                                                <div>
                                                    <div className="border border-gray-400 p-2 rounded-lg flex items-center">
                                                        {item?.image == null || undefined ? (
                                                            <img src={imagePlaceholder} alt="item" className="border border-gray-400 rounded-lg p-2 w-20 mr-2" />
                                                        ) : (
                                                            <img src={item?.image} alt="item" className="border border-gray-400 rounded-lg p-2 w-20 mr-2" />
                                                        )}
                                                        <div>
                                                            <div className="font-bold text-sm"> {item?.name}</div>
                                                            <div className="font-bold text-sm">{item?.type}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <AppInput
                                                        type="text"
                                                        label="Item"
                                                        name={`items[${index}].item_id`}
                                                        value={item.name}
                                                        disabled
                                                        onChange={(e) => {
                                                            const id = e.target.value;
                                                            setFieldValue(`items[${index}].item_id`, id);
                                                            handleItemFieldChange(index, 'item_id', id);
                                                        }}
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
                                                        disabled
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
                                                        label="Required quantity"
                                                        name={`items[${index}].required_quantity`}
                                                        value={item.required_quantity}
                                                        disabled
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
                                                        label="Received quantity"
                                                        name={`items[${index}].received_quantity`}
                                                        value={item.received_quantity}
                                                        onChange={(e) => handleItemFieldChange(index, 'received_quantity', e.target.value)}
                                                    />
                                                    {errors.items?.[index]?.received_quantity && touched.items?.[index]?.received_quantity && (
                                                        <div style={{ color: "red", fontSize: "13px" }}>
                                                            {errors.items[index].received_quantity}
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <AppInput
                                                        type="number"
                                                        label="Price per unit"
                                                        name={`items[${index}].price`}
                                                        value={item.price}
                                                        disabled
                                                        onChange={(e) => handleItemFieldChange(index, 'price', e.target.value)}
                                                    />
                                                    {errors.items?.[index]?.price && touched.items?.[index]?.price && (
                                                        <div style={{ color: "red", fontSize: "13px" }}>
                                                            {errors.items[index].price}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )
                            })}

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

export default EditPurchaseReceive;
