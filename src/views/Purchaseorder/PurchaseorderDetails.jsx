import React, { useEffect } from "react";
import Card from "../../components/card/Card";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getPODetails } from "../../app/features/Purchaseorder/getPurchaseOrderSlice";
import CardItem from "../../components/card/CardItem";
import CardHeader from "../../components/card/CardHeader";
import { FaChevronLeft } from "react-icons/fa";
import { Spinner } from "../../components/theme/Loader";
import imagePlaceholder from "../../assets/item_image.png";

const PurchaseorderDetails = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const poId = searchParams.get("po_id");

    const { podetail, isLoading, error } = useSelector((state) => state.getPO);

    console.log("podetail podetail", podetail);

    const goBack = () => {
        window.history.back();
    };

    useEffect(() => {
        try {
            dispatch(getPODetails({ id: poId })).unwrap();
        } catch (error) {
            toast.error(error.message);
        }
    }, [poId]);

    return (
        <div className="py-5 px-10">
            {isLoading ? (
                <Spinner size="lg" />
            ) : (
                <>
                    <div
                        className="flex justify-start items-center gap-2 pb-5 w-fit"
                    >
                        <FaChevronLeft onClick={goBack} className="cursor-pointer" />

                        <h1 className="font-semibold">Purchase Order Details</h1>
                    </div>

                    <div className="container mx-auto">
                        <div className="grid grid-cols-12 gap-4">
                            {/* First Card: Order Details */}
                            <div className="col-span-12 sm:col-span-5 md:col-span-5">
                                <Card  >
                                    <CardHeader title={"Order Details"} />
                                    <CardItem title={"Vendor Name"} value={podetail?.result?.purchase_items == null || undefined ? "-" : `${podetail?.result?.purchase_items[0]?.preferred_vendors[0]?.first_name} ${podetail?.result?.purchase_items[0]?.preferred_vendors[0]?.last_name}`} />
                                    <div className="card-item">
                                        <div className="font-medium text-base text-sm text-black/60 dark:text-white/60">Status</div>
                                        <h1 className="text-sm" style={{
                                            fontWeight: "medium",
                                            borderRadius: "40px",
                                            backgroundColor: podetail?.result?.status === "DRAFT" ? 'darkblue' :
                                                podetail?.result?.status === "ISSUED" ? 'purple' :
                                                    podetail?.result?.status === "FULLY DELIVERED" ? 'green' :
                                                        podetail?.result?.status === "CANCELLED" ? 'red' :
                                                            'yellow',
                                            padding: 6,
                                            color: "white",
                                            width: "100px",
                                            textAlign: "center"
                                        }}>{podetail?.result?.status}</h1>
                                    </div>
                                    <CardItem title={"Shipping Address"} value={podetail?.result?.delivery_address} />
                                    <CardItem title={"Purchase Order Number"} value={podetail?.result?.purchase_order_number} />
                                    <CardItem title={"Reference Number"} value={podetail?.result?.pr_number} />
                                    <CardItem title={"Requested Date"} value={podetail?.result?.requested_date.slice(0, 10)} />
                                    <CardItem title={"Expected Delivery Date"} value={podetail?.result?.required_date.slice(0, 10)} />
                                    <CardItem title={"Shipment Preferences"} value={podetail?.result?.shipment_preferences} />
                                </Card>
                            </div>

                            {/* Second Card: Items Details */}
                            {podetail?.result?.purchase_items.length == 0 || podetail?.result?.purchase_items == null || undefined ?
                                <></>
                                :
                                <div className="col-span-12 sm:col-span-7 md:col-span-7" >
                                    <Card>
                                        <CardHeader title={"Items Details"} />
                                        {podetail?.result?.purchase_items.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <div className="container mx-auto">
                                                    <div className="grid grid-cols-12 gap-4 items-center">
                                                        {/* Left Side: Image and Details */}
                                                        <div className="border border-gray-400 p-2 rounded-lg col-span-12 sm:col-span-5 flex md:col-span-6 items-center">
                                                            {item?.item_details?.image ? (
                                                                <img
                                                                    src={item?.item_details?.image}
                                                                    alt="..."
                                                                    className="border border-gray-400 rounded-lg p-2 w-20 mr-5"
                                                                />
                                                            ) :
                                                                <img src={imagePlaceholder} alt="item" className="border border-gray-400 rounded-lg p-2 w-20 mr-5" />}
                                                            <div>
                                                                <div className="font-bold text-sm">{item?.item_details.name}</div>
                                                                <div className="font-bold text-sm">{item?.item_details.type}</div>
                                                                <div className="font-bold text-sm">{item?.item_details.category}</div>
                                                            </div>
                                                        </div>

                                                        {/* Right Side: Additional Information */}
                                                        <div className="col-span-12 sm:col-span-7 md:col-span-6">
                                                            <div className="card-item">
                                                                <div className="font-medium text-base text-sm text-black/60 dark:text-white/60">
                                                                    Available Stock
                                                                </div>
                                                                <h1 className="text-sm">{item?.available_stock || "Not Yet"}</h1>
                                                            </div>

                                                            <div className="card-item">
                                                                <div className="font-medium text-base text-sm text-black/60 dark:text-white/60">
                                                                    Required Quantity
                                                                </div>
                                                                <h1 className="text-sm">{item?.required_quantity || "Not Yet"}</h1>
                                                            </div>

                                                            {/* Example of a responsive layout change */}
                                                            {index % 2 === 0 && (
                                                                <div className="card-item">
                                                                    <div className="font-medium text-base text-sm text-black/60 dark:text-white/60">
                                                                        Required Quantity
                                                                    </div>
                                                                    <h1 className="text-sm">{item?.required_quantity || "Not Yet"}</h1>
                                                                </div>
                                                            )}

                                                            {/* Preferred Vendors */}
                                                            <div className="card-item">
                                                                <div className="font-medium text-base text-sm text-black/60 dark:text-white/60">
                                                                    Price
                                                                </div>
                                                                <h1 className="text-sm">$ {item?.price || "Not Yet"}</h1>
                                                            </div>

                                                            <div className="font-medium text-base text-sm text-black/60 dark:text-white/60">
                                                                Preferred Vendors
                                                            </div>

                                                            {item?.preferred_vendors?.map((v, idx) => (
                                                                <div key={idx} className="card-item">
                                                                    <h1 className="text-sm">{`${v?.first_name} ${v?.last_name}` || "Not Yet"}</h1>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr className="my-5" />
                                            </React.Fragment>
                                        ))}
                                        <CardItem title={"Total Amount"} value={`$ ${podetail?.result?.total_amount}`} />
                                    </Card>
                                </div>
                            }
                        </div>
                    </div>

                </>
            )}
        </div>
    );
};

export default PurchaseorderDetails;
