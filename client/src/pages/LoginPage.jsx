import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';
import api from '../services/api';
import { Loader } from 'lucide-react';

const LoginPage = () => {
    const { isLoggedIn, login } = useAuth();
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (isLoggedIn) {
        return <Navigate to="/list" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const endpoint = isRegister ? 'register' : 'login';
        const body = { email, password };
        if (isRegister) body.name = name;

        try {
            const res = await api.post(`/auth/${endpoint}`, body);
            
            const { token: jwtToken, name: userName, email: userEmail, _id: userId } = res.data;
            if (jwtToken) {
                login(jwtToken, { name: userName, email: userEmail, id: userId });
                navigate('/list');
            } else {
                 setError('Login/Registration successful but token missing.');
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Check server console.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center p-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    {isRegister ? 'Register Account' : 'Login'}
                </h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md shadow-lg transition duration-200 flex items-center justify-center disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading && <Loader className="animate-spin w-5 h-5 mr-2" />}
                        {isRegister ? 'Register' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
