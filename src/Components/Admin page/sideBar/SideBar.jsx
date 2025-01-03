 
import { FaHome, FaShoppingCart, FaBoxOpen, FaUsers, FaBan } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate,Link } from 'react-router-dom';
import { setLogout } from '../../Redux/Slice';
import { toast } from 'react-toastify';


function SideBar() {
  const navigate=useNavigate();

const dispatch=useDispatch()
  const handleLogout = () => {
   dispatch(setLogout()); // Dispatch logout action
    navigate('/login'); // Redirect to login page
    toast.success('You successfully logged out', {
      position: 'top-center',
      autoClose: 2000,
    });
  };

  return (
    <div className="flex select-none">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-800 to-gray-700 text-white shadow-xl border-r border-gray-600 transform-style-3d">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 shadow-inner">
          <h1 className="text-xl font-bold text-white">LuxSpaces Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Admin Name: Admin</p>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <ul>
            <Link to={"/adminlayout"}>
            <li className="group">
              <div
                className="flex items-center gap-4 px-6 py-3 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 rounded-lg shadow-md transition-all transform hover:translate-x-1 hover:shadow-lg"
              >
                <FaHome size={20} />
                <span>Home</span>
                </div>
            </li>
            </Link>
          <Link to={'/adminlayout/adminorder'}> 
           <li className="group mt-3">
              <div
                className="flex items-center gap-4 px-6 py-3 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 rounded-lg shadow-md transition-all transform hover:translate-x-1 hover:shadow-lg"
              >
                <FaShoppingCart size={20} />
                <span>Orders</span>
              </div>
            </li>
            </Link>
            <Link to={'/adminlayout/adminproducts'}> 
            
            <li className="group mt-3">
             <div
                className="flex items-center gap-4 px-6 py-3 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 rounded-lg shadow-md transition-all transform hover:translate-x-1 hover:shadow-lg"
              >
                <FaBoxOpen size={20} />
                <span>Products</span>
                </div>
            </li>
            </Link>
            <Link to={'/adminlayout/adminusers'}>
            <li className="group mt-3">
              <div
                className="flex items-center gap-4 px-6 py-3 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 rounded-lg shadow-md transition-all transform hover:translate-x-1 hover:shadow-lg"
              >
                <FaUsers size={20} />
                <span>Users</span>
              </div>
            </li>
            </Link>
            <Link to={'/adminlayout/blocks'}>
            <li className="group mt-3">
            <div
                className="flex items-center gap-4 px-6 py-3 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 rounded-lg shadow-md transition-all transform hover:translate-x-1 hover:shadow-lg"
              >  
                <FaBan size={20} />
                <span>Blocks</span>
                </div> 
            </li>
            </Link>
            <button 
             onClick={handleLogout} 
             className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg  transition duration-200 ease-in-out mt-44">
             Logout
             </button>
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export default SideBar;
