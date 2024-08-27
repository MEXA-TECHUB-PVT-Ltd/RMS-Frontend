import React from "react";
import { Formik } from "formik";

const Form = ({ children, initialValues, validationSchema, onSubmit }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(props) => children(props)}
    </Formik>
  );
};

export default Form;
