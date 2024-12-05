import { useState } from 'react'
import './App.css'
import axios from 'axios'
import Login_pages from './Components/Login/Login_pages'
import Register from './Components/Login/Register'
import Home_page from './Components/Home/Home_page'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
// import Navbar from './Components/Home/navbar'
import 'react-toastify/dist/ReactToastify.css';
import Cart from './Components/Home/Cart'
import Wishlist from './Components/Home/Wishlist'
import MyOrder from './Components/Home/MyOrder'
import Layout from './Components/Layout/Layout'
import Details from './Components/ItemDetails/Details'
import Context from './Components/Context/Context'
import Order from './Components/MyOrderdetails.jsx/Order'

import AdminLayout from './Components/Admin page/LayOutAdmin/AdminLayout'
import SideBar from './Components/Admin page/sideBar/sideBar'
import DashBoard from './Components/Admin page/dashBoard/DashBoard'
import AdminUsers from './Components/Admin page/adminUsers/AdminUsers'
import AdminOrder from './Components/Admin page/adminOrder/adminOrder'
import AdminProducts from './Components/Admin page/AdminProducts/AdminProducts'
import Blocks from './Components/Admin page/adminBlocks/Blocks'
import AdminContext from './Components/Admin page/adminUsers/AdminContext/AdminContext'



function App() {


  return (
    <Router>
            <Context>

        <AdminContext>

        <ToastContainer />
        <Routes>
          <Route path={'/'} element={<Layout />}>
            <Route index element={<Home_page />} />
           
            <Route path={'/cart'} element={<Cart />} />
            <Route path={'/wishlist'} element={<Wishlist />} />
            <Route path={'/details/:furnitureId'} element={<Details />} />
          </Route>
          <Route path={"/login"} element={<Login_pages />} />
          <Route path={"/register"} element={<Register />} />
          <Route path={'/order'} element={<Order />} />
          <Route path={'/myorders'} element={<MyOrder />} />
          <Route path={'/adminnavbar'} element={<adminNavbar />} />
          <Route path={'/sidebar'} element={<SideBar />} />

          <Route path={'/adminlayout'} element={<AdminLayout />}>
            <Route index element={<DashBoard />} />
            <Route path={'adminusers'} element={<AdminUsers />} />
            <Route path={'adminorder'} element={<AdminOrder />} />
            <Route path={'adminproducts'} element={<AdminProducts />} />
            <Route path={'blocks'} element={<Blocks />} />

          </Route>





        </Routes>

      </AdminContext>
      </Context>

    </Router>

  )
}

export default App


