import React, { useCallback, useEffect, useState } from "react";
import Button from "../../components/form/Button";
import AppInput from "../../components/form/AppInput";
import Form from "../../components/form/Form";
import { currency, paymentTerm } from "../../utils/vendor";
import { useDispatch, useSelector } from "react-redux";
import { getCurrencies } from "../../app/features/currency/getCurrencySlice";
import { getPaymentTerms } from "../../app/features/paymentTerms/getPaymentTermSlice";
import ErrorMessage from "../../components/form/ErrorMessage";
import AppSelect from "../../components/form/AppSelect";
import { useDropzone } from "react-dropzone";
import { FaChevronLeft, FaCloudUploadAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { Spinner } from "../../components/theme/Loader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getVendorDetails } from "../../app/features/Vendor/getVendorSlice";
import { updateVendor } from "../../app/features/Vendor/updateVendorSlice";
import * as Yup from "yup";
import Card from "../../components/card/Card";

const EditVendor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currencies } = useSelector((state) => state?.getCurrency);
  const { payment_terms } = useSelector((state) => state?.getPaymentTerm);
  const { isLoading } = useSelector((state) => state.updateVendor);
  const { vendor, isLoading: vendorLoading } = useSelector(
    (state) => state.getVendor
  );

  const [searchParams] = useSearchParams();
  const id = searchParams.get("v_id");

  const [document, setDocument] = useState(null);
  const [cnic_front_img, setCnic_front_img] = useState(null);
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

  const handleEditVendor = async (data, { resetForm }) => {
    const formData = new FormData();

    const contact_person = {
      first_name: data?.cFirst_name,
      last_name: data?.cLast_name,
      email: data?.cEmail,
      phone_no: data?.cPhone_no,
      work_no: data?.cWork_no,
    };
    formData.append("id", id);
    // formData.append("v_type", data?.v_type);
    formData.append("provider_type", data?.provider_type);
    formData.append("first_name", data?.first_name);
    formData.append("last_name", data?.last_name);
    formData.append("company_name", data?.company_name);
    formData.append("vendor_display_name", data?.vendor_display_name);
    formData.append("email", data?.email);
    formData.append("work_no", data?.work_no);
    formData.append("phone_no", data?.phone_no);
    formData.append("address", data?.address);
    formData.append("fax_number", data?.fax_number);
    formData.append("state", data?.state);
    formData.append("zip_code", data?.zip_code);
    formData.append("country", data?.country);
    formData.append("city", data?.city);
    formData.append("shipping_address", data?.shipping_address);
    formData.append("payment_term_id", data?.payment_term_id);
    formData.append("currency_id", data?.currency_id);
    formData.append("document", document);
    formData.append("cnic_front_img", cnic_front_img);
    formData.append("cnic_back_img", cnic_back_img);
    contact_person &&
      formData.append("contact_person", JSON?.stringify(contact_person));

    try {
      const { success, message } = await dispatch(
        updateVendor({ id: id, vendorData: formData })
      ).unwrap();

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
      toast.error(error?.message);

      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(getVendorDetails({ id }));
    }
    dispatch(getCurrencies());
    dispatch(getPaymentTerms());
  }, [dispatch, id]);

  useEffect(() => {
    if (vendor) {
      setDocument(vendor?.document);
      setCnic_front_img(vendor?.cnic_front_img?.secure_url);
      setCnic_back_img(vendor?.cnic_back_img?.secure_url);
    }
  }, [vendor]);

  return vendor && !vendorLoading ? (
    <div className="pl-7 pr-7 pt-7 pb-7">
      <Card>
        <Form
          initialValues={{
            // v_type: vendor?.v_type || "",
            provider_type: vendor?.provider_type || "",
            first_name: vendor?.first_name || "",
            last_name: vendor?.last_name || "",
            company_name: vendor?.company_name || "",
            vendor_display_name: vendor?.vendor_display_name || "",
            email: vendor?.email || "",
            phone_no: vendor?.phone_no || "",
            work_no: vendor?.work_no || "",
            address: vendor?.address || "",
            fax_number: vendor?.fax_number || "",
            state: vendor?.state || "",
            zip_code: vendor?.zip_code || "",
            country: vendor?.country || "",
            city: vendor?.city || "",
            shipping_address: vendor?.shipping_address || "",
            currency_id: vendor?.currency_id || "",
            payment_term_id: vendor?.payment_term_id || "",
            cFirst_name: vendor?.contact_person?.first_name || "",
            cLast_name: vendor?.contact_person?.last_name || "",
            cEmail: vendor?.contact_person?.email || "",
            cPhone_no: vendor?.contact_person?.phone_no || "",
            cWork_no: vendor?.contact_person?.work_no || "",
          }}
          validationSchema={Yup.object().shape({
            // v_type: Yup.string().required("vendor type is required"),
            provider_type: Yup.string().required("provider type is required"),
            company_name: Yup.string().nullable(),
            vendor_display_name: Yup.string().required(
              "vendor_display_name is required"
            ),
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
              .required("currency_id is required"),
            payment_term_id: Yup.string()
              .uuid("payment_term_id must be a valid UUID")
              .required("payment_term_id is required"),
            contact_person: Yup.string().nullable(),
          })}
          onSubmit={handleEditVendor}
        >
          {({ values, handleChange, handleSubmit }) => (
            <>

              <div className="pt-2 pb-2 container mx-auto">
                <div className="grid grid-cols-12 gap-4">

                  <div className="col-span-12 sm:col-span-5 md:col-span-5">
                    <FaChevronLeft onClick={() => navigate(-1)} className="cursor-pointer" />
                  </div>

                  <div className="col-span-12 sm:col-span-7 md:col-span-7">
                    <h1 className="font-bold text-xl text-left">Edit Vendor</h1>
                  </div>

                  <div className="pb-5 col-span-12 sm:col-span-12 md:col-span-12">
                    <h1 className="font-bold text-xl">Vendor Identification</h1>
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
                    <h1 className="font-bold text-xl">Company Information</h1>
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

                  {/* <div className="col-span-12 sm:col-span-6 md:col-span-6">
                <AppSelect
                  label="Vendor Type"
                  name={values["v_type"]}
                  value={values["v_type"]}
                  options={vendorOptions}
                  onChange={handleChange("v_type")}
                />
                <ErrorMessage name={"v_type"} />
              </div> */}

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
                    <h1 className="text-lg font-bold text-xl">Contact Information</h1>
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="text"
                      label="First Name"
                      name={values["first_name"]}
                      value={values["first_name"]}
                      onChange={handleChange("first_name")}
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppInput
                      type="text"
                      label="Last Name"
                      name={values["last_name"]}
                      value={values["last_name"]}
                      onChange={handleChange("last_name")}
                    />
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
                    <h1 className="text-lg font-bold text-xl">Additional Information</h1>
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppSelect
                      label="Currency"
                      name={values["currency_id"]}
                      value={values["currency_id"]}
                      options={currencyOptions}
                      onChange={handleChange("currency_id")}
                    />
                    <ErrorMessage name={"currency_id"} />
                  </div>

                  <div className="col-span-12 sm:col-span-6 md:col-span-6">
                    <AppSelect
                      label="Payment Term"
                      name={values["payment_term_id"]}
                      value={values["payment_term_id"]}
                      options={paymentTermOptions}
                      onChange={handleChange("payment_term_id")}
                    />
                    <ErrorMessage name={"payment_term_id"} />
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
                    <h1 className="text-lg font-bold text-xl">Documents</h1>
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
                              {document.name ||
                                document.original_filename + "." + document.format}
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
                            src={cnic_front_img?.preview || cnic_front_img}
                            onLoad={() => {
                              URL.revokeObjectURL(
                                cnic_front_img?.preview || cnic_front_img
                              );
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
                            src={cnic_back_img?.preview || cnic_back_img}
                            onLoad={() => {
                              URL.revokeObjectURL(
                                cnic_back_img?.preview || cnic_back_img
                              );
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
                    <h1 className="text-lg font-bold text-xl">Contact Person</h1>
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

                  <div className="flex-center pt-5 col-span-12 sm:col-span-12 md:col-span-12">
                    <div className="sticky bottom-0 w-full">
                      <Button
                        onClick={isLoading ? "" : handleSubmit}
                        title={"Update"}
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
    </div>
  ) : (
    <Spinner size="lg" />
  );
};

export default EditVendor;
