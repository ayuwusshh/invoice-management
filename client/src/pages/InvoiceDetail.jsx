import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';
import api, { getConfig } from '../services/api';
import CustomAlert from '../components/CustomAlert';
import { Loader } from 'lucide-react';

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

const InvoiceDetail = () => {
    const { token, logout } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get(`/invoices/${id}`, getConfig(token));
                setInvoice(res.data);
            } catch (error) {
                console.error('Failed to fetch invoice:', error.response?.data);
                if (error.response?.status === 401) {
                    setAlertMessage('Your session expired. Please log in again to view this invoice.');
                    logout(); 
                    navigate('/login'); 
                } else {
                    setAlertMessage(error.response?.data?.message || 'Invoice not found or unauthorized.');
                    setInvoice(null);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [id, token, logout, navigate]); 

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-600">
                <Loader className="animate-spin w-8 h-8 mr-2" /> Loading Invoice Details...
            </div>
        );
    }

    if (alertMessage) {
        return (
            <div className="bg-white shadow-xl rounded-lg p-8">
                <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} />
                <p className="text-center text-red-600 font-semibold">{alertMessage}</p>
                <div className="text-center mt-4">
                    <Link to="/list" className="text-blue-600 hover:underline">Go back to Invoice List</Link>
                </div>
            </div>
        );
    }
    
    if (!invoice) return null;

    return (
        <div className="flex justify-center p-4">
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-8 space-y-8">
                
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-blue-600">INVOICE</h1>
                        <p className="text-sm text-gray-500 mt-1">Invoice ID: {invoice.invoiceNumber || invoice._id}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-semibold text-gray-800">Invoice Manager Co.</p>
                        <p className="text-sm text-gray-600"></p>
                    </div>
                </div>

                {/* Billing Details & Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h2 className="font-bold text-gray-700 mb-1">Billed To:</h2>
                        <p className="text-gray-900 font-medium">{invoice.customerName}</p>
                        <p className="text-gray-600"></p>
                    </div>
                    <div className="text-right space-y-1">
                        <p><span className="font-bold">Date Issued:</span> {new Date(invoice.issueDate).toLocaleDateString()}</p>
                        <p><span className="font-bold">Status:</span> <InvoiceStatusTag status={invoice.status} /></p>
                    </div>
                </div>
                
                {/* Items Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rate (Rs)</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (Rs)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {invoice.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{item.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{Number(item.rate).toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">{(item.quantity * item.rate).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="flex justify-end">
                    <div className="w-full max-w-xs space-y-2 pt-4">
                        <div className="flex justify-between font-medium text-gray-700">
                            <span>Subtotal:</span>
                            <span>Rs. {(invoice.totalAmount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-xl border-t border-gray-300 pt-2">
                            <span className="text-gray-800">TOTAL DUE:</span>
                            <span className="text-blue-600">Rs. {invoice.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>                
            </div>
        </div>
    );
};

export default InvoiceDetail;
