import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import api, { getConfig } from '../services/api';
import CustomAlert from '../components/CustomAlert';
import { Loader, List, PlusCircle } from 'lucide-react';

const InvoiceStatusTag = ({ status }) => {
    let colorClass;
    switch (status) {
        case 'Paid':
            colorClass = 'bg-green-100 text-green-800';
            break;
        case 'Overdue':
            colorClass = 'bg-red-100 text-red-800';
            break;
        case 'Cancelled':
            colorClass = 'bg-gray-100 text-gray-800';
            break;
        case 'Pending':
        default:
            colorClass = 'bg-yellow-100 text-yellow-800';
            break;
    }
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
            {status}
        </span>
    );
};

const InvoiceList = () => {
    const { token, isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        if (!isLoggedIn || !token) { 
            setLoading(false);
            return;
        }
        const fetchInvoices = async () => {
            try {
                const res = await api.get('/invoices', getConfig(token));
                setInvoices(res.data);
            } catch (error) {
                console.error('Failed to fetch invoices:', error.response?.data);
                if (error.response?.status === 401) {
                    setAlertMessage('Your session expired. Please log in again.');
                    logout(); 
                    navigate('/login');
                } else {
                    setAlertMessage('Failed to load invoices. Please ensure the backend is running and you are authorized.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [token, isLoggedIn, logout, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-600">
                <Loader className="animate-spin w-8 h-8 mr-2" /> Loading Invoices...
            </div>
        );
    }

    return (
        <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
            {alertMessage && <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} />}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">All Invoices</h1>
                <Link 
                    to="/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-lg flex items-center transition duration-200"
                >
                    <PlusCircle className="w-4 h-4 mr-2" /> New Invoice
                </Link>
            </div>

            {invoices.length === 0 ? (
                <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg p-10 mt-6">
                    <List className="mx-auto w-10 h-10 mb-3 text-gray-400" />
                    <p className="text-lg">No invoices found for your account.</p>
                    <p className="text-sm mt-2">Click "New Invoice" to create your first one.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total (Rs.)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {invoices.map((invoice) => (
                                <tr key={invoice._id} className="hover:bg-gray-50 transition duration-100 cursor-pointer" onClick={() => navigate(`/invoice/${invoice._id}`)}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <span className="text-blue-600 hover:text-blue-800">{invoice.invoiceNumber || invoice._id.slice(-6)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">
                                        {invoice.totalAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <InvoiceStatusTag status={invoice.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(invoice.issueDate).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default InvoiceList;
