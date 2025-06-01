import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut, UserPlus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userName }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem("auth-token"); // ✅ Remove token from storage
        navigate("/");
    }
    const authToken = localStorage.getItem("auth-token");
    return (
        <nav className="bg-blue-600 text-white p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* ✅ Brand Logo */}
                <Link to="/" className="text-2xl font-bold flex items-center">
                    💰 Digital Wallet
                </Link>

                {/* ✅ Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden focus:outline-none"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* ✅ Navigation Links (Desktop) */}
                <div className="hidden md:flex space-x-6">
                    <Link to="/" className="hover:text-gray-200">Home</Link>
                    <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
                </div>

                {/* ✅ User Dropdown Menu */}
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        <User className="w-6 h-6" />
                        <span className="hidden md:inline">{ }</span>
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg w-40 py-2">
                            {authToken ?
                                <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 hover:bg-gray-200">
                                    <LogOut className="w-5 h-5 mr-2" /> Logout
                                </button> : <button onClick={() => navigate('/register')} className="flex items-center w-full px-4 py-2 hover:bg-gray-200">
                                    <UserPlus className="w-5 h-5 mr-2" /> Register
                                </button>}

                        </div>
                    )}
                </div>
            </div>

            {/* ✅ Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-blue-500 text-white p-4">
                    <Link to="/" className="block py-2">Home</Link>
                    <Link to="/dashboard" className="block py-2">Dashboard</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
