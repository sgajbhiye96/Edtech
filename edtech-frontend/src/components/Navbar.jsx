import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        InnovationAILabs
      </Link>


      <div className="space-x-6 flex items-center">

        <Link to="/" className="hover:text-gray-300">
          Home
        </Link>


        <Link to="/courses" className="hover:text-gray-300">
          Courses
        </Link>
        
        <Link to="/about" className="hover:text-gray-300">
        About Us
        </Link>


        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>

            <button
              onClick={logout}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}

        {/* ✅ Dark Mode Toggle Added */}
        {/* <DarkModeToggle /> */}

      </div>
    </nav>
  );
}