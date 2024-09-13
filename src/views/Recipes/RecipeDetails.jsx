import React, { useEffect } from "react";
import Card from "../../components/card/Card";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getRecipeDetails } from "../../app/features/Recipes/getRecipeSlice";
import CardItem from "../../components/card/CardItem";
import CardHeader from "../../components/card/CardHeader";
import { FaChevronLeft } from "react-icons/fa";
import { Spinner } from "../../components/theme/Loader";
import logo from "../../assets/item_image.png";
import imagePlaceholder from "../../assets/item_image.png";

const RecipeDetails = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const recipeId = searchParams.get("recipe_id");

    const { recipedetails, isLoading, error } = useSelector((state) => state.getRecipe);

    console.log("recipedetails", recipedetails);

    const goBack = () => {
        window.history.back();
    };

    useEffect(() => {
        try {
            dispatch(getRecipeDetails({ id: recipeId })).unwrap();
        } catch (error) {
            toast.error(error.message);
        }
    }, [recipeId]);

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

                        <h1 className="font-semibold ">Recipe Details</h1>
                    </div>
                    <div className="container mx-auto">
                        <div className="grid grid-cols-12 gap-4">

                            <div className="col-span-12 sm:col-span-6 md:col-span-6">
                                <Card  >
                                    <CardHeader title={"Recipe Details"} />
                                    {recipedetails?.image == null || undefined || recipedetails.length == 0 ?
                                        <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                                            <img src={logo} alt="item" style={{ alignSelf: "center", width: "700", height: "130px" }} />
                                        </div>
                                        :
                                        <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                                            <img src={recipedetails.image} alt="item" style={{ alignSelf: "center", width: "600", height: "100px" }} />
                                        </div>
                                    }

                                    <CardItem title={"Recipe Name"} value={recipedetails?.recipe_name} />
                                    <CardItem title={"Category"} value={recipedetails?.category_name} />
                                    <CardItem title={"Difficulty Level"} value={recipedetails?.difficulty_level} />
                                    <CardItem title={"Added By"} value={recipedetails?.added_by} />
                                    <CardItem title={"Price"} value={recipedetails?.price} />
                                    <CardItem title={"Cooking Time"} value={recipedetails?.cooking_time} />

                                    <div className="mt-3">
                                        <h1 className="font-medium text-base text-black/60 dark:text-white/60">
                                            Preparation Instructions
                                        </h1>


                                        <div className="card-item">
                                            <h1 className="text-sm" style={{
                                                fontWeight: "bold"
                                            }}>{recipedetails?.
                                                preparation_instructions == null ? "-" : recipedetails?.preparation_instructions}</h1>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <h1 className="font-medium text-base text-black/60 dark:text-white/60">
                                            Allergen Information
                                        </h1>
                                        <div className="card-item">
                                            <h1 className="text-sm" style={{
                                                fontWeight: "bold"
                                            }}>{recipedetails?.allergen_info == null ? "-" : recipedetails?.allergen_info}</h1>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <h1 className="font-medium text-base text-black/60 dark:text-white/60">
                                            Nutritional Information
                                        </h1>
                                        <div className="card-item">
                                            <h1 className="text-sm" style={{
                                                fontWeight: "bold"
                                            }}>{recipedetails?.nutritional_info == null ? "-" : recipedetails?.nutritional_info}</h1>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <h1 className="font-medium text-base text-black/60 dark:text-white/60">
                                            Equipment Needed
                                        </h1>
                                        <div className="card-item">
                                            <h1 className="text-sm" style={{
                                                fontWeight: "bold"
                                            }}>{recipedetails?.equipment_needed == null ? "-" : recipedetails?.equipment_needed}</h1>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <h1 className="font-medium text-base text-black/60 dark:text-white/60">
                                            Presentation Instructions
                                        </h1>
                                        <div className="card-item">
                                            <h1 className="text-sm" style={{
                                                fontWeight: "bold"
                                            }}>{recipedetails?.presentation_instructions == null ? "-" : recipedetails?.presentation_instructions}</h1>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <h1 className="font-medium text-base text-black/60 dark:text-white/60">
                                            Side Order
                                        </h1>
                                        <div className="card-item">
                                            <h1 className="text-sm" style={{
                                                fontWeight: "bold"
                                            }}>{recipedetails?.side_order == null ? "-" : recipedetails?.side_order}</h1>
                                        </div>
                                    </div>

                                </Card>
                            </div>


                            <div className="col-span-12 sm:col-span-6 md:col-span-6" >
                                <Card style={{ height: "100px" }}>
                                    <CardHeader title={"Items Details"} />
                                    {recipedetails == null || undefined || recipedetails?.length == 0 ? <></>
                                        :
                                        <>
                                            {recipedetails?.items.map((item, index) => (
                                                <>
                                                    <div className="container mx-auto">
                                                        <div className="p-2 rounded-lg col-span-12 sm:col-span-5 flex md:col-span-12 items-center">

                                                            {item?.image == null || undefined ? (
                                                                <img src={imagePlaceholder} alt="item" className="border border-gray-400 rounded-lg p-2 w-40 h-20 mr-5" />
                                                            ) :
                                                                <img
                                                                    src={item?.image}
                                                                    alt="..."
                                                                    className="border border-gray-400 rounded-lg p-2 w-40 h-20 mr-5"
                                                                />
                                                            }

                                                            <div className="flex flex-col items-center w-full">
                                                                <div className="card-item flex justify-between items-center w-full">
                                                                    <h1 className="font-medium text-base text-black/60 dark:text-white/60">
                                                                        Item Name
                                                                    </h1>
                                                                    <h1 className="text-sm text-right">{item?.name || "Not Yet"}</h1>
                                                                </div>

                                                                <div className="card-item flex justify-between items-center w-full">
                                                                    <h1 className="font-medium text-base text-black/60 dark:text-white/60">
                                                                        Quantity
                                                                    </h1>
                                                                    <h1 className="text-sm text-right">{item?.quantity || "Not Yet"}</h1>
                                                                </div>

                                                                <div className="card-item flex justify-between items-center w-full">
                                                                    <h1 className="font-medium text-base text-black/60 dark:text-white/60">
                                                                        Measuring Unit
                                                                    </h1>
                                                                    <h1 className="text-sm text-right">{item?.measuring_unit || "Not Yet"}</h1>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div >

                                                    <hr class="my-5" />
                                                </>
                                            ))}
                                        </>
                                    }
                                </Card>
                            </div>
                        </div>
                    </div>
                </>
            )
            }
        </div >
    );
};

export default RecipeDetails;
