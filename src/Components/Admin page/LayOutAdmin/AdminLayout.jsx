import React from 'react'

import { Outlet } from 'react-router-dom'
// import SideBar from '../sideBar'
// import AdminNavbar from '../adminNavBar/adminNavbar'
import SideBar from '../sideBar/sideBar'



function AdminLayout() {
  return (
<>
<SideBar/>
<Outlet/>

</>
  )
}

export default AdminLayout