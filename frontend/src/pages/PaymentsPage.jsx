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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (error && payments.length === 0) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded text-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Management</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{payments.length} total payments</p>
                </div>
                <button
                    onClick={loadPayments}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium rounded transition-colors"
                >
                    Refresh
                </button>
            </div>

            <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Student</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Room</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Deadline</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {payments.map((payment) => (
                                <tr key={payment.payment_id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <td className="px-4 py-3">
                                        <div>
                                            <div className="text-sm text-gray-900 dark:text-white">{payment.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{payment.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{payment.room_number || 'N/A'}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">₹{payment.amount}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${payment.status === 'Paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                            }`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                        {new Date(payment.deadline).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        {payment.status === 'Unpaid' ? (
                                            <button
                                                onClick={() => handleUpdatePayment(payment.payment_id, 'Paid')}
                                                disabled={updating === payment.payment_id}
                                                className="px-2 py-1 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 text-xs font-medium rounded transition-colors disabled:opacity-50"
                                            >
                                                {updating === payment.payment_id ? 'Updating...' : 'Mark Paid'}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleUpdatePayment(payment.payment_id, 'Unpaid')}
                                                disabled={updating === payment.payment_id}
                                                className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded transition-colors disabled:opacity-50"
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
