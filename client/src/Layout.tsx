import { Outlet } from "react-router-dom";
import Navbar from './components/Navbar';  // Import your Navbar component

const Layout = () => {
    return (
        <div className='w-full min-h-screen p-4 md:p-2 pt-0 flex flex-col bg-gradient-to-br from-white to-slate-200'>
            {/* Navbar remains at the top */}
            <Navbar />

            {/* Outlet will render the current route's component */}
            <Outlet />
        </div>
    );
};

export default Layout;