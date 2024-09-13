import { FaRegUser, FaFileInvoice, FaStoreAlt, FaProductHunt, FaViacoin, FaAlipay, FaInvision, FaUtensils, FaStore } from "react-icons/fa";
import { MdOutlineDashboardCustomize } from "react-icons/md";

export default [
  {
    id: "home",
    title: "Dashboard",
    path: "/",
    icon: <MdOutlineDashboardCustomize size={21} />,
  },
  {
    id: "vendor",
    title: "Vendors",
    path: "/vendors",
    icon: <FaStoreAlt size={21} />,
  },
  {
    id: "items",
    title: "Items",
    path: "/items",
    icon: <FaProductHunt size={21} />,
  },
  {
    id: "purchaserequisition",
    title: "Stock Management",
    // path: "/puchase-requisition",
    icon: <FaStore size={18} />,
    submenu: [
      {
        id: "purchaserequisition",
        title: "Purchase Requisition",
        path: "/puchase-requisition",
        icon: <FaAlipay size={18} />,
      },
      {
        id: "purchaseorder",
        title: "Purchase Order",
        path: "/puchase-order",
        icon: <FaViacoin size={18} />,
      },
      {
        id: "purchasereceives",
        title: "Purchase Receives",
        path: "/purchase-receives",
        icon: <FaInvision size={18} />,
      },
      {
        id: "invoices",
        title: "Invoices",
        path: "/invoices",
        icon: <FaFileInvoice size={18} />,
      },
    ],
  },
  {
    id: "recipes",
    title: "Recipes",
    path: "/recipes",
    icon: <FaUtensils size={21} />,
  },
];
