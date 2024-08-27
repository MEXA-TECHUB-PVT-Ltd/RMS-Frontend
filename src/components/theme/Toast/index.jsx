import { toast } from "react-hot-toast";

export const Toast = (type, message) => {
  return type === "error"
    ? toast.error(message)
    : type === "success"
    ? toast.success(message)
    : type === "info"
    ? toast.info(message)
    : null;
};
