import React, { useEffect } from "react";
import Card from "../../components/card/Card";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getInvoiceDetails } from "../../app/features/Invoices/getInvoiceSlice";
import CardItem from "../../components/card/CardItem";
import CardHeader from "../../components/card/CardHeader";
import { FaChevronLeft } from "react-icons/fa";
import { Spinner } from "../../components/theme/Loader";
import logo from "../../assets/item_image.png";

const InvoiceDetails = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const invoiceId = searchParams.get("invoice_id");

    const { invoicedetails, isLoading, error } = useSelector((state) => state.getInvoice);

    console.log("invoicedetails", invoicedetails);

    const goBack = () => {
        window.history.back();
    };

    useEffect(() => {
        try {
            dispatch(getInvoiceDetails({ id: invoiceId })).unwrap();
        } catch (error) {
            toast.error(error.message);
        }
    }, [invoiceId]);

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

                        <h1 className="font-semibold ">Invoice Details</h1>
                    </div>

                    <Card className="container mx-auto p-6">
                        <div className="rounded-lg p-6">
                            {/* Invoice Header */}
                            <div className="mb-6">
                                {/* <div>
                                        <p className="font-semibold">Invoice Number:</p>
                                        <p>{invoicedetails?.bill_number}</p>
                                    </div> */}
                                <h1 className="text-2xl font-bold">{invoicedetails?.bill_number}</h1>
                                {/* <p>1234 Main St, City, State 12345</p>
                                <p>Phone: (123) 456-7890</p> */}
                            </div>

                            {/* Invoice Info */}
                            <div className="mb-4">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="font-semibold">Date:</p>
                                        <p>{invoicedetails?.bill_date?.slice(0, 10)}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Payment Terms:</p>
                                        <p>{invoicedetails?.payment_term_name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Product Table */}
                            <div className="mt-6">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="font-semibold">Purchase Receives:</p>
                                        {invoicedetails?.purchase_receives.map((invoice) => (
                                            <p>{invoice?.purchase_received_number}</p>
                                        ))}
                                    </div>

                                    <div>
                                        <p className="font-semibold text-right">Vendors:</p>
                                        {invoicedetails?.purchase_receives.map((invoice) => (
                                            <p className="text-right">{invoice?.vendor?.vendor_display_name}</p>
                                        ))}
                                    </div>
                                </div>

                                <h2 className="text-xl font-semibold mt-4 mb-4">Items</h2>
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            {/* <th className="py-2 px-4 text-left">Item</th> */}
                                            <th className="py-2 px-4 text-right">Quantity</th>
                                            {/* <th className="py-2 px-4 text-right">Price</th>
                                            <th className="py-2 px-4 text-right">Total</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Map through items */}
                                        <tr>
                                            {/* <td className="py-2 px-4">{item.name}</td> */}
                                            <td className="py-2 px-4 text-right">{invoicedetails?.total_items == null || undefined ? "-" : invoicedetails?.total_items}</td>
                                            {/* <td className="py-2 px-4 text-right">${invoicedetails?.total_price == null || undefined ? "-" : invoicedetails?.total_price}</td>
                                            <td className="py-2 px-4 text-right">${invoicedetails?.net_price == null || undefined ? "-" : invoicedetails?.net_price}</td> */}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Pricing & Tax Details */}
                            <div className="mt-6">
                                <div className="flex justify-between border-t border-gray-300 pt-4">
                                    <p className="font-semibold">Total:</p>
                                    <p>${invoicedetails?.total_price}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Tax ({invoicedetails?.tax_percentage}%):</p>
                                    <p>${(parseFloat(invoicedetails?.tax_percentage / 100))}</p>
                                </div>
                                <div className="flex justify-between border-t border-gray-300 pt-4">
                                    <p className="text-xl font-semibold">Total:</p>
                                    <p className="text-xl">${invoicedetails?.net_price}</p>
                                </div>
                            </div>

                            {/* Footer */}
                            {/* <div className="text-center mt-6">
                                <p>Thank you for your business!</p>
                                <p>If you have any questions, please contact us at (123) 456-7890</p>
                            </div> */}
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
};

export default InvoiceDetails;
