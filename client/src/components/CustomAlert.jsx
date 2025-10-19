import React from 'react';
import { AlertTriangle } from 'lucide-react';

const CustomAlert = ({ message, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full transform transition-all scale-100">
            <div className="text-center">
                <AlertTriangle className="mx-auto h-10 w-10 text-yellow-500" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Notification</h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-500">{message}</p>
                </div>
                <div className="mt-4">
                    <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default CustomAlert;