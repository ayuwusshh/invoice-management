import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';
import api, { getConfig } from '../services/api';
import CustomAlert from '../components/CustomAlert';
import { PlusCircle, Loader } from 'lucide-react';

const InvoiceForm = () => {
    const { token, logout } = useAuth(); 
    const navigate = useNavigate();
    const [customerName, setCustomerName] = useState('');
    // --- START: Added Status State ---
    const [status, setStatus] = useState('Pending'); 
    // --- END: Added Status State ---
    const [items, setItems] = useState([{ description: 'Medicines', quantity: 1, rate: 0 }]);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);

    const availableStatuses = ['Pending', 'Paid', 'Overdue', 'Cancelled'];
    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, rate: 0 }]);
    };
    
    const removeItem = (index) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = items.map((item, i) => {
            if (i === index) {
                const processedValue = (field === 'quantity' || field === 'rate') ? Number(value) : value;
                return { ...item, [field]: processedValue };
            }
            return item;
        });
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.rate || 0)), 0).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            customerName,
            status, 
            items: items.map(item => ({
                ...item,
                quantity: Number(item.quantity),
                rate: Number(item.rate)
            })),
        };

        try {
            const res = await api.post('/invoices', payload, getConfig(token));
            setAlertMessage(`Invoice ${res.data.invoiceNumber || res.data._id.slice(-6)} created successfully!`);
            setCustomerName('');
            setStatus('Pending');
            setItems([{ description: '', quantity: 1, rate: 0 }]);
            
            navigate(`/invoice/${res.data._id}`);
        } catch (error) {
            console.error('Invoice creation failed:', error.response?.data);
            if (error.response?.status === 401) {
                setAlertMessage('Your session expired. Please log in again to create an invoice.');
                logout(); 
                navigate('/login');
            } else {
                setAlertMessage(error.response?.data?.message || 'Failed to create invoice. Check your input and connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center p-4">
            {alertMessage && <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} />}
            <div className="w-full max-w-3xl bg-white shadow-2xl rounded-xl p-6 sm:p-10">
                <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
                    Create New Invoice
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Customer Name Field */}
                        <div>
                            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                                Customer Name
                            </label>
                            <input
                                type="text"
                                id="customerName"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Ayush Singh"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Payment Status
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                required
                            >
                                {availableStatuses.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            Items
                        </label>
                        <div className="hidden sm:grid grid-cols-6 gap-4 text-sm font-medium text-gray-500 mb-2 border-b pb-1">
                            <div className="col-span-3">Description</div>
                            <div className="col-span-1">Quantity</div>
                            <div className="col-span-1">Rate (Rs)</div>
                            <div className="col-span-1 text-right">Amount (Rs)</div>
                        </div>
                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-2 sm:grid-cols-6 gap-4 mb-4 items-center p-4 border border-gray-100 rounded-lg shadow-sm">
                                
                                <div className="col-span-2 sm:col-span-3">
                                    <label htmlFor={`desc-${index}`} className="block text-xs font-medium text-gray-500 sm:hidden mb-1">Description</label>
                                    <input
                                        type="text"
                                        id={`desc-${index}`}
                                        value={item.description}
                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                        placeholder="Description"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`qty-${index}`} className="block text-xs font-medium text-gray-500 sm:hidden mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        id={`qty-${index}`}
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`rate-${index}`} className="block text-xs font-medium text-gray-500 sm:hidden mb-1">Rate (Rs)</label>
                                    <input
                                        type="number"
                                        id={`rate-${index}`}
                                        value={item.rate}
                                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1 flex justify-between items-center sm:block">
                                    <span className="text-right font-bold text-gray-800 text-sm block sm:hidden">
                                        Rs. {(Number(item.quantity || 0) * Number(item.rate || 0)).toFixed(2)}
                                    </span>
                                    <button 
                                        type="button" 
                                        onClick={() => removeItem(index)}
                                        className="text-red-500 hover:text-red-700 text-xs font-medium transition duration-150 ml-2"
                                        title="Remove Item"
                                    >
                                        Remove
                                    </button>
                                    <span className="hidden sm:block text-right font-bold text-gray-800 text-sm">
                                        Rs. {(Number(item.quantity || 0) * Number(item.rate || 0)).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addItem}
                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-2 flex items-center"
                        >
                            <PlusCircle className="w-4 h-4 mr-1" /> Add Another Item
                        </button>
                    </div>

                    <div className="flex justify-end mt-4 mb-6 pt-4 border-t border-gray-200">
                        <p className="text-2xl font-bold text-gray-800">
                            Total: <span className="text-blue-600">Rs. {calculateTotal()}</span>
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md shadow-lg transition duration-200 flex items-center justify-center disabled:opacity-50"
                        disabled={loading || customerName.length === 0 || items.some(i => i.description === '')}
                    >
                        {loading && <Loader className="animate-spin w-5 h-5 mr-2" />}
                        Save Invoice
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InvoiceForm;
