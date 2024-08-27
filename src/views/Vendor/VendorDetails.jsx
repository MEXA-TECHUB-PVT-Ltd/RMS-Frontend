import React, { useEffect } from "react";
import Card from "../../components/card/Card";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getVendorDetails } from "../../app/features/Vendor/getVendorSlice";
import CardItem from "../../components/card/CardItem";
import CardHeader from "../../components/card/CardHeader";
import { FaChevronLeft } from "react-icons/fa";
import { Spinner } from "../../components/theme/Loader";

const VendorDetails = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const vendorId = searchParams.get("v_id");

  const { vendor, isLoading } = useSelector((state) => state.getVendor);

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

  return (
    <div className="py-5 px-10">
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <>
          <div
            className="flex justify-start items-center gap-2 pb-5 cursor-pointer w-fit"
            onClick={goBack}
          >
            <FaChevronLeft />

            <h1 className="font-semibold ">Vendor Details</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card>
              <CardHeader title={"Personal Details"} />
              <CardItem title={"First Name"} value={vendor?.first_name} />
              <CardItem title={"Last Name"} value={vendor?.last_name} />
              <CardItem title={"Type"} value={vendor?.provider_type} />
              <CardItem title={"Vendor Type"} value={vendor?.v_type} />
              <CardItem title={"Company Name"} value={vendor?.company_name} />
              <CardItem
                title={"Vendor Display Name"}
                value={vendor?.vendor_display_name}
              />
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
              <div className="flex-start gap-3 my-2">
                {vendor?.document && (
                  <a
                    href={vendor?.document?.secure_url}
                    target="_blank"
                    className="image-container flex-center"
                  >
                    <div className="text-xs">
                      {vendor?.document?.original_filename.slice(0, 14)}
                    </div>
                  </a>
                )}
                {vendor?.cnic_front_img && (
                  <a
                    href={vendor?.cnic_front_img?.secure_url}
                    target="_blank"
                    className="image-container"
                  >
                    <img
                      src={vendor?.cnic_front_img?.secure_url}
                      className="w-full h-full"
                    />
                  </a>
                )}
                {vendor?.cnic_back_img && (
                  <a
                    href={vendor?.cnic_back_img?.secure_url}
                    target="_blank"
                    className="image-container"
                  >
                    <img
                      src={vendor?.cnic_back_img?.secure_url}
                      className="w-full h-full"
                    />
                  </a>
                )}
              </div>
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
        </>
      )}
    </div>
  );
};

export default VendorDetails;
