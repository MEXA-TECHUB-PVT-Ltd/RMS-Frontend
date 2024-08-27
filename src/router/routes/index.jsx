import Vendor from "../../views/Vendor/Vendor";
import Home from "../../views/Home";
import Users from "../../views/Users";
import AddVendor from "../../views/Vendor/AddVendor";
import VendorDetails from "../../views/Vendor/VendorDetails";
import EditVendor from "../../views/Vendor/EditVendor";
import Item from "../../views/Item/Item"
import AddItem from "../../views/Item/AddItem";
import EditItem from "../../views/Item/EditItem";
import ItemDetails from "../../views/Item/ItemDetails";
import Purchaseorder from "../../views/Purchaseorder/Purchaseorder";
import PurchaseorderDetails from "../../views/Purchaseorder/PurchaseorderDetails";
import Purchaserequisition from "../../views/Purchaserequisition/Purchaserequisition";
import AddPurchaseRequistion from "../../views/Purchaserequisition/AddP-requisition"
import EditPurchaseRequistion from "../../views/Purchaserequisition/EditP-requisition"
import PurchaseRequisitionDetail from "../../views/Purchaserequisition/PurchaseRequisitionDetail"
import Purchasereceive from "../../views/Purchasereceives/Purchasereceives" 
import AddPurchaseReceive from "../../views/Purchasereceives/AddP-receive" 
//  
export default [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/vendors",
    element: <Vendor />,
  },
  {
    path: "/add-vendor",
    element: <AddVendor />,
  },
  {
    path: "/edit-vendor",
    element: <EditVendor />,
  },
  {
    path: "/vendor-details",
    element: <VendorDetails />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/items",
    element: <Item />,
  },
  {
    path: "/add-item",
    element: <AddItem />,
  },
  {
    path: "/edit-item",
    element: <EditItem />,
  },
  {
    path: "/item-detail",
    element: <ItemDetails />,
  },
  {
    path: "/puchase-order",
    element: <Purchaseorder />,
  },
  {
    path: "/puchase-order-details",
    element: <PurchaseorderDetails />,
  },
  {
    path: "/purchase-receives",
    element: <Purchasereceive />,
  }, 
  {
    path: "/add-purchase-receives",
    element: <AddPurchaseReceive />,
  },    
  {
    path: "/puchase-requisition",
    element: <Purchaserequisition />,
  },
  {
    path: "/add-puchase-requisition",
    element: <AddPurchaseRequistion />,
  },
  {
    path: "/edit-puchase-requisition",
    element: <EditPurchaseRequistion />,
  },
  {
    path: "/purchase-requisition-details",
    element: <PurchaseRequisitionDetail />,
  },  
];
