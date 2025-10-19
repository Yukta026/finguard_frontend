import React from "react";
import {NavLink} from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-indigo-600 p-4 shadow-md flex justify-between">
            <h1 className="text-white font-bold text-xl">FinGuard Portal</h1>
            <div className="space-x-6 mt-4">
                <NavLink to="/" className={({isActive}) =>
                isActive
                 ? "navClass underline font-semibold" : "text-white-600 hover:text-blue-600"}>Dashboard</NavLink>
                 <NavLink to="/predict" className={({isActive}) =>
                isActive
                 ? "navClass underline font-semibold" : "text-white-600 hover:text-blue-600"}>Predict</NavLink>
                
            </div>
        </nav>
    );
};

export default Navbar;