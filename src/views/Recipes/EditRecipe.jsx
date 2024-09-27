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
import { getRecipeDetails } from "../../app/features/Recipes/getRecipeSlice";
import toast from "react-hot-toast";
import { Spinner } from "../../components/theme/Loader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import { getItems } from "../../app/features/Item/getItemSlice";
import ErrorMessage from "../../components/form/ErrorMessage";
import AppMultiSelect from "../../components/form/AppMultiSelect";
import imagePlaceholder from "../../assets/item_image.png";
import Modal from "../../components/modal/Modal";

const API_URL = import.meta.env.VITE_API_URL;

const EditRecipe = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const recipeId = searchParams.get("recipe_id");

    const { recipedetails, error } = useSelector((state) => state.getRecipe);
    const [isLoading, setIsLoading] = useState(false);

    console.log("recipedetails", recipedetails);

    const goBack = () => {
        window.history.back();
    };

    const [cnic_back_img, setCnic_back_img] = useState(null);

    useEffect(() => {
        if (recipedetails?.image) {
            setCnic_back_img({
                preview: recipedetails.image
            });
        }
    }, [recipedetails]);

    const theme = useSelector((state) => state.theme);

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

    const difiicultyLevelOptions = [
        { value: "HIGH", label: "HIGH" },
        { value: "MEDIUM", label: "MEDIUM" },
        { value: "LOW", label: "LOW" }
    ];

    useEffect(() => {
        try {
            dispatch(getRecipeDetails({ id: recipeId })).unwrap();
        } catch (error) {
            toast.error(error.message);
        }
    }, [recipeId]);

    const unitOptions = [
        { label: 'g', value: '1b8dd607-41df-4380-bed6-55f33a575a43' },
        // { label: 'Kilogram (kg)', value: 'kg' },
        // { label: 'Milligram (mg)', value: 'mg' },
        // { label: 'Liter (L)', value: 'L' },
        // { label: 'Milliliter (ml)', value: 'ml' }
    ];

    const [unit, setUnit] = useState("");
    const fetchunitCategory = async (unit) => {
        try {
            const response = await fetch(`${API_URL}/units/get?category=${unit}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            // Format units for select options
            const formattedUnits = data.result.units.map((unit) => ({
                value: unit.id,
                label: unit.unit
            }));

            return formattedUnits;  // Return formatted unit options
        } catch (error) {
            console.log(error.message);
            return [];
        }
    };

    const [itemdetails, setItemdetails] = useState([]);
    const fetchItemByID = async (item_ids) => {
        try {
            const promises = item_ids.map(async (id) => {
                const response = await fetch(`${API_URL}/item/specific?id=${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // Fetch unit options based on unit category
                const unitOptions = await fetchunitCategory(data?.result?.unit_category);

                return {
                    ...data.result,
                    unitOptions // Store unit options with the item details
                };
            });

            const itemsDetailsArray = await Promise.all(promises);
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
    const [category, setCategory] = useState("");
    const [categoryOptions, setCategoryOptions] = useState([]);
    const fetchCategories = async () => {

        try {
            const response = await fetch(`${API_URL}/category/get/list`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            const formattedCategories = data.result.categories.map((category) => ({
                value: category.id,
                label: category.category_name,
            }));

            setCategoryOptions(formattedCategories);

            const foundCategoryName = formattedCategories.find(item => item?.label === recipedetails?.category_name);
            setCategory(foundCategoryName);
            console.log("foundCategoryName", foundCategoryName);

        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchVendors();
        fetchItems();
        if (recipedetails && recipedetails?.items) {
            const itemIds = recipedetails.items.map((item) => item?.item_id);
            fetchItemByID(itemIds);
        }
    }, [recipeId, recipedetails]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onCnicBackDrop,
        multiple: false,
    });

    const image = () => {
        console.log(cnic_back_img)
    }

    const [isChecked, setIsChecked] = useState(recipedetails?.signature);

    // Handle the change event of the checkbox
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleEditRecipe = async (data) => {
        console.log(data, isChecked);

        const transformToNull = (value) => (value.length === 0 ? null : value);

        let Data = {};

        if (!cnic_back_img) {
            setIsLoading(true);
            setTimeout(() => {
                const InsertAPIURL = `${API_URL}/recipe/update`;
                const headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                };

                Data = {
                    recipe_id: recipeId,
                    recipe_name: data.recipe_name,
                    category: data.category,
                    difficulty_level: data.difficulty_level,
                    added_by: data.added_by,
                    price: data.price,
                    cooking_time: data.cooking_time,
                    nutritional_info: data.nutritional_info,
                    allergen_info: transformToNull(data.allergen_info),
                    presentation_instructions: transformToNull(data.presentation_instructions), //optional
                    equipment_needed: transformToNull(data.equipment_needed), //optional
                    side_order: transformToNull(data.side_order), //optional 
                    preparation_instructions: transformToNull(data.preparation_instructions),  // optional
                    serving_details: data.serving_details,
                    signature: isChecked,
                    // image: cnic_back_img ? (cnic_back_img instanceof File ? response.data.url : cnic_back_img.preview) : null,
                    items: data.items
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
                            navigate("/recipes");
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

                            const InsertAPIURL = `${API_URL}/recipe/update`;
                            const headers = {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            };

                            Data = {
                                recipe_id: recipeId,
                                recipe_name: data.recipe_name,
                                category: data.category,
                                difficulty_level: data.difficulty_level,
                                added_by: data.added_by,
                                price: data.price,
                                cooking_time: data.cooking_time,
                                nutritional_info: data.nutritional_info,
                                allergen_info: transformToNull(data.allergen_info),
                                presentation_instructions: transformToNull(data.presentation_instructions), //optional
                                equipment_needed: transformToNull(data.equipment_needed), //optional
                                side_order: transformToNull(data.side_order), //optional 
                                preparation_instructions: transformToNull(data.preparation_instructions),  // optional
                                serving_details: data.serving_details,
                                signature: isChecked,
                                image: cnic_back_img ? (cnic_back_img instanceof File ? response.data.url : cnic_back_img.preview) : null,
                                items: data.items
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
                                        navigate("/recipes");
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

                const InsertAPIURL = `${API_URL}/recipe/update`;
                const headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                };

                Data = {
                    recipe_id: recipeId,
                    recipe_name: data.recipe_name,
                    category: data.category,
                    difficulty_level: data.difficulty_level,
                    added_by: data.added_by,
                    price: data.price,
                    cooking_time: data.cooking_time,
                    nutritional_info: data.nutritional_info,
                    allergen_info: transformToNull(data.allergen_info),
                    presentation_instructions: transformToNull(data.presentation_instructions), //optional
                    equipment_needed: transformToNull(data.equipment_needed), //optional
                    side_order: transformToNull(data.side_order), //optional 
                    preparation_instructions: transformToNull(data.preparation_instructions),  // optional
                    serving_details: data.serving_details,
                    signature: isChecked,
                    // image: cnic_back_img ? (cnic_back_img instanceof File ? response.data.url : cnic_back_img.preview) : null,
                    items: data.items
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
                            navigate("/recipes");
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

    // Function to validate items
    const [itemErrors, setItemErrors] = useState({});

    const validationSchemaProduct = Yup.object({
        recipe_name: Yup.string().required('Recipe name is required'),
        category: Yup.string().required('Category is required'),
        difficulty_level: Yup.string().required('Difficulty level is required'),
        added_by: Yup.string().required('Added by is required'),
        price: Yup.string().required('Price is required'),
        cooking_time: Yup.string().required('Cooking time is required'),
        nutritional_info: Yup.string().required('Nutritional information is required'),
        allergen_info: Yup.string().nullable(),
        presentation_instructions: Yup.string().nullable(),
        equipment_needed: Yup.string().nullable(),
        side_order: Yup.string().nullable(),
        preparation_instructions: Yup.string().nullable(),
        serving_details: Yup.string().required('Serving details is required'),
        items: Yup.array()
            .of(
                Yup.object().shape({
                    quantity: Yup.number()
                        .required('Quantity is required')
                        .typeError('Quantity must be a number'),
                    measuring_unit: Yup.string()
                        .required('Measuring Unit is required')
                })
            )
            .min(1, 'At least one item is required'),
        // vendor: Yup.array().of(Yup.string()).required('At least one vendor is required'),
    });

    const validateItems = (items) => {
        const errors = {};
        items.forEach((item, index) => {
            if (!item.quantity) errors[`items[${index}].quantity`] = 'Quantity is required';
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

    const [addCategoryModal, setAddCategoryModal] = useState(false);

    const validationSchemaCategory = Yup.object({
        category_name: Yup.string().required('Category name is required')
    });

    const handleAddCategory = async (data) => {
        console.log(data);
        setIsLoading(true);
        setTimeout(() => {

            const InsertAPIURL = `${API_URL}/category/create`;
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };

            let Data = {};

            Data = {
                category_name: data.category_name
            };

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
                        fetchCategories();
                        setAddCategoryModal(false);
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
    }

    return (
        <>
            <div
                className="flex justify-start items-center gap-2 pb-5 w-fit"
            >
                <FaChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />

                <h1 className="modal-item-heading">Edit Recipe</h1>
            </div>

            <Formik
                initialValues={{
                    recipe_name: recipedetails?.recipe_name ?? "",
                    category: category?.value || recipedetails?.category_name || "",
                    difficulty_level: recipedetails?.difficulty_level ?? "",
                    added_by: recipedetails?.added_by ?? "",
                    price: recipedetails?.price ?? "",
                    cooking_time: recipedetails?.cooking_time ?? "",
                    nutritional_info: recipedetails?.nutritional_info ?? "",

                    allergen_info: recipedetails?.allergen_info ?? "",
                    presentation_instructions: recipedetails?.presentation_instructions ?? "",
                    equipment_needed: recipedetails?.equipment_needed ?? "",
                    side_order: recipedetails?.side_order ?? "",
                    preparation_instructions: recipedetails?.preparation_instructions ?? "",
                    serving_details: recipedetails?.serving_details ?? "",

                    items: recipedetails?.items?.map((item) => {
                        const itemDetail = itemdetails.find(detail => detail.id === item.item_id);
                        console.log("Prefilling measuring_unit", {
                            unit_category: itemDetail?.unit_category,
                            unitOptions: itemDetail?.unitOptions,
                            currentUnit: item?.measuring_unit,
                            matchedOption: itemDetail?.unitOptions.find(option => option.label === item?.measuring_unit)?.value
                        });
                        return {
                            item_id: item?.item_id ?? "",
                            quantity: item?.quantity ?? "",
                            measuring_unit: itemDetail?.unit_category === 'quantity'
                                ? item?.measuring_unit // Direct number for 'quantity' category
                                : itemDetail?.unitOptions.find(option => option.label === item?.measuring_unit)?.value || '', // For 'mass' or 'volume'
                            name: item?.name ?? ""
                        };
                    }) ?? [],
                    // vendor: [],
                }}
                enableReinitialize={true}
                validationSchema={validationSchemaProduct}
                onSubmit={(values, { setErrors }) => {
                    const itemErrors = validateItems(values.items);

                    setItemErrors(itemErrors);

                    if (Object.keys(itemErrors).length > 0) {
                        setErrors(itemErrors);
                        return;
                    }
                    handleEditRecipe(values);
                }}
            >
                {({ values, handleChange, handleSubmit, setFieldValue, validateField, errors, touched }) => {
                    const handleItemFieldChange = (index, field, value) => {
                        setFieldValue(`items[${index}].${field}`, value);
                        setItemErrors((prevErrors) => {
                            const newErrors = { ...prevErrors };
                            if (value) {
                                delete newErrors[`items[${index}].${field}`];
                            }
                            return newErrors;
                        });
                        validateField(`items[${index}].${field}`);
                    };

                    // Handle selected items
                    const handleItemSelection = (selectedItemIds) => {
                        const updatedItems = selectedItemIds.map((id) => {
                            const existingItem = values.items.find((item) => item.item_id === id);
                            return existingItem || { item_id: id, quantity: '', measuring_unit: '' }; // Ensure measuring_unit is set
                        });

                        setFieldValue('items', updatedItems);
                        fetchItemByID(updatedItems.map((item) => (item.item_id)));
                    };
                    return (
                        <Form>
                            <div>
                                <div className="modal-item-container">
                                    <div>
                                        <AppInput
                                            type="text"
                                            label="Recipe Name"
                                            name="recipe_name"
                                            value={values.recipe_name}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="recipe_name" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>

                                    <div>
                                        <div className="w-full">
                                            <label className="block text-sm font-normal text-light_text_1 dark:text-dark_text_1 mb-1 tracking-wide">
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
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>

                                                {/* Add Button */}
                                                <button
                                                    type="button"
                                                    className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
                                                    onClick={() => {
                                                        // Handle the Add button click here
                                                        setAddCategoryModal(true)
                                                    }}
                                                >
                                                    Add
                                                </button>
                                            </div>

                                            <ErrorMessage name="category" />
                                        </div>
                                    </div>

                                    <div>
                                        <AppSelect
                                            label="Difficulty Level"
                                            name="difficulty_level"
                                            value={values.difficulty_level}
                                            options={difiicultyLevelOptions}
                                            onChange={handleChange("difficulty_level")}
                                        />
                                        <ErrorMessage name="difficulty_level" />
                                    </div>

                                    <div>
                                        <AppInput
                                            type="text"
                                            label="Added By"
                                            name="added_by"
                                            value={values.added_by}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="added_by" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>
                                    <div>
                                        <AppInput
                                            type="number"
                                            label="Price"
                                            name="price"
                                            value={values.price}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="price" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>

                                    <div>
                                        <AppInput
                                            type="text"
                                            label="Cooking Time"
                                            name="cooking_time"
                                            value={values.cooking_time}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="cooking_time" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>

                                    <div>
                                        <AppInput
                                            type="text"
                                            label="Serving Details"
                                            name="serving_details"
                                            value={values.serving_details}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="serving_details" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>

                                    <div>
                                        <AppInput
                                            type="textarea"
                                            label="Nutritional Information"
                                            name="nutritional_info"
                                            value={values.nutritional_info}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="nutritional_info" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>

                                    <div>
                                        <AppInput
                                            type="textarea"
                                            label="Allergen Information"
                                            name="allergen_info"
                                            value={values.allergen_info}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="allergen_info" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>

                                    <div>
                                        <AppInput
                                            type="textarea"
                                            label="Presentation Instructions"
                                            name="presentation_instructions"
                                            value={values.presentation_instructions}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="presentation_instructions" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>

                                    <div>
                                        <AppInput
                                            type="textarea"
                                            label="Equipment Needed"
                                            name="equipment_needed"
                                            value={values.equipment_needed}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="equipment_needed" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>

                                    <div>
                                        <AppInput
                                            type="textarea"
                                            label="Side Order"
                                            name="side_order"
                                            value={values.side_order}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="side_order" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>

                                </div>

                                <div className="pl-5 pr-5 container mx-auto">
                                    <div className="grid grid-cols-12 gap-4">

                                        <div className="col-span-12 sm:col-span-4 md:col-span-4">
                                            <AppInput
                                                type="textarea"
                                                label="Preparation Instructions"
                                                name="preparation_instructions"
                                                value={values.preparation_instructions}
                                                onChange={handleChange}
                                            />
                                            <ErrorMessage name="preparation_instructions" component="div" style={{ color: "red", fontSize: "13px" }} />
                                        </div>

                                        <div className="mt-7 col-span-12 sm:col-span-1 md:col-span-1">
                                            <input
                                                id="signature"
                                                type="checkbox"
                                                checked={isChecked} // Bind the state to the checkbox
                                                onChange={handleCheckboxChange} // Handle changes
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                            />
                                            <label htmlFor="signature" className="ml-2 text-sm font-medium text-gray-900">
                                                Signature
                                            </label>
                                        </div>

                                        <div className="col-span-12 sm:col-span-7 md:col-span-7" >
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

                                    </div>
                                </div>

                                <div className="modal-item-container">

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

                                </div>

                                <div className="grid grid-cols-12 gap-4">
                                    {values.items.map((item, index) => {
                                        const itemDetail = itemdetails.find(detail => detail.id === item.item_id);

                                        return (
                                            <div
                                                key={index}
                                                className="col-span-12 sm:col-span-6 p-3 relative"
                                            >
                                                <div className="grid grid-cols-6 gap-4 relative border border-gray-300 p-4 rounded-lg">
                                                    {/* Item Details */}
                                                    <div className="col-span-2 flex items-center">
                                                        <img
                                                            src={itemDetail?.image || imagePlaceholder}
                                                            alt="item"
                                                            className="border border-gray-400 rounded-lg w-20 h-20 mr-2"
                                                        />
                                                        <div>
                                                            <div className="font-bold text-lg">{itemDetail?.name}</div>
                                                            <div className="font-bold text-lg">{itemDetail?.type}</div>
                                                        </div>
                                                    </div>

                                                    {/* Quantity Field */}
                                                    <div className="col-span-2">
                                                        <AppInput
                                                            type="number"
                                                            label="Quantity"
                                                            name={`items[${index}].quantity`}
                                                            value={item.quantity}
                                                            onChange={(e) => setFieldValue(`items[${index}].quantity`, e.target.value)}
                                                        />
                                                        {errors.items?.[index]?.quantity && touched.items?.[index]?.quantity && (
                                                            <div className="text-red-500">{errors.items[index].quantity}</div>
                                                        )}
                                                    </div>

                                                    {/* Measuring Unit Field */}
                                                    <div className="col-span-2">
                                                        {itemDetail?.unit_category === 'quantity' ? (
                                                            <AppInput
                                                                type="number"
                                                                label="Measuring Unit"
                                                                name={`items[${index}].measuring_unit`}
                                                                value={item.measuring_unit}
                                                                onChange={(e) => setFieldValue(`items[${index}].measuring_unit`, e.target.value)}
                                                            />
                                                        ) : (
                                                            <AppSelect
                                                                label="Measuring Unit"
                                                                name={`items[${index}].measuring_unit`}
                                                                value={item.measuring_unit}
                                                                options={itemDetail?.unitOptions || []}
                                                                onChange={(e) => setFieldValue(`items[${index}].measuring_unit`, e.target.value)}
                                                            />
                                                        )}
                                                        {errors.items?.[index]?.measuring_unit && touched.items?.[index]?.measuring_unit && (
                                                            <div className="text-red-500">{errors.items[index].measuring_unit}</div>
                                                        )}
                                                    </div>

                                                    {/* Cross Icon */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updatedItems = values.items.filter((_, idx) => idx !== index);
                                                            setFieldValue('items', updatedItems);
                                                            setItemdetails(prevDetails => prevDetails.filter(detail => detail.vendor_id !== item.vendor_id));
                                                        }}
                                                        className="absolute top-0 right-0 m-1 border border-gray-500 w-8 rounded text-red-500 hover:bg-red-500 hover:text-white transition"
                                                    >
                                                        &#10005;
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

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
                    validationSchema={validationSchemaCategory}
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
                                        spinner={isLoading ? <Spinner size="sm" /> : null}
                                    />
                                </div>
                            </Form>
                        );
                    }}
                </Formik>

            </Modal>

        </>
    );
};

export default EditRecipe;
