import React, { useEffect } from "react";
import Card from "../../components/card/Card";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getPRDetails } from "../../app/features/Purchasereceives/getPurchaseReceivesSlice";
import CardItem from "../../components/card/CardItem";
import CardHeader from "../../components/card/CardHeader";
import { FaChevronLeft } from "react-icons/fa";
import { Spinner } from "../../components/theme/Loader";
import imagePlaceholder from "../../assets/item_image.png";

const PurchaseReceiveDetail = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const prId = searchParams.get("pr_id");

    const { purchase_receives, isLoading, error } = useSelector((state) => state.getPRs);

    console.log("prdetail prdetail", purchase_receives);

    const goBack = () => {
        window.history.back();
    };

    useEffect(() => {
        try {
            dispatch(getPRDetails({ id: prId })).unwrap();
        } catch (error) {
            toast.error(error.message);
        }
    }, [prId]);

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

                        <h1 className="font-semibold ">Purchase Receive Details</h1>
                    </div>

                    <div className="container mx-auto">
                        <div className="grid grid-cols-12 gap-4">
                            {/* First Card: Order Details */}
                            <div className="col-span-12 sm:col-span-5 md:col-span-5">
                                <Card  >
                                    <CardHeader title={"Order Details"} />
                                    <CardItem title={"Purchase Receive#"} value={purchase_receives?.purchase_received_number} />
                                    <CardItem title={"Received Date"} value={purchase_receives?.received_date?.slice(0, 10)} />
                                    {/* <div className="card-item"> */}
                                    <div className="font-medium text-base text-black/60 dark:text-white/60">
                                        Description
                                    </div>
                                    <h1 className="text-sm">{purchase_receives?.description}</h1>
                                    {/* </div> */}
                                </Card>
                            </div>

                            {/* Second Card: Items Details */}
                            <div className="col-span-12 sm:col-span-7 md:col-span-7" >
                                <Card style={{ height: "100px" }}>
                                    <CardHeader title={"Items Details"} />
                                    {purchase_receives == null || undefined || purchase_receives?.items?.length == 0 ? <></>
                                        :
                                        <>
                                            {purchase_receives?.items?.map((item, index) => (
                                                <>
                                                    <div className="container mx-auto">
                                                        <div className="grid grid-cols-12 gap-4 items-center">

                                                            <div className="border border-gray-400 p-2 rounded-lg col-span-12 sm:col-span-5 flex md:col-span-6 items-center">
                                                                {item?.image ? (
                                                                    <img
                                                                        src={item?.image}
                                                                        alt="..."
                                                                        className="border border-gray-400 rounded-lg p-2 w-20 mr-5"
                                                                    />
                                                                ) :
                                                                    <img src={imagePlaceholder} alt="item" className="border border-gray-400 rounded-lg p-2 w-20 mr-5" />}
                                                                <div>
                                                                    <div className="font-bold text-sm"> {item?.name}</div>
                                                                    <div className="font-bold text-sm">{item?.type}</div>
                                                                </div>
                                                            </div>


                                                            <div className="col-span-12 sm:col-span-7 md:col-span-6">
                                                                <div className="card-item">
                                                                    <div className="font-medium text-base text-sm text-black/60 dark:text-white/60">
                                                                        Available Stock
                                                                    </div>
                                                                    <h1 className="text-sm">{item?.total_quantity || "Not Yet"}</h1>
                                                                </div>

                                                                <div className="card-item">
                                                                    <div className="font-medium text-base text-sm text-black/60 dark:text-white/60">
                                                                        Required Quantity
                                                                    </div>
                                                                    <h1 className="text-sm">{item?.required_quantity || "Not Yet"}</h1>
                                                                </div>

                                                                <div className="card-item">
                                                                    <div className="font-medium text-base text-sm text-black/60 dark:text-white/60">
                                                                        Quantity Received
                                                                    </div>
                                                                    <h1 className="text-sm">{item?.quantity_received || "Not Yet"}</h1>
                                                                </div>

                                                                <div className="card-item">
                                                                    <div className="font-medium text-base text-sm text-black/60 dark:text-white/60">
                                                                        Remaining Quantity
                                                                    </div>
                                                                    <h1 className="text-sm">{item?.remaining_quantity || "Not Yet"}</h1>
                                                                </div>



                                                                <div className="font-medium text-base text-sm text-black/60 dark:text-white/60">
                                                                    Preferred Vendors
                                                                </div>
                                                                {item?.vendors == null || undefined ? "-"
                                                                    :
                                                                    <>
                                                                        {item?.vendors?.map((v, idx) => (
                                                                            <div key={idx} className="card-item">
                                                                                <h1 className="text-sm">{`${v?.vendor_display_name == null || undefined ? "-" : v?.vendor_display_name}`}</h1>
                                                                            </div>
                                                                        ))}
                                                                    </>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <hr class="my-5" />
                                                </>
                                            ))}
                                        </>
                                    }
                                    {/* <CardItem title={"Total Amount"} value={`$ ${prdetail?.total_amount}`} /> */}
                                </Card>
                            </div>
                        </div>
                    </div>

                </>
            )}
        </div>
    );
};

export default PurchaseReceiveDetail;
