import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaHome } from "react-icons/fa";
import { loginUser } from "../Redux/Slice"; // Adjust the path as needed

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const errorMessage = useSelector((state) => state.app.errorMessage);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Yup validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const handleSubmit = (values) => {
    dispatch(loginUser(values,navigate));
  };

  return (
    <div
      className="flex justify-end items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('https://cdn.pixabay.com/photo/2018/03/04/09/51/space-3197611_1280.jpg')",
        objectFit: "cover",
        width: "100%",
        height: "100vh",
      }}
    >
      <div
        className="p-8 rounded-lg shadow-lg max-w-sm w-full bg-stone-400"
        style={{
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
          transformStyle: "preserve-3d",
        }}
      >
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {errorMessage && (
          <div className="text-red-500 text-xs text-center mb-4">
            {errorMessage}
          </div>
        )}

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
            </div>

            <button
              type="submit"
              className="mt-6 w-full py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2"
            >
              Login
            </button>

            <h6
              className="text-center text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg mt-4 cursor-pointer hover:text-gray-900 text-gray-700"
              onClick={() => navigate("/register")}
            >
              New to LuxSpaces? Create an account
            </h6>
          </Form>
        </Formik>
      </div>

      <div
        className="absolute top-12 left-20 p-4 bg-gray-800 text-white rounded-full cursor-pointer hover:bg-gray-900 transition duration-300"
        onClick={() => navigate("/")}
      >
        <FaHome size={24} />
      </div>
    </div>
  );
}

export default Login;

