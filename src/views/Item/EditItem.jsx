import React, { useCallback, useEffect, useState } from "react";
import Button from "../../components/form/Button";
import AppInput from "../../components/form/AppInput";
import { Formik, Form } from 'formik';
import * as Yup from "yup";
import { currency, paymentTerm } from "../../utils/vendor";
import { useDispatch, useSelector } from "react-redux";
import { getItemDetails } from "../../app/features/Item/getItemSlice";
import AppSelect from "../../components/form/AppSelect";
import { useDropzone } from "react-dropzone";
import { FaChevronLeft, FaCloudUploadAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { Spinner } from "../../components/theme/Loader";
import { useNavigate, useSearchParams } from "react-router-dom";
import ErrorMessage from "../../components/form/ErrorMessage";
import AppMultiSelect from "../../components/form/AppMultiSelect";

const API_URL = import.meta.env.VITE_API_URL;

const EditItem = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const itemId = searchParams.get("item_id");
    const [isLoading, setIsLoading] = useState(false);

    const { itemdetails, error } = useSelector((state) => state.getItem);

    console.log("itemdetails", itemdetails);

    const [cnic_back_img, setCnic_back_img] = useState(null);

    // Initialize with existing image if available
    useEffect(() => {
        if (itemdetails?.image) {
            setCnic_back_img({
                preview: itemdetails.image
            });
        }
    }, [itemdetails,]);

    const onCnicBackDrop = useCallback((acceptedFile) => {
        setCnic_back_img(
            Object.assign(acceptedFile[0], {
                preview: URL.createObjectURL(acceptedFile[0]),
            })
        );
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onCnicBackDrop,
        multiple: false,
    });

    const itemOptions = [
        { value: "PRODUCT", label: "PRODUCT" },
        { value: "SERVICE", label: "SERVICE" },
    ];

    const catalogOptions = [
        { value: "CONSUMER", label: "CONSUMER" },
        { value: "ASSETS", label: "ASSETS" },
    ];

    useEffect(() => {
        if (itemdetails) {
            fetchCategories();
            fetchVendors();
            fetchUnits(itemdetails?.unit_category);
        }
    }, [itemdetails]);

    const unitCategories = [
        { label: "Mass", value: "mass" },
        { label: "Volume", value: "volume" },
        { label: "Quantity", value: "quantity" }
    ];

    const [unit_category, setUnit_Category] = useState([]);

    const [unitOptions, setUnitOptions] = useState([]);
    const [unit, setUnit] = useState([]);
    const [usage_unit, setUsage_Unit] = useState([]);
    const [catalog, setCatalog] = useState([]);

    const fetchUnits = async (value) => {
        console.log("category", value);
        try {
            const response = await fetch(`${API_URL}/units/get?category=${value}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const formattedUnits = data.result.units.map((unit) => ({
                value: unit.id,
                label: unit.unit
            }));
            setUnitOptions(formattedUnits);
            console.log("formattedUnits", formattedUnits);

            // Find the selected unit and usage unit based on the ID stored in itemdetails
            const foundItemUnit = formattedUnits.find(item => item.label === itemdetails.product_units);
            setUnit(foundItemUnit);

            console.log("foundItemUnit", foundItemUnit);

            const foundUsageUnit = formattedUnits.find(item => item.label === itemdetails.usage_unit);
            setUsage_Unit(foundUsageUnit);

            // Set other related dropdowns like catalog
            const catalog = catalogOptions.find(item => item.label === itemdetails.product_catalog);
            setCatalog(catalog);

        } catch (error) {
            console.log(error.message);
        }
    };


    const [vendorOptions, setVendorOptions] = useState([]);
    const [vendor, setVendor] = useState([]);

    const fetchVendors = async () => {

        try {
            const response = await fetch(`${API_URL}/vendor`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // console.log(data);
            const formattedVendors = data.result.vendors.map((vendor) => ({
                value: vendor?.id,
                label: `${vendor?.first_name} ${vendor?.last_name}`
            }));
            setVendorOptions(formattedVendors);

            const foundvendor = data?.result?.vendors?.find(item => `${item?.first_name} ${item?.last_name}` === `${itemdetails?.vendors[0]?.first_name} ${itemdetails?.vendors[0]?.last_name}`);
            setVendor(foundvendor);

        } catch (error) {
            console.log(error.message);
        }
    };

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [category, setCategory] = useState([]);

    const fetchCategories = async () => {

        try {
            const response = await fetch(`${API_URL}/product/category/get/all`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // console.log(data);
            const formattedCategories = data.result.categories.map((category) => ({
                value: category.id,
                label: category.name,
            }));
            setCategoryOptions(formattedCategories);

            const foundItem = data.result.categories.find(item => item.name === itemdetails.product_category);
            setCategory(foundItem);

        } catch (error) {
            console.log(error.message);
        }
    };

    const handleUpdateItem = async (data, { resetForm }) => {
        console.log(data);

        const transformToNull = (value) => (value.length === 0 ? null : value);

        let Data = {};

        if (data.item_type === "SERVICE") {
            Data = {
                type: data.item_type,
                name: data.name,
                vendor_ids: data.vendor,
                description: data.service_description
            };
        } else if (data.unit_category == "quantity") {
            Data = {
                type: data.item_type,
                name: data.name,
                product_category: data.category,
                unit_category: data.unit_category,
                quantity_units: data.quantity_unit,// "packs of bread",
                product_units: data.units,
                // usage_unit: data.usage_unit,
                product_catalog: data.catalog,
                vendor_ids: data.vendor,
                image: cnic_back_img ? (cnic_back_img instanceof File ? response.data.url : cnic_back_img.preview) : null,
                stock_in_hand: transformToNull(data.opening_stock),
                opening_stock_rate: transformToNull(data.rate_per_unit),
                reorder_unit: transformToNull(data.re_order_level),
                inventory_description: transformToNull(data.description),
            };
        } else {
            Data = {
                type: data.item_type,
                name: data.name,
                product_category: data.category,
                quantity_units: data.quantity_unit,
                product_units: data.units,
                unit_category: data.unit_category,
                // usage_unit: data.usage_unit,
                product_catalog: data.catalog,
                vendor_ids: data.vendor,
                image: cnic_back_img ? (cnic_back_img instanceof File ? response.data.url : cnic_back_img.preview) : null,
                stock_in_hand: transformToNull(data.opening_stock),
                opening_stock_rate: transformToNull(data.rate_per_unit),
                reorder_unit: transformToNull(data.re_order_level),
                inventory_description: transformToNull(data.description),
            };
        }

        if (!cnic_back_img) {
            setIsLoading(true);
            setTimeout(() => {
                const InsertAPIURL = `${API_URL}/item/update?id=${itemId}`;
                const headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                };

                fetch(InsertAPIURL, {
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify(Data),
                })
                    .then(response => response.json())
                    .then(response => {
                        console.log(response);
                        setIsLoading(false);
                        if (response.success) {
                            toast.success(response.message);
                            navigate("/items");
                            resetForm();
                        } else {
                            toast.error(response.error.message);
                        }
                    })
                    .catch(error => {
                        setIsLoading(false);
                        toast.error(error, {
                            position: toast.POSITION.BOTTOM_CENTER,
                        });
                    });
            }, 3000);
        } else if (cnic_back_img instanceof File) {
            setIsLoading(true);
            setTimeout(() => {
                const formData = new FormData();
                formData.append("image", cnic_back_img);

                const InsertAPIURL = `${API_URL}/file/upload`;

                fetch(InsertAPIURL, {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => response.json())
                    .then(response => {
                        if (response.success) {
                            Data.image = response.data.url;

                            const InsertAPIURL = `${API_URL}/item/update?id=${itemId}`;
                            const headers = {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            };

                            fetch(InsertAPIURL, {
                                method: 'PUT',
                                headers: headers,
                                body: JSON.stringify(Data),
                            })
                                .then(response => response.json())
                                .then(response => {
                                    console.log(response);
                                    setIsLoading(false);
                                    if (response.success) {
                                        toast.success(response.message);
                                        navigate("/items");
                                        resetForm();
                                    } else {
                                        toast.error(response.error.message);
                                    }
                                })
                                .catch(error => {
                                    setIsLoading(false);
                                    toast.error(error, {
                                        position: toast.POSITION.BOTTOM_CENTER,
                                    });
                                });
                        }
                    })
                    .catch(error => {
                        setIsLoading(false);
                        toast.error(error, {
                            position: toast.POSITION.BOTTOM_CENTER,
                        });
                    });
            }, 3000);
        } else {
            setIsLoading(true);
            setTimeout(() => {
                Data.image = cnic_back_img.preview;

                const InsertAPIURL = `${API_URL}/item/update?id=${itemId}`;
                const headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                };

                fetch(InsertAPIURL, {
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify(Data),
                })
                    .then(response => response.json())
                    .then(response => {
                        console.log(response);
                        setIsLoading(false);
                        if (response.success) {
                            toast.success(response.message);
                            navigate("/items");
                            resetForm();
                        } else {
                            toast.error(response.error.message);
                        }
                    })
                    .catch(error => {
                        setIsLoading(false);
                        toast.error(error, {
                            position: toast.POSITION.BOTTOM_CENTER,
                        });
                    });
            }, 3000);
        }
    };


    const validationSchemaService = Yup.object().shape({
        item_type: Yup.string().required("Item type is required"),
        name: Yup.string().required("Name is required"),
        vendor: Yup.array()
            .of(Yup.string().required('Vendor is required'))
            .min(1, 'At least one vendor must be selected')
            .max(10, "Vendors can't be more than 10"),
        service_description: Yup.string().required("Description is required")
    });

    const baseProductValidationSchema = Yup.object().shape({
        item_type: Yup.string().required("Item type is required"),
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


    const getValidationSchema = (itemType, unitCategory) => {
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

    useEffect(() => {
        try {
            dispatch(getItemDetails({ id: itemId })).unwrap();
        } catch (error) {
            toast.error(error.message);
        }
    }, [itemId]);

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

    const paddingLeftRight = windowWidth < 600 ? 0 : 300;

    return (
        <Formik
            initialValues={{
                item_type: itemdetails?.type ?? "",
                category: category?.id ?? "",
                name: itemdetails?.name ?? "",
                unit_category: itemdetails?.unit_category ?? "",
                units: unit?.value || itemdetails?.product_units || "",  // Use .value to ensure the ID is passed
                // usage_unit: usage_unit?.value || itemdetails?.usage_unit || "",

                quantity_unit: itemdetails?.quantity_units ?? "",

                // usage_unit: usage_unit?.id ?? "",
                catalog: catalog?.value ?? "",
                // vendor: vendor?.id ?? "",
                vendor: itemdetails?.vendors?.map((vendor) => vendor?.id) || [],
                opening_stock: itemdetails?.stock_in_hand ?? "",
                rate_per_unit: itemdetails?.opening_stock_rate ?? "",
                re_order_level: itemdetails?.reorder_unit ?? "",
                description: itemdetails?.inventory_description ?? "",
                service_description: itemdetails?.description ?? ""
            }
            }
            enableReinitialize={true}
            validationSchema={Yup.lazy(values => getValidationSchema(values.item_type, values.unit_category))}
            onSubmit={handleUpdateItem}
        >
            {({ values, handleChange, handleSubmit, setFieldValue, isSubmitting }) => {
                const handleCustomChange = (name) => (event) => {
                    const { value } = event.target;
                    handleChange(event); // Update Formik state
                    setFieldValue(name, value); // Explicitly set Formik field value
                    if (name === 'unit_category') {
                        setUnit_Category(value); // Update local state
                        fetchUnits(value);
                    }
                };
                return (
                    <Form>
                        <div
                            className="flex justify-start items-center gap-2 pb-5 w-fit"
                        >
                            <FaChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />

                            <h1 className="modal-item-heading">{values.item_type === "SERVICE" ? "Service Details" : "Product Details"}</h1>
                        </div>

                        {values.item_type === "SERVICE" ?
                            <div className="pl-5 pr-5 container mx-auto">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                        <AppSelect
                                            label="Item Type"
                                            name="item_type"
                                            value={values.item_type}
                                            options={itemOptions}
                                            onChange={handleCustomChange("item_type")}
                                        />
                                        <ErrorMessage name="item_type" />
                                    </div>

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
                                </div>
                            </div>
                            :
                            <>
                                <div>
                                    <div className="modal-item-container">
                                        <div>
                                            <AppSelect
                                                label="Item Type"
                                                name="item_type"
                                                value={values.item_type}
                                                options={itemOptions}
                                                onChange={handleCustomChange("item_type")}
                                            />
                                            <ErrorMessage name="item_type" />
                                        </div>

                                        <div>
                                            <AppSelect
                                                label="Product Catalog"
                                                name="catalog"
                                                value={values.catalog}
                                                options={catalogOptions}
                                                onChange={handleCustomChange("catalog")}
                                            />
                                            <ErrorMessage name="catalog" />
                                        </div>

                                        <div>
                                            <AppInput
                                                type="text"
                                                label="Name"
                                                name="name"
                                                value={values.name}
                                                onChange={handleCustomChange("name")}
                                            />
                                            <ErrorMessage name="name" />
                                        </div>

                                        <div>
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
                                                <div>
                                                    <AppInput
                                                        type="text"
                                                        label="Quantity Unit"
                                                        name="quantity_unit"
                                                        value={values.quantity_unit}
                                                        onChange={handleCustomChange("quantity_unit")}
                                                    />
                                                    <ErrorMessage name="quantity_unit" />
                                                </div>

                                                <div>
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
                                                <div>
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
                                    </div>

                                    <div className="pl-5 pr-5 container mx-auto">
                                        <div className="grid grid-cols-12 gap-4">

                                            <div className="col-span-12 sm:col-span-4 md:col-span-4">
                                                <AppSelect
                                                    label="Category"
                                                    name="category"
                                                    value={values.category}
                                                    options={categoryOptions}
                                                    onChange={handleCustomChange("category")}
                                                />
                                                <ErrorMessage name="category" />
                                            </div>

                                            <div className="col-span-12 sm:col-span-8 md:col-span-8">
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
                                        </div>
                                    </div>

                                    <div className="modal-item-container">
                                        {itemdetails?.image == null || undefined ?
                                            <>
                                                {values.item_type !== "SERVICE" && (
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
                                            </>
                                            :
                                            <>

                                                {values.item_type !== "SERVICE" && (
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
                                            </>}
                                    </div>

                                    <h1 className="modal-item-heading">Inventory Tracking</h1>

                                    <div className="modal-item-container">
                                        <div>
                                            <AppInput
                                                type="number"
                                                label="Stock in hand"
                                                name="opening_stock"
                                                value={values.opening_stock}
                                                onChange={handleCustomChange("opening_stock")}
                                            />
                                            <ErrorMessage name="opening_stock" />
                                        </div>

                                        <div>
                                            <AppInput
                                                type="number"
                                                label="Stock rate per unit"
                                                name="rate_per_unit"
                                                value={values.rate_per_unit}
                                                onChange={handleCustomChange("rate_per_unit")}
                                            />
                                            <ErrorMessage name="rate_per_unit" />
                                        </div>

                                        <div>
                                            <AppInput
                                                type="number"
                                                label="Re-order Level"
                                                name="re_order_level"
                                                value={values.re_order_level}
                                                onChange={handleCustomChange("re_order_level")}
                                            />
                                            {/* <ErrorMessage name="re_order_level" /> */}
                                        </div>

                                        <div>
                                            <AppInput
                                                type="textarea"
                                                rows={4}
                                                label="Description"
                                                name="description"
                                                value={values.description}
                                                onChange={handleCustomChange("description")}
                                            />
                                            {/* <ErrorMessage name="description" /> */}
                                        </div>
                                    </div>
                                </div>
                            </>
                        }

                        <div className="flex-center">
                            <div className="my-5 w-52">
                                <Button
                                    onClick={isLoading ? "" : handleSubmit}
                                    title="Update"
                                    width={true}
                                    spinner={isLoading ? <Spinner size="sm" /> : null}
                                />
                            </div>
                        </div>
                    </Form>
                )
            }}
        </Formik >
    );
};

export default EditItem;
