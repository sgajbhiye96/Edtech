import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
export default function Navbar() {
 const { user, logout } = useContext(AuthContext);
 const [menuOpen, setMenuOpen] = useState(false);
 return (
<nav className="bg-gray-900 text-white px-6 py-3">
<div className="flex justify-between items-center">
       {/* Logo */}
<Link to="/" className="flex items-center gap-2">
<img
           src="/logo.jpg"
           alt="InnovationAILabs"
           className="h-10 w-auto object-contain"
         />
</Link>
       {/* Hamburger - mobile only */}
<button
         className="md:hidden text-white focus:outline-none"
         onClick={() => setMenuOpen(!menuOpen)}
>
         {menuOpen ? (
<span className="text-2xl">✕</span>
         ) : (
<span className="text-2xl">☰</span>
         )}
</button>
       {/* Desktop menu */}
<div className="hidden md:flex space-x-6 items-center">
<Link to="/" className="hover:text-gray-300">Home</Link>
<Link to="/courses" className="hover:text-gray-300">Courses</Link>
<Link to="/about" className="hover:text-gray-300">About Us</Link>
         {user ? (
<>
<Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
<button
               onClick={logout}
               className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
>
               Logout
</button>
</>
         ) : (
<>
<Link to="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
               Login
</Link>
<Link to="/register" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
               Register
</Link>
</>
         )}
</div>
</div>
     {/* Mobile menu */}
     {menuOpen && (
<div className="md:hidden flex flex-col space-y-3 mt-4">
<Link to="/" className="hover:text-gray-300" onClick={() => setMenuOpen(false)}>Home</Link>
<Link to="/courses" className="hover:text-gray-300" onClick={() => setMenuOpen(false)}>Courses</Link>
<Link to="/about" className="hover:text-gray-300" onClick={() => setMenuOpen(false)}>About Us</Link>
         {user ? (
<>
<Link to="/dashboard" className="hover:text-gray-300" onClick={() => setMenuOpen(false)}>Dashboard</Link>
<button
               onClick={() => { logout(); setMenuOpen(false); }}
               className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-left"
>
               Logout
</button>
</>
         ) : (
<>
<Link to="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-center" onClick={() => setMenuOpen(false)}>
               Login
</Link>
<Link to="/register" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 text-center" onClick={() => setMenuOpen(false)}>
               Register
</Link>
</>
         )}
</div>
     )}
</nav>
 );
}