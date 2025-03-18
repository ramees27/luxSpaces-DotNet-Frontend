import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaPlus, FaMoneyBillWave, FaTrash } from "react-icons/fa";
import api from "../../../Api/api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AddressSelection = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const Price = useSelector((state) => state.app.cart.totalPrice)
    console.log(Price)

    
    const location = useLocation();


    const navigate = useNavigate();

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await api.get("api/Address/get-address");
                if (response.status === 200) {
                    setAddresses(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching addresses:", error);
            }
        };

        fetchAddresses();
    }, []);
    

    const handleSelect = (address) => {
        setSelectedAddressId(address.addressId);
        console.log(selectedAddressId)
        

    };

    const handlePayment = async () => {
        console.log("Price before sending API request:", Price);

        try {
            const response = await api.post(`/api/Order/create-orderRazorPay?price=${Price}`);
            if (response.data.statusCode === 200) {
                const orderId = response.data.data; 

                console.log("Order Created, ID:", orderId);

        
                if (typeof window.Razorpay === "undefined") {
                    console.error("Razorpay script not loaded.");
                    toast.error("Payment gateway not available.", {
                        position: "top-center",
                        autoClose: 2000,
                    });
                    return;
                }

                const options = {
                    key: "rzp_test_NYZKuDYxfrQMlN",
                    amount: Price * 100, 
                    currency: "INR",
                    name: "Lux Spaces",
                    description: "Furniture Purchase",
                    order_id: orderId,
                    handler: async function (paymentResponse) {

                        toast.success("Payment Successful!", {
                            position: "top-center",
                            autoClose: 2000,
                        });

                        if (!paymentResponse.razorpay_payment_id ||
                            !paymentResponse.razorpay_order_id ||
                            !paymentResponse.razorpay_signature) {
                            toast.error("Incomplete payment details received.", {
                                position: "top-center",
                                autoClose: 2000,
                            });
                            return;
                        }

                  
                        await verifyPayment(paymentResponse);
                    },
                    prefill: {
                        name: "Customer Name",
                        email: "customer@example.com",
                        contact: "9999999999"
                    },
                    theme: {
                        color: "#3399cc"
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                toast.error(response.data.message, {
                    position: "top-center",
                    autoClose: 2000,
                });
            }
        } catch (error) {
            console.error("Payment API Failed", error);
            toast.error("Failed to create order.", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const verifyPayment = async (paymentResponse) => {
        try {
            const verificationResponse = await api.post("/api/Order/payment", {
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (verificationResponse.data.data) {
                toast.success("Payment Verified! Placing order...", {
                    position: "top-center",
                    autoClose: 2000,
                });

        
                await placeOrder(paymentResponse.razorpay_payment_id);

            }
        } catch (error) {
            console.error("Payment Verification API Failed", error);
            toast.error("Payment verification failed.", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const placeOrder = async (transactionId) => {
        try {
            
            const createOrderDTO = {
                addressId: selectedAddressId, 
                totalamount: Price, 
                transactionId: transactionId
          
            };


            const orderResponse = await api.post("/api/Order/create-order", createOrderDTO);


            if (orderResponse.status === 200) {
                toast.success("Order Placed Successfully!", {
                    position: "top-center",
                    autoClose: 2000,
                });


                navigate("/myorders");
            }
        } catch (error) {
            console.error("Order API Failed", error);
            toast.error(error.response?.data?.message || "Order placement failed.", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    }

    const handleDeleteAddress = async (e, addressId) => {
        e.stopPropagation();
         try {
          const response = await api.delete(`/api/Address/delete-address/${addressId}`);
          setAddresses((prev) => prev.filter((addr) => addr.addressId !== addressId));
          if (response.data.statusCode === 200) {
            toast.success("Address deleted successfully");
          
          } else {
            toast.error(response.data.message);
          }
          
        } catch (error) {
          console.error("Error deleting address:", error);
          toast.error("Failed to delete address");
        }
    
      };



      return (
        <div className="max-w-6xl mx-auto h-screen flex justify-between gap-6 p-8">

          <div className="bg-stone-300 text-black p-6 rounded-2xl shadow-lg flex flex-col justify-between h-full w-1/3">
            <h2 className="text-xl font-bold">Order Summary</h2>
      
          
            <div className="text-lg font-semibold">
              Total Price: <span className="text-black">₹{Price}</span>
            </div>
      
        
            <button
              onClick={() => navigate("/cart")}
              className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg shadow 
                        hover:bg-red-600 transition duration-300 transform hover:scale-105"
            >
              Cancel Order
            </button>
          </div>
      
        
          <div className="w-2/3 bg-white p-8 rounded-2xl shadow-2xl flex flex-col h-full">
          
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Select an Address</h2>
      
    
            <div className="flex-grow overflow-auto">
              {addresses.length === 0 ? (
                <p className="text-gray-500 text-center text-lg">No addresses found. Please add one.</p>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.addressId}
                      className={`p-5 border rounded-xl transition duration-300 cursor-pointer shadow-sm 
                        ${selectedAddressId === address.addressId
                          ? "border-blue-500 bg-blue-50 shadow-lg"
                          : "border-gray-300 hover:border-blue-400 bg-gray-50 hover:shadow-md"
                        }`}
                      onClick={() => handleSelect(address)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{address.name || "No Name"}</h3>
                          <p className="text-gray-600">{address.street}, {address.city}</p>
                          <p className="text-gray-600">{address.state} - {address.postalCode}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          {selectedAddressId === address.addressId && <FaCheckCircle size={28} className="text-blue-500" />}
                          <FaTrash
                            size={22}
                            className="text-red-500 hover:text-red-700 cursor-pointer transition transform hover:scale-110"
                            onClick={(e) => handleDeleteAddress(e, address.addressId)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
      
        
            <div className="flex justify-between mt-6">
        
              <button
                onClick={() => navigate("/order")}
                className="flex items-center bg-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105"
              >
                <FaPlus className="mr-2" /> Add Address
              </button>
      
            
              <button
                onClick={handlePayment}
                className={`flex items-center px-6 py-3 rounded-xl shadow-md transition duration-300 transform 
                  ${selectedAddressId
                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                disabled={!selectedAddressId}
              >
                <FaMoneyBillWave className="mr-2" /> Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      );
      
    };

export default AddressSelection;
