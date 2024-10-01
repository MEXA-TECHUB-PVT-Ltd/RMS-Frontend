import React, { useCallback, useEffect, useState } from "react";
import Button from "../../components/form/Button";
import AppInput from "../../components/form/AppInput";
import Form from "../../components/form/Form";
import * as Yup from "yup";
import { currency, paymentTerm } from "../../utils/vendor";
import { useDispatch, useSelector } from "react-redux";
import { getCurrencies } from "../../app/features/currency/getCurrencySlice";
import { getPaymentTerms } from "../../app/features/paymentTerms/getPaymentTermSlice";
import ErrorMessage from "../../components/form/ErrorMessage";
import AppSelect from "../../components/form/AppSelect";
import { useDropzone } from "react-dropzone";
import { FaChevronLeft, FaCloudUploadAlt } from "react-icons/fa";
import { addVendor } from "../../app/features/Vendor/addVendorSlice";
import toast from "react-hot-toast";
import { Spinner } from "../../components/theme/Loader";
import { useNavigate, useSearchParams } from "react-router-dom";
import Card from "../../components/card/Card";
import Modal from "../../components/modal/Modal";

const API_URL = import.meta.env.VITE_API_URL;

const AddVendor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [cnic_front_img, setCnic_front_img] = useState(null);
  const [cnic_back_img, setCnic_back_img] = useState(null);

  const { currencies } = useSelector((state) => state?.getCurrency);
  const { payment_terms } = useSelector((state) => state?.getPaymentTerm);
  const { isLoading } = useSelector((state) => state.addVendor);
  const [searchParams] = useSearchParams();
  const vendorType = searchParams.get("vendor_type");

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

  const vendorOptions = [
    { value: "SUPPLIER", label: "SUPPLIER" },
    { value: "STORE", label: "STORE" },
  ];
  const providerOptions = [
    { value: "SERVICE", label: "SERVICE" },
    { value: "PRODUCTS", label: "PRODUCTS" },
  ];
  const currencyOptions = currency(currencies);
  const paymentTermOptions = paymentTerm(payment_terms);

  const handleAddVendor = async (data, { resetForm }) => {
    const formData = new FormData();

    const contact_person = {
      first_name: data?.cFirst_name,
      last_name: data?.cLast_name,
      email: data?.cEmail,
      phone_no: data?.cPhone_no,
      work_no: data?.cWork_no,
    };

    formData.append("v_type", vendorType);
    formData.append("provider_type", data?.provider_type);
    formData.append("first_name", data?.first_name || "");
    formData.append("last_name", data?.last_name || "");
    formData.append("company_name", data?.company_name || "");
    formData.append("vendor_display_name", data?.vendor_display_name);
    formData.append("email", data?.email);
    formData.append("work_no", data?.work_no || "");
    formData.append("phone_no", data?.phone_no);
    formData.append("address", data?.address || "");
    formData.append("fax_number", data?.fax_number || "");
    formData.append("state", data?.state || "");
    formData.append("zip_code", data?.zip_code || "");
    formData.append("country", data?.country || "");
    formData.append("city", data?.city || "");
    formData.append("shipping_address", data?.shipping_address || "");
    formData.append("payment_term_id", data?.payment_term_id);
    formData.append("currency_id", data?.currency_id);

    // Only append the document if it exists
    if (document) {
      formData.append("document", document);
    }

    // Only append cnic_front_img if it exists
    if (cnic_front_img) {
      formData.append("cnic_front_img", cnic_front_img);
    }

    // Only append cnic_back_img if it exists
    if (cnic_back_img) {
      formData.append("cnic_back_img", cnic_back_img);
    }

    // Append contact_person only if it has values
    if (contact_person.first_name || contact_person.last_name || contact_person.email || contact_person.phone_no || contact_person.work_no) {
      formData.append("contact_person", JSON.stringify(contact_person));
    }

    try {
      const { success, message } = await dispatch(addVendor(formData)).unwrap();

      if (success) {
        toast.success(message);
        resetForm();
        setDocument(null);
        setCnic_front_img(null);
        setCnic_back_img(null);
        setTimeout(() => {
          navigate("/vendors");
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    dispatch(getCurrencies());
    dispatch(getPaymentTerms());
  }, [dispatch]);

  // currency
  const [loading, setLoading] = useState(false);
  const [addCurrencyModal, setAddCurrencyModal] = useState(false);

  const handleAddCategory = async (data, { resetForm }) => {
    console.log(data);
    setLoading(true);
    setTimeout(() => {

      const InsertAPIURL = `${API_URL}/currency/create`;
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      let Data = {};

      Data = {
        currency: data.currency
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
            dispatch(getCurrencies());
            setAddCurrencyModal(false);
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

  // payment term
  const [addpaymenttermyModal, setAddpaymenttermyModal] = useState(false);

  const handleAddPaymentTerm = async (data, { resetForm }) => {
    console.log(data);
    setLoading(true);
    setTimeout(() => {

      const InsertAPIURL = `${API_URL}/payment-term/create`;
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      let Data = {};

      Data = {
        payment_term_name: data.payment_term
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
            dispatch(getPaymentTerms());
            setAddpaymenttermyModal(false);
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
    <div className="pl-7 pr-7 pt-7 pb-7">
      <Card >
        <Form
          initialValues={{
            // v_type: "",
            provider_type: "",
            first_name: "",
            last_name: "",
            company_name: "",
            vendor_display_name: "",
            email: "",
            phone_no: "",
            work_no: "",
            address: "",
            fax_number: "",
            state: "",
            zip_code: "",
            country: "",
            city: "",
            shipping_address: "",
            currency_id: "",
            payment_term_id: "",
            cFirst_name: "",
            cLast_name: "",
            cEmail: "",
            cPhone_no: "",
            cWork_no: "",
          }}
          validationSchema={Yup.object().shape({
            // v_type: Yup.string().required("vendor type is required"),
            provider_type: Yup.string().required("provider type is required"),
            company_name: Yup.string().nullable(),
            vendor_display_name: Yup.string().required(
              "vendor_display_name is required"
            ),
            first_name: Yup.string().required("first_name is required"),
            last_name: Yup.string().required("last_name is required"),
            email: Yup.string()
              .email("email must be a valid email address")
              .required("email is required"),
            phone_no: Yup.string().required("phone_no is required"),
            work_no: Yup.string().nullable(),
            country: Yup.string().nullable(),
            address: Yup.string().required("address is required"),
            city: Yup.string().nullable(),
            state: Yup.string().nullable(),
            zip_code: Yup.string().nullable(),
            fax_number: Yup.string().nullable(),
            shipping_address: Yup.string().nullable(),
            currency_id: Yup.string()
              .uuid("currency_id must be a valid UUID")
              .required("currency is required"),
            payment_term_id: Yup.string()
              .uuid("payment_term_id must be a valid UUID")
              .required("payment_term is required"),
            contact_person: Yup.string().nullable(),
          })}
          onSubmit={handleAddVendor}
        >
          {({ values, handleChange, handleSubmit }) => (
            <>

              <div className="pt-2 pb-2 container mx-auto">
                <div className="grid grid-cols-12 gap-4">

                  <div className="text-slate-950 col-span-12 sm:col-span-5 md:col-span-5">
                    <FaChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />
                  </div>

                  <div className="col-span-12 sm:col-span-7 md:col-span-7">
                    <h1 className="text-slate-950 font-bold text-xl text-left">Add Vendor</h1>
                  </div>

                  <div className="pb-5 col-span-12 sm:col-span-12 md:col-span-12">
                    <h1 className="text-slate-950 font-bold text-xl">Vendor Identification</h1>
                  </div>

                  <div className="col-span-12 sm:col-span-12 md:col-span-12">
                    <AppInput
                      type="text"
                      label="Vendor Display Name"
                      name={values["vendor_display_name"]}
                      value={values["vendor_display_name"]}
                      onChange={handleChange("vendor_display_name")}
                    />
                    <ErrorMessage name={"vendor_display_name"} />
                  </div>

                  <div className="pt-5 pb-5 col-span-12 sm:col-span-12 md:col-span-12">
                    <h1 className="text-slate-950 font-bold text-xl">Company Information</h1>
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="text"
                      label="Company Name"
                      name={values["company_name"]}
                      value={values["company_name"]}
                      onChange={handleChange("company_name")}
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppSelect
                      label="Provider Type"
                      name={values["provider_type"]}
                      value={values["provider_type"]}
                      options={providerOptions}
                      onChange={handleChange("provider_type")}
                    />
                    <ErrorMessage name={"provider_type"} />
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="text"
                      label="Country"
                      name={values["country"]}
                      value={values["country"]}
                      onChange={handleChange("country")}
                    />
                  </div>

                  <div className="pt-5 pb-5 col-span-12 sm:col-span-12 md:col-span-12">
                    <h1 className="text-slate-950 text-lg font-bold text-xl">Contact Information</h1>
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="text"
                      label="First Name"
                      name={values["first_name"]}
                      value={values["first_name"]}
                      onChange={handleChange("first_name")}
                    />
                    <ErrorMessage name={"first_name"} />
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="text"
                      label="Last Name"
                      name={values["last_name"]}
                      value={values["last_name"]}
                      onChange={handleChange("last_name")}
                    />
                    <ErrorMessage name={"last_name"} />
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="email"
                      label="Email Address"
                      name={values["email"]}
                      value={values["email"]}
                      onChange={handleChange("email")}
                    />
                    <ErrorMessage name={"email"} />
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="number"
                      label="Phone Number"
                      name={values["phone_no"]}
                      value={values["phone_no"]}
                      onChange={handleChange("phone_no")}
                    />
                    <ErrorMessage name={"phone_no"} />
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="text"
                      label="Address"
                      name={values["address"]}
                      value={values["address"]}
                      onChange={handleChange("address")}
                    />
                    <ErrorMessage name={"address"} />
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="text"
                      label="City"
                      name={values["city"]}
                      value={values["city"]}
                      onChange={handleChange("city")}
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="text"
                      label="State"
                      name={values["state"]}
                      value={values["state"]}
                      onChange={handleChange("state")}
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="text"
                      label="ZIP Code"
                      name={values["zip_code"]}
                      value={values["zip_code"]}
                      onChange={handleChange("zip_code")}
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="text"
                      label="Fax Number"
                      name={values["fax_number"]}
                      value={values["fax_number"]}
                      onChange={handleChange("fax_number")}
                    />
                  </div>

                  <div className="pt-5 pb-5 col-span-12 sm:col-span-12 md:col-span-12">
                    <h1 className="text-slate-950 text-lg font-bold text-xl">Additional Information</h1>
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <div className="w-full">
                      <label className="block text-lg font-normal text-light_text_1 dark:text-dark_text_1 mb-1 tracking-wide">
                        Currency
                      </label>

                      <div className={`flex items-center border rounded-md overflow-hidden focus-within:${theme.borderColor}`}>
                        <select
                          value={values.currency_id}
                          onChange={handleChange("currency_id")}
                          className="app-input flex-1"
                        >
                          <option value="">Currency</option>
                          {currencyOptions?.map((option) => (
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
                            setAddCurrencyModal(true)
                          }}
                        >
                          Add
                        </button>
                      </div>

                      <ErrorMessage name="currency_id" />
                    </div>
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <div className="w-full">
                      <label className="block text-lg font-normal text-light_text_1 dark:text-dark_text_1 mb-1 tracking-wide">
                        Payment Term
                      </label>

                      <div className={`flex items-center border rounded-md overflow-hidden focus-within:${theme.borderColor}`}>
                        <select
                          value={values.payment_term_id}
                          onChange={handleChange("payment_term_id")}
                          className="app-input flex-1"
                        >
                          <option value="">Payment Term</option>
                          {paymentTermOptions?.map((option) => (
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
                            setAddpaymenttermyModal(true)
                          }}
                        >
                          Add
                        </button>
                      </div>

                      <ErrorMessage name="payment_term_id" />
                    </div>
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="number"
                      label="Work Number"
                      name={values["work_no"]}
                      value={values["work_no"]}
                      onChange={handleChange("work_no")}
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-12 md:col-span-12">
                    <AppInput
                      type="textarea"
                      label="Shipping Address"
                      name={values["shipping_address"]}
                      value={values["shipping_address"]}
                      onChange={handleChange("shipping_address")}
                    />
                  </div>

                  <div className="pt-5 pb-5 col-span-12 sm:col-span-12 md:col-span-12">
                    <h1 className="text-slate-950 text-lg font-bold text-xl">Documents</h1>
                  </div>

                  <div {...documentRootProps()} className="drag-drop-container col-span-12 sm:col-span-4 md:col-span-4">
                    <input {...documentInputProps()} />
                    {isDocumentDrag ? (
                      <div className="drag-drop-subContainer">
                        Drop your document here
                      </div>
                    ) : (
                      <div>
                        {document ? (
                          <div className="text-center">
                            <p className="font-medium text-base mb-2">
                              {document.name}
                            </p>
                            <p className="text-sm text-gray-400">
                              No preview available
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="flex-center">
                              <FaCloudUploadAlt
                                size={50}
                                className="text-gray-700 dark:text-dark_text_1"
                              />
                            </p>
                            <p className="font-medium text-base mb-2">
                              Select or Drop your Document here
                            </p>
                            <p className="text-sm text-gray-400">
                              Accepted formats: PDF
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div {...cnicFrontRootProps()} className="drag-drop-container col-span-12 sm:col-span-4 md:col-span-4">
                    <input {...cnicInputProps()} />
                    {isCnicDrag ? (
                      <div className="drag-drop-subContainer">
                        Drop your Cnic front image here
                      </div>
                    ) : (
                      <div>
                        {cnic_front_img ? (
                          <img
                            src={cnic_front_img.preview}
                            onLoad={() => {
                              URL.revokeObjectURL(cnic_front_img.preview);
                            }}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <p className="flex-center">
                              <FaCloudUploadAlt
                                size={50}
                                className="text-gray-700 dark:text-dark_text_1"
                              />
                            </p>
                            <p className="font-medium text-sm mb-2">
                              Select or Drop your Cnic front image here
                            </p>
                            <p className="text-sm text-gray-400">
                              Accepted formats: JPG , PNG , JPEG
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div {...getRootProps()} className="drag-drop-container col-span-12 sm:col-span-4 md:col-span-4">
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <div className="drag-drop-subContainer">
                        Drop your Cnic back image here
                      </div>
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
                              <FaCloudUploadAlt
                                size={50}
                                className="text-gray-700 dark:text-dark_text_1"
                              />
                            </p>
                            <p className="font-medium text-sm mb-2">
                              Select or Drop your Cnic back image here
                            </p>
                            <p className="text-sm text-gray-400">
                              Accepted formats: JPG , PNG , JPEG
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-5 pb-5 col-span-12 sm:col-span-12 md:col-span-12">
                    <h1 className="text-slate-950 text-lg font-bold text-xl">Contact Person</h1>
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="text"
                      label="Fist Name"
                      name={values["cFirst_name"]}
                      value={values["cFirst_name"]}
                      onChange={handleChange("cFirst_name")}
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="text"
                      label="Last Name"
                      name={values["cLast_name"]}
                      value={values["cLast_name"]}
                      onChange={handleChange("cLast_name")}
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="email"
                      label="Email Address"
                      name={values["cEmail"]}
                      value={values["cEmail"]}
                      onChange={handleChange("cEmail")}
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="number"
                      label="Phone Number"
                      name={values["cPhon_no"]}
                      value={values["cPhone_no"]}
                      onChange={handleChange("cPhone_no")}
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="number"
                      label="Work Number"
                      name={values["cWork_no"]}
                      value={values["cWork_no"]}
                      onChange={handleChange("cWork_no")}
                    />
                  </div>

                  <div className="flex-center pt-10 col-span-12 sm:col-span-12 md:col-span-12">
                    <div className="sticky bottom-0 w-full">
                      <Button
                        onClick={isLoading ? "" : handleSubmit}
                        title={"Add"}
                        width={true}
                        spinner={isLoading ? <Spinner size="sm" /> : null}
                      />
                    </div>
                  </div>

                  {/* Document Input */}
                  {/* <div className="col-span-12 sm:col-span-12 md:col-span-12">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="document">
                  Document
                </label>
                <input
                  id="document"
                  type="file"
                  accept=".pdf"
                  onChange={handleDocumentChange}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                />
                {document && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-300 rounded h-2 relative">
                      <div className="bg-green-500 h-2 rounded" style={{ width: '100%' }}></div>
                    </div>
                    <p className="text-sm mt-1">Document: {document.name}</p>
                  </div>
                )}
              </div> */}

                  {/* CNIC Front Input */}
                  {/* <div className="col-span-12 sm:col-span-12 md:col-span-12">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cnic-front">
                  CNIC Front
                </label>
                <input
                  id="cnic-front"
                  type="file"
                  accept=".jpg,.png,.jpeg"
                  onChange={handleCnicFrontChange}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                />
                {cnicFront && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-300 rounded h-2 relative">
                      <div className="bg-green-500 h-2 rounded" style={{ width: '100%' }}></div>
                    </div>
                    <p className="text-sm mt-1">CNIC Front: {cnicFront.name}</p>
                  </div>
                )}
              </div> */}

                  {/* CNIC Back Input */}
                  {/* <div className="col-span-12 sm:col-span-12 md:col-span-12">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cnic-back">
                  CNIC Back
                </label>
                <input
                  id="cnic-back"
                  type="file"
                  accept=".jpg,.png,.jpeg"
                  onChange={handleCnicBackChange}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                />
                {cnicBack && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-300 rounded h-2 relative">
                      <div className="bg-green-500 h-2 rounded" style={{ width: '100%' }}></div>
                    </div>
                    <p className="text-sm mt-1">CNIC Back: {cnicBack.name}</p>
                  </div>
                )}
              </div> */}

                </div>
              </div>
            </>
          )}
        </Form>
      </Card>

      {/* currency */}
      <Modal
        title={"Add Currency"}
        size="sm"
        isOpen={addCurrencyModal}
        onClose={() => setAddCurrencyModal(false)}
      >
        <Form
          initialValues={{
            currency: "",
          }}
          validationSchema={Yup.object().shape({
            currency: Yup.string().required("Currency is required"),

          })}
          onSubmit={handleAddCategory}
        >
          {({ values, handleChange, handleSubmit }) => (
            <>

              <div className="p-2 container mx-auto">
                <div className="grid grid-cols-12 gap-4">

                  <div className="pb-5 col-span-12 sm:col-span-12 md:col-span-12">
                    <AppInput
                      type="text"
                      label="Currency"
                      name={values["currency"]}
                      value={values["currency"]}
                      onChange={handleChange("currency")}
                    />
                    <ErrorMessage name={"currency"} />
                  </div>

                  <div className="flex-center col-span-12 sm:col-span-12 md:col-span-12">
                    <div className="sticky bottom-0 w-full">
                      <Button
                        onClick={loading ? "" : handleSubmit}
                        title={"Add"}
                        width={true}
                        spinner={loading ? <Spinner size="sm" /> : null}
                      />
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}
        </Form>

      </Modal>

      {/* paymentTerm */}
      <Modal
        title={"Add Payment Term"}
        size="sm"
        isOpen={addpaymenttermyModal}
        onClose={() => setAddpaymenttermyModal(false)}
      >
        <Form
          initialValues={{
            payment_term: "",
          }}
          validationSchema={Yup.object().shape({
            payment_term: Yup.string().required("Payment Term is required"),

          })}
          onSubmit={handleAddPaymentTerm}
        >
          {({ values, handleChange, handleSubmit }) => (
            <>

              <div className="p-2 container mx-auto">
                <div className="grid grid-cols-12 gap-4">

                  <div className="pb-5 col-span-12 sm:col-span-12 md:col-span-12">
                    <AppInput
                      type="text"
                      label="Payment Term"
                      name={values["payment_term"]}
                      value={values["payment_term"]}
                      onChange={handleChange("payment_term")}
                    />
                    <ErrorMessage name={"payment_term"} />
                  </div>

                  <div className="flex-center col-span-12 sm:col-span-12 md:col-span-12">
                    <div className="sticky bottom-0 w-full">
                      <Button
                        onClick={loading ? "" : handleSubmit}
                        title={"Add"}
                        width={true}
                        spinner={loading ? <Spinner size="sm" /> : null}
                      />
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}
        </Form>

      </Modal>

    </div>
  );
};

export default AddVendor;
