import React, { useState, useEffect } from 'react';
import { fetchPayments, updatePayment } from '../services/api';
import { useDashboardRefresh } from '../context/DashboardRefreshContext';

const PaymentsPage = () => {
    const { triggerDashboardRefresh } = useDashboardRefresh();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        loadPayments();
        const interval = setInterval(loadPayments, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadPayments = async () => {
        try {
            setLoading(true);
            const response = await fetchPayments();
            if (response.data.success) {
                setPayments(response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePayment = async (paymentId, status) => {
        try {
            setUpdating(paymentId);
            const response = await updatePayment(paymentId, status);
            if (response.data.success) {
                await loadPayments();
                triggerDashboardRefresh();
            }
        } catch (err) {
            setError('Failed to update payment');
        } finally {
            setUpdating(null);
        }
    };

    if (loading && payments.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
            </div>
        );
    }

    if (error && payments.length === 0) {
        return (
            <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 p-4 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Management</h2>
                <button
                    onClick={loadPayments}
                    className="px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                    Refresh
                </button>
            </div>

            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase">Student</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase">Room</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase">Deadline</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {payments.map((payment) => (
                                <tr key={payment.payment_id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{payment.name}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">{payment.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{payment.room_number || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">₹{payment.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${payment.status === 'Paid' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                                            }`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        {new Date(payment.deadline).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {payment.status === 'Unpaid' ? (
                                            <button
                                                onClick={() => handleUpdatePayment(payment.payment_id, 'Paid')}
                                                disabled={updating === payment.payment_id}
                                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {updating === payment.payment_id ? 'Updating...' : 'Mark Paid'}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleUpdatePayment(payment.payment_id, 'Unpaid')}
                                                disabled={updating === payment.payment_id}
                                                className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {updating === payment.payment_id ? 'Updating...' : 'Mark Unpaid'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentsPage;
