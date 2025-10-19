import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';
import { List, PlusCircle, LogIn, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { isLoggedIn, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-blue-600 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                <Link to="/" className="text-white text-xl font-bold tracking-wider flex items-center">
                    <List className="mr-2 w-6 h-6" /> Invoice Manager
                </Link>
                
                <nav className="flex items-center space-x-4">
                    {isLoggedIn && (
                        <>
                            <Link to="/list" className="hidden sm:flex text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                                <List className="w-4 h-4 mr-1" /> All Invoices
                            </Link>
                            <Link to="/create" className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition duration-150 flex items-center">
                                <PlusCircle className="w-4 h-4 mr-1" /> Create Invoice
                            </Link>
                            <div className="text-white text-sm font-medium hidden md:flex items-center">
                                <User className="w-4 h-4 mr-1" /> {user?.name.split(' ')[0] || 'User'}
                            </div>
                        </>
                    )}
                    
                    {isLoggedIn ? (
                        <button 
                            onClick={handleLogout}
                            className="border border-white bg-white text-blue-600 hover:bg-blue-50 ml-4 px-3 py-1.5 rounded-md text-sm font-semibold transition duration-200 flex items-center shadow-md"
                        >
                            <LogOut className="w-4 h-4 mr-1" /> Logout
                        </button>
                    ) : (
                        <Link 
                            to="/login"
                            className="border border-white text-white hover:bg-white hover:text-blue-600 ml-4 px-3 py-1.5 rounded-md text-sm font-semibold transition duration-200 flex items-center shadow-md"
                        >
                            <LogIn className="w-4 h-4 mr-1" /> Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
