import { useFormikContext } from "formik";
import React from "react";

const ErrorMessage = ({ name }) => {
  const { errors, touched } = useFormikContext();
  return touched[name] && errors[name] ? (
    <div className="text-red-500 text-xs">{errors[name]}</div>
  ) : null;
};

export default ErrorMessage;
