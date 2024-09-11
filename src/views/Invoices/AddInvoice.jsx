import React, { useCallback, useEffect, useState } from "react";
import Button from "../../components/form/Button";
import AppInput from "../../components/form/AppInput";
import { Formik, Form } from 'formik';
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
import { useNavigate } from "react-router-dom";

import { getItems } from "../../app/features/Item/getItemSlice";
import ErrorMessage from "../../components/form/ErrorMessage";
import AppMultiSelect from "../../components/form/AppMultiSelect";

const API_URL = import.meta.env.VITE_API_URL;

const AddInvoice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchTax();
        fetchPaymentTerms();
        fetchPRs();
    }, []);

    const [PRsOptions, setPRsOptions] = useState([]);
    const fetchPRs = async (value) => {
        try {
            const response = await fetch(`${API_URL}/purchase/receives/get/all?`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            const filteredPRs = data.result.purchase_receives.filter(order => order.pr_invoice === false || order.pr_invoice === "false");
            console.log("filteredPRs", filteredPRs)
            const formattedPRs = filteredPRs.map((pr) => ({
                value: pr.id,
                label: pr.purchase_received_number
            }));
            setPRsOptions(formattedPRs);
        } catch (error) {
            console.log(error.message);
        }
    };

    const [paymettermsOptions, setPaymettermsOptions] = useState([]);
    const fetchPaymentTerms = async () => {

        try {
            const response = await fetch(`${API_URL}/payment-term`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            const formattedPayments = data.result.map((payment) => ({
                value: payment.id,
                label: payment.payment_term_name
            }));
            setPaymettermsOptions(formattedPayments);
        } catch (error) {
            console.log(error.message);
        }
    };

    const [taxOptions, setTaxOptions] = useState([]);
    const fetchTax = async () => {

        try {
            const response = await fetch(`${API_URL}/tax/get/list`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            const formattedTaxs = data.result.map((tax) => ({
                value: tax.id,
                label: tax.tax_value,
            }));
            setTaxOptions(formattedTaxs);
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleGenerateInvoice = async (data, { resetForm }) => {
        console.log(data);

        setIsLoading(true);
        setTimeout(() => {
            const InsertAPIURL = `${API_URL}/invoice/create`;
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };

            const transformToNull = (value) => (value.length === 0 ? null : value);

            let Data = {};

            Data = {
                purchase_receive_ids: data.purchase_receives, // Array of UUIDs
                bill_date: data.bill_date,
                tax_id: data.tax,
                payment_term_id: data.payment_term,
                due_date: transformToNull(data.due_date),
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
                        navigate("/invoices");
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
    };

    const validationSchema = Yup.object({
        purchase_receives: Yup.array()
            .of(Yup.string().required('Purcahse receive is required'))
            .min(1, 'At least one purchase receive must be selected')
            .max(10, "Purchase receives can't be more than 10"),
        tax: Yup.string().required('Tax is required'),
        payment_term: Yup.string().required('Payment term is required'),
        bill_date: Yup.string().required('Bill date is required'),
        due_date: Yup.string().nullable()
    });

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
            <Formik
                initialValues={{
                    tax: "",
                    payment_term: "",
                    bill_date: "",
                    due_date: "",
                    purchase_receives: [],
                }}
                validationSchema={validationSchema}
                onSubmit={handleGenerateInvoice}
            >
                {({ values, handleChange, handleSubmit, setFieldValue, isSubmitting }) => {
                    // const handleCustomChange = (name) => (event) => {
                    //     const { value } = event.target;
                    //     handleChange(event); // Update Formik state
                    //     setFieldValue(name, value); // Explicitly set Formik field value
                    //     if (name === 'unit_category') {
                    //         setCategory(value); // Update local state
                    //         fetchPRs(value);
                    //     }
                    // };
                    return (
                        <Form>
                            <div
                                className="flex justify-start items-center gap-2 pb-5 w-fit"
                            >
                                <FaChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />

                                <h1 className="modal-item-heading">Generate Invoice</h1>
                            </div>

                            <div className="pl-5 pr-5 container mx-auto">
                                <div className="grid grid-cols-12 gap-4">

                                    <div className="col-span-12 sm:col-span-8 md:col-span-8" >
                                        <AppMultiSelect
                                            label="Purchase Receives"
                                            name="purchase_receives"
                                            value={values.purchase_receives} // Should be an array for isMulti
                                            options={PRsOptions}
                                            onChange={(value) => setFieldValue('purchase_receives', value)}
                                            isMulti={true} // Enable multi-select
                                        />
                                        <ErrorMessage name="purchase_receives" />
                                    </div>

                                    <div className="col-span-12 sm:col-span-4 md:col-span-4">
                                        <AppSelect
                                            label="Tax"
                                            name="tax"
                                            value={values.tax}
                                            options={taxOptions}
                                            onChange={handleChange("tax")}
                                        />
                                        <ErrorMessage name="tax" />
                                    </div>

                                    <div className="col-span-12 sm:col-span-6 md:col-span-6" >
                                        <AppSelect
                                            label="Payment Term"
                                            name="payment_term"
                                            value={values.payment_term}
                                            options={paymettermsOptions}
                                            onChange={handleChange("payment_term")}
                                        />
                                        <ErrorMessage name="payment_term" />
                                    </div>

                                    <div className="col-span-12 sm:col-span-6 md:col-span-6" >
                                        <AppInput
                                            type="date"
                                            label="Bill Date"
                                            name="bill_date"
                                            value={values.bill_date}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="bill_date" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>

                                    <div className="col-span-12 sm:col-span-6 md:col-span-6" >
                                        <AppInput
                                            type="date"
                                            label="Due Date"
                                            name="due_date"
                                            value={values.due_date}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="due_date" component="div" style={{ color: "red", fontSize: "13px" }} />
                                    </div>

                                </div>
                            </div>

                            <div className="mt-20">
                                <div className="flex-center">
                                    <div className="my-5 w-52">
                                        <Button
                                            onClick={isLoading ? "" : handleSubmit}
                                            title="Generate"
                                            width={true}
                                            spinner={isLoading ? <Spinner size="sm" /> : null}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </>
    );
};

export default AddInvoice;
