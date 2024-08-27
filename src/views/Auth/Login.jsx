import React, { useState } from "react";
import AppInput from "../../components/form/AppInput";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../../components/form/Button";
import logo from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../app/features/User/userSlice";
import Form from "../../components/form/Form";
import * as Yup from "yup";
import ErrorMessage from "../../components/form/ErrorMessage";
import { Toast } from "../../components/theme/Toast";
import { Spinner } from "../../components/theme/Loader";

const Login = () => {
  const dispatch = useDispatch();
  const { textColor } = useSelector((state) => state.theme);
  const { isLoading } = useSelector((state) => state.user);
  const [isPassword, setIsPassword] = useState(true);

  const handleLogin = async (data, { resetForm }) => {
    try {
      const { success, message } = await dispatch(loginUser(data)).unwrap();

      if (success) {
        resetForm();
        Toast("success", message);
      }
    } catch (error) {
      Toast("error", error.message);
      console.log(error);
    }
  };

  return (
    <div className="grid-2">
      <div className="logo-container">
        <div>
          <div className="flex justify-start items-center gap-2">
            <p className="w-20 h-20">
              <img src={logo} alt="" className="logo" />
            </p>
            <h1 className="logo-text">Vite Template</h1>
          </div>
          <img src={logo} className="w-full h-[70vh]" />
        </div>
      </div>

      <Form
        initialValues={{
          email: "",
          password: "",
          signup_type: "EMAIL",
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Inavalid email address")
            .required("Email is Required"),
          password: Yup.string().required("Password is Required"),
        })}
        onSubmit={handleLogin}
      >
        {({ handleSubmit, values, handleChange }) => (
          <div className="form-container">
            <h1 className="logo-text">Welcome To Vite Template!</h1>

            <div className="input-container">
              <AppInput
                type="email"
                label={"Email"}
                placeholder="jhon@exmaple.com"
                name="email"
                value={values.email}
                onChange={handleChange}
              />

              <ErrorMessage name={"email"} />
            </div>

            <div className="input-container">
              <AppInput
                type={`${isPassword ? "password" : "text"}`}
                label={"Password"}
                placeholder={`********`}
                icon={isPassword ? FaEye : FaEyeSlash}
                onIconClick={() => setIsPassword((prev) => !prev)}
                name="password"
                value={values.password}
                onChange={handleChange}
              />

              <ErrorMessage name={"password"} />
            </div>

            <h1 className={`forget-pass ${textColor}`}>Forgot Password?</h1>

            <Button
              title={"Sign In"}
              width={true}
              onClick={isLoading ? null : handleSubmit}
              spinner={isLoading ? <Spinner size="sm" /> : null}
            />

            <div className="flex-center w-full">
              <p className="text-sm text-center dark:text-dark_text_1">
                Don't have an account?{" "}
                <span className={`${textColor} cursor-pointer`}>Sign Up</span>
              </p>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};

export default Login;
