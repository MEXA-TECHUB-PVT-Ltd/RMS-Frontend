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
import { FaChevronLeft, FaCloudUploadAlt } from "react-icons/fa";
import { addVendor } from "../../app/features/Vendor/addVendorSlice";
import toast from "react-hot-toast";
import { Spinner } from "../../components/theme/Loader";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getItems } from "../../app/features/Item/getItemSlice";
import ErrorMessage from "../../components/form/ErrorMessage";
import AppMultiSelect from "../../components/form/AppMultiSelect";
import Card from "../../components/card/Card";
import Modal from "../../components/modal/Modal";

const API_URL = import.meta.env.VITE_API_URL;

const AddItem = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const itemType = searchParams.get("item_type");

    const theme = useSelector((state) => state.theme);

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

    const itemOptions = [
        { value: "PRODUCT", label: "PRODUCT" },
        { value: "SERVICE", label: "SERVICE" },
    ];

    useEffect(() => {
        fetchCategories();
        fetchVendors();
        fetchUnits();
    }, []);

    const unitCategories = [
        { label: "Mass", value: "mass" },
        { label: "Volume", value: "volume" },
        { label: "Quantity", value: "quantity" }
    ];

    const [category, setCategory] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);
    const fetchUnits = async (value) => {
        console.log("category", value);
        try {
            const response = await fetch(`${API_URL}/units/get?category=${value}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            const formattedVendors = data.result.units.map((vendor) => ({
                value: vendor.id,
                label: vendor.unit
            }));
            setUnitOptions(formattedVendors);
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

    const catalogOptions = [
        { value: "CONSUMER", label: "CONSUMER" },
        { value: "ASSETS", label: "ASSETS" },
    ];

    const {
        getRootProps: documentRootProps,
        getInputProps: documentInputProps,
        isDragActive: isDocumentDrag,
    } = useDropzone({
        onDrop: onDocumentDrop,
        multiple: false,
        accept: {
            "application/pdf": [".pdf"],
        },
    });

    const {
        getRootProps: cnicFrontRootProps,
        getInputProps: cnicInputProps,
        isDragActive: isCnicDrag,
    } = useDropzone({
        onDrop: onCnicDrop,
        multiple: false,
    });

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onCnicBackDrop,
        multiple: false,
    });

    const image = () => {
        console.log(cnic_back_img)
    }

    const handleAddItem = async (data, { resetForm }) => {
        console.log(data);
        console.log(cnic_back_img)

        if (cnic_back_img == null) {
            setIsLoading(true);
            setTimeout(() => {
                const InsertAPIURL = `${API_URL}/item/create`;
                const headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                };

                const transformToNull = (value) => (value.length === 0 ? null : value);

                let Data = {};

                if (itemType === "SERVICE") {
                    Data = {
                        type: itemType,
                        name: data.name,
                        vendor_ids: data.vendor,
                        description: data.service_description,
                    };
                } else if (data.unit_category == "quantity") {
                    Data = {
                        type: itemType,
                        name: data.name,
                        product_category: data.category,
                        unit_category: data.unit_category,
                        quantity_units: data.quantity_unit,// "packs of bread",
                        product_units: data.units,
                        // usage_unit: data.usage_unit,
                        product_catalog: data.catalog,
                        vendor_ids: data.vendor,
                        // image: "image.png",
                        stock_in_hand: transformToNull(data.opening_stock),
                        opening_stock_rate: transformToNull(data.rate_per_unit),
                        reorder_unit: transformToNull(data.re_order_level),
                        inventory_description: transformToNull(data.description),
                    };
                } else {
                    Data = {
                        type: itemType,
                        name: data.name,
                        product_category: data.category,
                        unit_category: data.unit_category,
                        product_units: data.units,
                        // usage_unit: data.usage_unit,
                        product_catalog: data.catalog,
                        vendor_ids: data.vendor,
                        // image: "image.png",
                        stock_in_hand: transformToNull(data.opening_stock),
                        opening_stock_rate: transformToNull(data.rate_per_unit),
                        reorder_unit: transformToNull(data.re_order_level),
                        inventory_description: transformToNull(data.description),
                    };
                }

                fetch(InsertAPIURL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(Data),
                })
                    .then(response => response.json())
                    .then(response => {
                        console.log(response);
                        setIsLoading(false);
                        if (response.success) {
                            setIsLoading(false);
                            toast.success(response.message);
                            navigate("/items");
                            resetForm();
                        } else {
                            setIsLoading(false);
                            toast.error(response.error.message);
                        }
                    })
                    .catch(error => {
                        setIsLoading(false);
                        toast.error(error, {
                            position: toast.POSITION.BOTTOM_CENTER
                        });
                    });
            }, 3000);
        } else {
            setIsLoading(true);
            setTimeout(() => {

                const formData = new FormData();

                formData.append("image", cnic_back_img);

                const InsertAPIURL = `${API_URL}/file/upload`;
                // const headers = {
                //     'Accept': 'application/json',
                //     'Content-Type': 'multipart/form-data',
                // };

                fetch(InsertAPIURL, {
                    method: 'POST',
                    // headers: headers,
                    body: formData,
                })
                    .then(response => response.json())
                    .then(response => {
                        console.log(response);
                        setIsLoading(false);
                        if (response.success) {

                            const InsertAPIURL = `${API_URL}/item/create`;
                            const headers = {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            };

                            const transformToNull = (value) => (value.length === 0 ? null : value);

                            let Data = {};

                            if (itemType === "SERVICE") {
                                Data = {
                                    type: itemType,
                                    name: data.name,
                                    vendor_ids: data.vendor,
                                    description: data.service_description,
                                };
                            } else if (data.unit_category == "quantity") {
                                Data = {
                                    type: itemType,
                                    name: data.name,
                                    product_category: data.category,
                                    unit_category: data.unit_category,
                                    quantity_units: data.quantity_unit,// "packs of bread",
                                    product_units: data.units,
                                    // usage_unit: data.usage_unit,
                                    product_catalog: data.catalog,
                                    vendor_ids: data.vendor,
                                    image: response.data.url,
                                    stock_in_hand: transformToNull(data.opening_stock),
                                    opening_stock_rate: transformToNull(data.rate_per_unit),
                                    reorder_unit: transformToNull(data.re_order_level),
                                    inventory_description: transformToNull(data.description),
                                };
                            } else {
                                Data = {
                                    type: itemType,
                                    name: data.name,
                                    product_category: data.category,
                                    product_units: data.units,
                                    unit_category: data.unit_category,
                                    // usage_unit: data.usage_unit,
                                    product_catalog: data.catalog,
                                    vendor_ids: data.vendor,
                                    image: response.data.url,
                                    stock_in_hand: transformToNull(data.opening_stock),
                                    opening_stock_rate: transformToNull(data.rate_per_unit),
                                    reorder_unit: transformToNull(data.re_order_level),
                                    inventory_description: transformToNull(data.description),
                                };
                            }

                            fetch(InsertAPIURL, {
                                method: 'POST',
                                headers: headers,
                                body: JSON.stringify(Data),
                            })
                                .then(response => response.json())
                                .then(response => {
                                    console.log(response);
                                    setIsLoading(false);
                                    if (response.success) {
                                        setIsLoading(false);
                                        toast.success(response.message);
                                        navigate("/items");
                                        resetForm();
                                    } else {
                                        setIsLoading(false);
                                        toast.error(response.error.message);
                                    }
                                })
                                .catch(error => {
                                    setIsLoading(false);
                                    toast.error(error, {
                                        position: toast.POSITION.BOTTOM_CENTER
                                    });
                                });

                        }
                    })
                    .catch(error => {
                        setIsLoading(false);
                        toast.error(error, {
                            position: toast.POSITION.BOTTOM_CENTER
                        });
                    });
            }, 3000);
        }
    };

    const validationSchemaService = Yup.object().shape({
        // item_type: Yup.string().required("Item type is required"),
        name: Yup.string().required("Name is required"),
        vendor: Yup.array()
            .of(Yup.string().required('Vendor is required'))
            .min(1, 'At least one vendor must be selected')
            .max(10, "Vendors can't be more than 10"),
        service_description: Yup.string().required("Description is required")
    });

    const baseProductValidationSchema = Yup.object().shape({
        // item_type: Yup.string().required("Item type is required"),
        category: Yup.string().required("Category is required"),
        name: Yup.string().required("Name is required"),
        unit_category: Yup.string().required("Unit category is required"),
        units: Yup.string().required("Unit is required"),
        // usage_unit: Yup.string().required("Usage unit is required"),
        catalog: Yup.string().required("Catalog is required"),
        vendor: Yup.array()
            .of(Yup.string().required('Vendor is required'))
            .min(1, 'At least one vendor must be selected')
            .max(10, "Vendors can't be more than 10"),
        opening_stock: Yup.string().required("Stock in hand is required"),
        rate_per_unit: Yup.string().required("Rate per unit is required"),
        re_order_level: Yup.string().nullable(),
        description: Yup.string().nullable()
    });


    const getValidationSchema = (unitCategory) => {
        if (itemType === 'SERVICE') {
            return validationSchemaService;
        } else if (itemType === 'PRODUCT') {
            if (unitCategory === 'quantity') {
                // Add additional validation for quantity_unit if unitCategory is "quantity"
                return baseProductValidationSchema.shape({
                    quantity_unit: Yup.string().required("Quantity unit is required")
                });
            } else {
                // No additional validation for quantity_unit
                return baseProductValidationSchema.shape({
                    quantity_unit: Yup.string().notRequired()
                });
            }
        }
        return baseProductValidationSchema; // Default case if needed
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

    // category
    const [loading, setLoading] = useState(false);
    const [addCategoryModal, setAddCategoryModal] = useState(false);

    const handleAddCategory = async (data, { resetForm }) => {
        console.log(data);
        setLoading(true);
        setTimeout(() => {

            const InsertAPIURL = `${API_URL}/product/category/create`;
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };

            let Data = {};

            Data = {
                name: data.category_name
            };

            fetch(InsertAPIURL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(Data),
            })
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    setLoading(false);
                    if (response.success) {
                        setLoading(false);
                        toast.success(response.message);
                        fetchCategories();
                        setAddCategoryModal(false);
                        resetForm();
                    } else {
                        setLoading(false);
                        toast.error(response.error.message);
                    }
                })
                .catch(error => {
                    setLoading(false);
                    toast.error(error.message);
                });

        }, 3000);
    }

    return (
        <>
            <div className="pl-7 pr-7 pt-7 pb-7">
                <Card>
                    <Formik
                        initialValues={{
                            // item_type: "",
                            category: "",
                            name: "",
                            unit_category: "",
                            units: "",
                            usage_unit: "",
                            quantity_unit: "", // New field for quantity unit
                            // quantity: "", // New field for quantity
                            // usage_quantity: "", // New field for usage quantity
                            catalog: "",
                            // vendor_service: [],
                            vendor: [],
                            opening_stock: "",
                            rate_per_unit: "",
                            re_order_level: "",
                            description: "",
                            service_description: ""
                        }}
                        validationSchema={Yup.lazy(values => getValidationSchema(values.unit_category))}
                        onSubmit={handleAddItem}
                    >
                        {({ values, handleChange, handleSubmit, setFieldValue, isSubmitting }) => {
                            const handleCustomChange = (name) => (event) => {
                                const { value } = event.target;
                                handleChange(event); // Update Formik state
                                setFieldValue(name, value); // Explicitly set Formik field value
                                if (name === 'unit_category') {
                                    setCategory(value); // Update local state
                                    fetchUnits(value);
                                }
                            };
                            return (
                                <Form>
                                    <div className="pt-2 pb-2 container mx-auto">
                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="text-slate-950 col-span-12 sm:col-span-5 md:col-span-5">
                                                <FaChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />
                                            </div>

                                            <div className="col-span-12 sm:col-span-7 md:col-span-7">
                                                <h1 className="text-slate-950 font-bold text-xl text-left">Add Item</h1>
                                            </div>
                                        </div>
                                    </div>

                                    {itemType === "SERVICE" ? (
                                        <>
                                            <div className="pl-5 pr-5 container mx-auto">
                                                <div className="grid grid-cols-12 gap-4">
                                                    {/* <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                                        <AppSelect
                                                            label="Item Type"
                                                            name="item_type"
                                                            value={values.item_type}
                                                            options={itemOptions}
                                                            onChange={handleCustomChange("item_type")}
                                                        />
                                                        <ErrorMessage name="item_type" />
                                                    </div> */}

                                                    <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                                        <AppInput
                                                            type="text"
                                                            label="Name"
                                                            name="name"
                                                            value={values.name}
                                                            onChange={handleCustomChange("name")}
                                                        />
                                                        <ErrorMessage name="name" />
                                                    </div>

                                                    <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                                        <AppMultiSelect
                                                            label="Preferred Vendor"
                                                            name="vendor"
                                                            value={values.vendor} // Should be an array for isMulti
                                                            options={vendorOptions}
                                                            onChange={(value) => setFieldValue('vendor', value)}
                                                            isMulti={true} // Enable multi-select 
                                                        />
                                                        <ErrorMessage name="vendor" />
                                                    </div>

                                                    <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                                        <AppInput
                                                            type="textarea"
                                                            rows={4}
                                                            label="Description"
                                                            name="service_description"
                                                            value={values.service_description}
                                                            onChange={handleCustomChange("service_description")}
                                                        />
                                                        <ErrorMessage name="service_description" />
                                                    </div>

                                                    <div className="flex-center pt-20 pb-5 col-span-12 sm:col-span-12 md:col-span-12">
                                                        <div className="sticky bottom-0 w-full">
                                                            <Button
                                                                onClick={isLoading ? "" : handleSubmit}
                                                                title="Add"
                                                                width={true}
                                                                spinner={isLoading ? <Spinner size="sm" /> : null}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div>

                                            <div className="pl-5 pr-5 container mx-auto">
                                                <div className="grid grid-cols-12 gap-4">
                                                    <div className="pt-5 pb-3 col-span-12 sm:col-span-12 md:col-span-12">
                                                        <h1 className="text-slate-950 text-lg font-bold text-xl">Item Name</h1>
                                                    </div>

                                                    <div className="col-span-12 sm:col-span-12 md:col-span-12">
                                                        <AppInput
                                                            type="text"
                                                            label="Name"
                                                            name="name"
                                                            value={values.name}
                                                            onChange={handleCustomChange("name")}
                                                        />
                                                        <ErrorMessage name="name" />
                                                    </div>

                                                    <div className="pt-5 pb-3 col-span-12 sm:col-span-12 md:col-span-12">
                                                        <h1 className="text-slate-950 text-lg font-bold text-xl">Product Information</h1>
                                                    </div>

                                                    <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                                        <AppSelect
                                                            label="Product Catalog"
                                                            name="catalog"
                                                            value={values.catalog}
                                                            options={catalogOptions}
                                                            onChange={handleCustomChange("catalog")}
                                                        />
                                                        <ErrorMessage name="catalog" />
                                                    </div>

                                                    <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                                        <AppSelect
                                                            label="Unit Category"
                                                            name="unit_category"
                                                            value={values.unit_category}
                                                            options={unitCategories}
                                                            onChange={handleCustomChange("unit_category")}
                                                        />
                                                        <ErrorMessage name="unit_category" />
                                                    </div>

                                                    {values.unit_category === "quantity" ? (
                                                        <>
                                                            <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                                                <AppInput
                                                                    type="text"
                                                                    label="Quantity Unit"
                                                                    name="quantity_unit"
                                                                    value={values.quantity_unit}
                                                                    onChange={handleCustomChange("quantity_unit")}
                                                                />
                                                                <ErrorMessage name="quantity_unit" />
                                                            </div>

                                                            <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                                                <AppInput
                                                                    type="number"
                                                                    label="Quantity"
                                                                    name="units"
                                                                    value={values.units}
                                                                    onChange={handleCustomChange("units")}
                                                                />
                                                                <ErrorMessage name="units" />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                                                <AppSelect
                                                                    label="Units"
                                                                    name="units"
                                                                    value={values.units}
                                                                    options={unitOptions}
                                                                    onChange={handleCustomChange("units")}
                                                                />
                                                                <ErrorMessage name="units" />
                                                            </div>
                                                        </>
                                                    )}

                                                    <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                                        {/* <AppSelect
                                                            label="Category"
                                                            name="category"
                                                            value={values.category}
                                                            options={categoryOptions}
                                                            onChange={handleCustomChange("category")}
                                                        />
                                                        <ErrorMessage name="category" /> */}

                                                        <div className="w-full">
                                                            <label className="block text-lg font-normal text-light_text_1 dark:text-dark_text_1 mb-1 tracking-wide">
                                                                Category
                                                            </label>

                                                            <div className={`flex items-center border rounded-md overflow-hidden focus-within:${theme.borderColor}`}>
                                                                <select
                                                                    value={values.category}
                                                                    onChange={handleChange("category")}
                                                                    className="app-input flex-1"
                                                                >
                                                                    <option value="">Category</option>
                                                                    {categoryOptions?.map((option) => (
                                                                        <>
                                                                            <option key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </option>
                                                                        </>
                                                                    ))}

                                                                </select>

                                                                {/* Add Button */}
                                                                <button
                                                                    type="button"
                                                                    className="bg-blue-950 text-white px-4 py-2"
                                                                    onClick={() => {
                                                                        setAddCategoryModal(true)
                                                                    }}
                                                                >
                                                                    Add
                                                                </button>
                                                            </div>

                                                            <ErrorMessage name="category" />
                                                        </div>

                                                    </div>

                                                    <div className="col-span-12 sm:col-span-12 md:col-span-12">
                                                        <AppMultiSelect
                                                            label="Preferred Vendors"
                                                            name="vendor"
                                                            value={values.vendor} // Should be an array for isMulti
                                                            options={vendorOptions}
                                                            onChange={(value) => setFieldValue('vendor', value)}
                                                            isMulti={true} // Enable multi-select
                                                        />
                                                        <ErrorMessage name="vendor" />
                                                    </div>

                                                    {/* modal */}
                                                    {/* <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                                        <AppSelect
                                                            label="Item Type"
                                                            name="item_type"
                                                            value={values.item_type}
                                                            options={itemOptions}
                                                            onChange={handleCustomChange("item_type")}
                                                        />
                                                        <ErrorMessage name="item_type" />
                                                    </div> */}

                                                    <div className="pt-5 pb-3 col-span-12 sm:col-span-12 md:col-span-12">
                                                        <h1 className="text-slate-950 text-lg font-bold text-xl">Document</h1>
                                                    </div>

                                                    <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                                        {itemType !== "SERVICE" && (
                                                            <div style={{}}>
                                                                <div {...getRootProps()} className="drag-drop-container">
                                                                    <input {...getInputProps()} />
                                                                    {isDragActive ? (
                                                                        <div className="drag-drop-subContainer">Upload image here</div>
                                                                    ) : (
                                                                        <div>
                                                                            {cnic_back_img ? (
                                                                                <img
                                                                                    src={cnic_back_img.preview}
                                                                                    onLoad={() => {
                                                                                        URL.revokeObjectURL(cnic_back_img.preview);
                                                                                    }}
                                                                                    alt=""
                                                                                    className="w-full h-full object-cover"
                                                                                />
                                                                            ) : (
                                                                                <div className="text-center">
                                                                                    <p className="flex-center">
                                                                                        <FaCloudUploadAlt size={50} className="text-gray-700 dark:text-dark_text_1" />
                                                                                    </p>
                                                                                    <p className="font-medium text-sm mb-2">Select or Drop your item image here</p>
                                                                                    <p className="text-sm text-gray-400">Accepted formats: JPG, PNG, JPEG</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="pt-5 pb-3 col-span-12 sm:col-span-12 md:col-span-12">
                                                        <h1 className="text-slate-950 text-lg font-bold text-xl">Inventory Management</h1>
                                                    </div>

                                                    <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                                        <AppInput
                                                            type="number"
                                                            label="Stock in hand"
                                                            name="opening_stock"
                                                            value={values.opening_stock}
                                                            onChange={handleCustomChange("opening_stock")}
                                                        />
                                                        <ErrorMessage name="opening_stock" />
                                                    </div>

                                                    <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                                        <AppInput
                                                            type="number"
                                                            label="Stock rate per unit"
                                                            name="rate_per_unit"
                                                            value={values.rate_per_unit}
                                                            onChange={handleCustomChange("rate_per_unit")}
                                                        />
                                                        <ErrorMessage name="rate_per_unit" />
                                                    </div>

                                                    <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                                        <AppInput
                                                            type="number"
                                                            label="Re-order Level"
                                                            name="re_order_level"
                                                            value={values.re_order_level}
                                                            onChange={handleCustomChange("re_order_level")}
                                                        />
                                                    </div>

                                                    <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                                        <AppInput
                                                            type="textarea" // Change type to "textarea"
                                                            label="Description"
                                                            name="description"
                                                            value={values.description}
                                                            onChange={handleCustomChange("description")}
                                                            rows={4} // You can control the height of the textarea with rows
                                                        />
                                                    </div>

                                                    <div className="flex-center pt-10 col-span-12 sm:col-span-12 md:col-span-12">
                                                        <div className="sticky bottom-0 w-full">
                                                            <Button
                                                                onClick={isLoading ? "" : handleSubmit}
                                                                title="Add"
                                                                width={true}
                                                                spinner={isLoading ? <Spinner size="sm" /> : null}
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    )}


                                </Form>
                            )
                        }}
                    </Formik>
                </Card>

                {/* category */}
                <Modal
                    title={"Add Category"}
                    size="sm"
                    isOpen={addCategoryModal}
                    onClose={() => setAddCategoryModal(false)}
                >
                    <Formik
                        initialValues={{
                            category_name: ""
                        }}
                        validationSchema={Yup.object().shape({
                            category_name: Yup.string().required("Category is required"),

                        })}
                        onSubmit={handleAddCategory}
                    >
                        {({ values, handleChange, handleSubmit, setFieldValue, validateField, errors, touched }) => {

                            return (
                                <Form>
                                    <div className="p-5">
                                        <AppInput
                                            type="text"
                                            label="Category Name"
                                            name="category_name"
                                            value={values.category_name}
                                            onChange={handleChange("category_name")}
                                        />
                                        <ErrorMessage name="category_name" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>

                                    <div className="flex-end gap-3 mt-10">
                                        <Button
                                            title={"Cancel"}
                                            onClick={() => setAddCategoryModal(false)}
                                            color={"bg-red-500"}
                                        />
                                        <Button
                                            title={"Add"}
                                            onClick={handleSubmit}
                                            spinner={loading ? <Spinner size="sm" /> : null}
                                        />
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>

                </Modal>

            </div>
        </>
    );
};

export default AddItem;
