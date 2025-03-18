import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../Redux/Slice";



function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.app.errorMessage);

  // Validation using Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const handleSubmit = (values, { resetForm }) => {
    dispatch(registerUser(values, navigate));
    resetForm();
  };

  return (
    <div
      className="flex justify-end items-center min-h-screen bg-gray-100 bg-[url('https://cdn.pixabay.com/photo/2018/03/04/09/51/space-3197611_1280.jpg')] bg-cover bg-center"
      style={{ objectFit: "contain" }}
    >
      <div className="p-8 rounded-lg shadow-lg max-w-sm w-full bg-stone-400">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

        {errorMessage && <div className="text-red-500 text-xs text-center mb-4">{errorMessage}</div>}

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-xs" />
            </div>

            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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

            <div className="mt-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs" />
            </div>

            <button
              type="submit"
              className="mt-6 w-full py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              Register
            </button>

            <h6
              className="text-center text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg mt-4 cursor-pointer hover:text-gray-900 text-gray-700"
              onClick={() => navigate("/login")}
            >
              Existing User? Log in
            </h6>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default Register;

