import React, { useEffect } from "react";
import Card from "../../components/card/Card";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getItemDetails } from "../../app/features/Item/getItemSlice";
import CardItem from "../../components/card/CardItem";
import CardHeader from "../../components/card/CardHeader";
import { FaChevronLeft } from "react-icons/fa";
import { Spinner } from "../../components/theme/Loader";
import logo from "../../assets/item_image.png";

const ItemDetails = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const itemId = searchParams.get("item_id");

    const { itemdetails, isLoading, error } = useSelector((state) => state.getItem);

    console.log("itemDetails", itemdetails);

    const goBack = () => {
        window.history.back();
    };

    useEffect(() => {
        try {
            dispatch(getItemDetails({ id: itemId })).unwrap();
        } catch (error) {
            toast.error(error.message);
        }
    }, [itemId]);

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

                        <h1 className="font-semibold ">Item Details</h1>
                    </div>
                    {itemdetails?.type == "SERVICE" ?
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Card  >
                                <CardHeader title={"Service Details"} />
                                <CardItem title={"Item Type"} value={itemdetails?.type} />
                                <CardItem title={"Name"} value={itemdetails?.name} />
                                <CardItem title={"Preffered Vendor"} value={`${itemdetails?.vendors[0]?.first_name} ${itemdetails?.vendors[0]?.last_name}`} />
                                <CardItem title={"Description"} value={itemdetails?.description} />
                            </Card>
                        </div>
                        :
                        <div className="container mx-auto">
                            <div className="grid grid-cols-12 gap-4">

                                <div className="col-span-12 sm:col-span-7 md:col-span-7">
                                    <Card  >
                                        <CardHeader title={"Product Details"} />
                                        {itemdetails?.image == null || undefined || itemdetails.legth == 0 ?
                                            <img src={logo} alt="item" />
                                            :
                                            <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                                                <img src={itemdetails.image} alt="item" style={{ alignSelf: "center", width: "500", height: "100px" }} />
                                            </div>
                                        }
                                        <CardItem title={"Item Type"} value={itemdetails?.type} />
                                        <CardItem title={"Name"} value={itemdetails?.name} />
                                        <CardItem title={"Product Catalog"} value={itemdetails?.product_catalog} />
                                        <CardItem title={"Category"} value={itemdetails?.product_category} />
                                        <CardItem title={"Unit Category"} value={itemdetails?.unit_category} />
                                        {itemdetails?.unit_category === "quantity" ?
                                            <CardItem title={"Quantity Unit"} value={itemdetails?.quantity_units} />
                                            :
                                            <></>
                                        }
                                        <CardItem title={`${itemdetails?.unit_category == "quantity" ? "Quantity" : "Unit"}`} value={itemdetails?.product_units} />
                                        {/* <CardItem title={`${itemdetails?.unit_category == "quantity" ? "Usage Quantity" : "Usage Unit"}`} value={itemdetails?.usage_unit} /> */}
                                        <CardItem
                                            title={"Preferred Vendor"}
                                            value={
                                                <ul>
                                                    {itemdetails?.vendors == null || undefined || itemdetails?.vendors.length == 0 ?
                                                        <></>
                                                        :
                                                        <>
                                                            {itemdetails?.vendors && itemdetails?.vendors?.map((item, index) => (
                                                                <li key={index}>
                                                                    {`${item?.first_name} ${item?.last_name}`}
                                                                </li>
                                                            ))}
                                                        </>}
                                                </ul>
                                            }
                                        />
                                    </Card>
                                </div>


                                <div className="col-span-12 sm:col-span-5 md:col-span-5" >
                                    <Card style={{ height: "100px" }}>
                                        <CardHeader title={"Inventory Details"} />
                                        <CardItem title={"Stock In Hand"} value={itemdetails?.stock_in_hand} />
                                        <CardItem title={"Stock Rate Per Unit"} value={itemdetails?.opening_stock_rate} />
                                        <CardItem title={"Re-order Unit"} value={itemdetails?.reorder_unit} />
                                        <CardItem title={"Description"} value={itemdetails?.inventory_description} />
                                    </Card>
                                </div>
                            </div>
                        </div>
                    }
                </>
            )}
        </div>
    );
};

export default ItemDetails;
