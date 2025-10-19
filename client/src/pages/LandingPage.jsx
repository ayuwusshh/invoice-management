import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';
import { Home, List, PlusCircle, AlertTriangle } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:scale-[1.02] text-center">
        <div className="flex justify-center mb-3">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);

const LandingPage = () => {
    const { isLoggedIn } = useAuth();
    if (isLoggedIn) {
        return <Navigate to="/list" replace />;
    }

    return (
        <div className="space-y-12 py-16">
            <div className="text-center py-16 bg-white rounded-xl shadow-2xl">
                <Home className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                    Welcome to <span className="text-blue-600">Invoice Manager</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    Your secure platform for creating, tracking, and managing professional invoices with ease.
                </p>
                <Link
                    to="/login"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg transition duration-300 transform hover:scale-105"
                >
                    Get Started / Login
                </Link>
            </div>

            <div className="pt-8">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                    Features Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<PlusCircle className="text-blue-600 w-8 h-8" />}
                        title="Easy Creation"
                        description="Generate detailed invoices instantly with automatic total calculations."
                    />
                    <FeatureCard
                        icon={<List className="text-blue-600 w-8 h-8" />}
                        title="Seamless Tracking"
                        description="Keep a real-time list of all your invoices and their payment status."
                    />
                    <FeatureCard
                        icon={<AlertTriangle className="text-blue-600 w-8 h-8" />}
                        title="Secure & Reliable"
                        description="Data is secured on MongoDB with authentication managed via JWTs."
                    />
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
