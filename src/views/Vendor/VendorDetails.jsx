import React, { useEffect } from "react";
import Card from "../../components/card/Card";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getVendorDetails } from "../../app/features/Vendor/getVendorSlice";
import CardItem from "../../components/card/CardItem";
import CardHeader from "../../components/card/CardHeader";
import { FaChevronLeft, FaDownload, FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Spinner } from "../../components/theme/Loader";

const VendorDetails = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const vendorId = searchParams.get("v_id");

  const { textColor } = useSelector((state) => state.theme);

  const { vendor, isLoading } = useSelector((state) => state.getVendor);

  console.log("vendor", vendor);

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    try {
      dispatch(getVendorDetails({ id: vendorId })).unwrap();
    } catch (error) {
      toast.error(error.message);
    }
  }, [vendorId]);

  const handleDownload = async (fileUrl, fileName) => {
    try {
      // Fetch the file
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      // Create a temporary URL for the Blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a link element, set it to the Blob URL, and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the Blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('File download failed', error);
    }
  };

  return (
    <div className="py-5 px-10">
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <>
          <div className="pl-3 pr-3 pt-3 pb-3">
            <Card>
              <div
                className="flex justify-start items-center gap-2 pb-5 cursor-pointer"
                onClick={goBack}
              >
                <FaChevronLeft />

                <h1 className="text-center mx-auto" style={{ color: "#000000", fontWeight: 600, letterSpacing: "1px", fontSize: "20px" }}>Vendor Details</h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Card>
                  <CardHeader title={"Personal Details"} />
                  <CardItem title={"First Name"} value={vendor?.first_name} />
                  <CardItem title={"Last Name"} value={vendor?.last_name} />
                  <CardItem
                    title={"Vendor Display Name"}
                    value={vendor?.vendor_display_name}
                  />
                  <CardItem title={"Type"} value={vendor?.provider_type} />
                  <CardItem title={"Vendor Type"} value={vendor?.v_type} />
                  <CardItem title={"Company Name"} value={vendor?.company_name} />
                  <CardItem title={"Country"} value={vendor?.country} />

                  <CardItem title={"Email"} value={vendor?.email} />
                  <CardItem title={"Work Number"} value={vendor?.work_no} />
                  <CardItem title={"Phone Number"} value={vendor?.phone_no} />
                </Card>
                <Card>
                  <CardHeader title={"Address Details"} />
                  <CardItem title={"Address"} value={vendor?.address} />
                  <CardItem title={"Fax Number"} value={vendor?.fax} />
                  <CardItem title={"State"} value={vendor?.state} />
                  <CardItem title={"City"} value={vendor?.city} />
                  <CardItem title={"Zip Code"} value={vendor?.zip} />
                  <CardItem
                    title={"Shipping Address"}
                    value={vendor?.shipping_address}
                  />
                </Card>
                <Card>
                  <CardHeader title={"Other Details"} />
                  <CardItem title={"Currency"} value={vendor?.ccy} />
                  <CardItem
                    title={"Payment Terms"}
                    value={vendor?.payment_term_name}
                  />
                </Card>
                <Card>
                  <CardHeader title={"Contact Person Details"} />
                  <CardItem
                    title={"First Name"}
                    value={vendor?.contact_person?.first_name}
                  />
                  <CardItem
                    title={"Last Name"}
                    value={vendor?.contact_person?.last_name}
                  />
                  <CardItem title={"Email"} value={vendor?.contact_person?.email} />
                  <CardItem
                    title={"Work Phone Number"}
                    value={vendor?.contact_person?.work_no}
                  />
                  <CardItem
                    title={"Phone Number"}
                    value={vendor?.contact_person?.phone_no}
                  />
                </Card>

              </div>{" "}

              {vendor?.cnic_front_img || vendor?.cnic_back_img || vendor?.document ? (
                <>
                  <h1
                    className="ml-8 mb-4"
                    style={{
                      color: "#000000",
                      fontWeight: 600,
                      letterSpacing: "1px",
                      fontSize: "20px",
                    }}
                  >
                    Documents
                  </h1>

                  <div className="ml-8 mr-8">
                    <table className="w-full border-b border-gray-300">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="border-b border-gray-300 px-4 py-2 text-center font-semibold">Name</th>
                          <th className="border-b border-gray-300 px-4 py-2 text-center font-semibold">File</th>
                          <th className="border-b border-gray-300 px-4 py-2 text-center font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendor?.cnic_front_img && (
                          <tr className="hover:bg-gray-100">
                            <td className="border-b border-gray-300 px-4 py-2 text-center">CNIC Front</td>
                            <td className="border-b border-gray-300 px-4 py-2 text-center">
                              <a
                                href={vendor?.cnic_front_img?.secure_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {vendor?.cnic_front_img?.api_key}.{vendor?.cnic_front_img?.format}
                              </a>
                            </td>
                            <td className="border-b border-gray-300 px-4 py-2 text-center">
                              <div className="flex-center gap-2 cursor-pointer">
                                {/* <FaEye
                                  size={15}
                                  className="text-eye_black dark:text-eye_white"
                                  title="View"
                                /> */}
                                <FaDownload size={15} style={{ color: "#34495E" }} title="Download" onClick={() => handleDownload(vendor?.cnic_front_img?.secure_url, vendor?.cnic_front_img?.api_key)} />
                                {/* <FaEdit size={15} className={`${textColor}`} title="Edit" />
                                <FaTrash size={15} className="text-red-600" title="Delete" /> */}
                              </div>
                            </td>
                          </tr>
                        )}

                        {vendor?.cnic_back_img && (
                          <tr className="hover:bg-gray-100">
                            <td className="border-b border-gray-300 px-4 py-2 text-center">CNIC Back</td>
                            <td className="border-b border-gray-300 px-4 py-2 text-center">
                              <a
                                href={vendor?.cnic_back_img?.secure_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {vendor?.cnic_back_img?.api_key}.{vendor?.cnic_back_img?.format}
                              </a>
                            </td>
                            <td className="border-b border-gray-300 px-4 py-2 text-center">
                              <div className="flex-center gap-2 cursor-pointer">
                                {/* <FaEye
                                  size={15}
                                  className="text-eye_black dark:text-eye_white"
                                  title="View"
                                /> */}
                                <FaDownload size={15} style={{ color: "#34495E" }} title="Download" onClick={() => handleDownload(vendor?.cnic_back_img?.secure_url, vendor?.cnic_back_img?.api_key)} />
                                {/* <FaEdit size={15} className={`${textColor}`} title="Edit" />
                                <FaTrash size={15} className="text-red-600" title="Delete" /> */}
                              </div>
                            </td>
                          </tr>
                        )}

                        {vendor?.document && (
                          <tr className="hover:bg-gray-100">
                            <td className="border-b border-gray-300 px-4 py-2 text-center">{vendor?.document?.original_filename}</td>
                            <td className="border-b border-gray-300 px-4 py-2 text-center">
                              <a
                                href={vendor?.document?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {vendor?.document?.original_filename}
                              </a>
                            </td>
                            <td className="border-b border-gray-300 px-4 py-2 text-center">
                              <div className="flex-center gap-2 cursor-pointer">
                                {/* <FaEye
                                  size={15}
                                  className="text-eye_black dark:text-eye_white"
                                  title="View"
                                /> */}
                                <FaDownload size={15} style={{ color: "#34495E" }} title="Download" onClick={() => handleDownload(vendor?.document?.url, vendor?.document?.original_filename)} />
                                {/* <FaEdit size={15} className={`${textColor}`} title="Edit" />
                                <FaTrash size={15} className="text-red-600" title="Delete" /> */}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : null}


            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default VendorDetails;
