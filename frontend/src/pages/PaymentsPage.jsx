import React, { useState, useEffect } from 'react';
import { fetchPayments } from '../services/api';

const PaymentsPage = () => {
    // const { user } = useAuth(); // Unused
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, paid, pending, overdue

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        try {
            setLoading(true);
            const response = await fetchPayments();
            if (response.data && response.data.success) {
                setPayments(response.data.data);
            } else {
                setError('Failed to load payments');
            }
        } catch (err) {
            setError('Failed to load payments data');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            case 'pending':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
            case 'overdue':
                return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            default:
                return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400';
        }
    };

    const filteredPayments = payments.filter(payment => {
        if (filter === 'all') return true;
        return payment.status.toLowerCase() === filter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Payments</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage fees and payment history</p>
                </div>
                <div className="flex items-center space-x-2 bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-1">
                    {['all', 'paid', 'pending', 'overdue'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-sm font-medium rounded transition-colors capitalize ${filter === f
                                ? 'bg-accent text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Paid</div>
                    <div className="text-3xl font-semibold text-gray-900 dark:text-white">
                        ₹{payments.filter(p => p.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </div>
                </div>
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Pending Amount</div>
                    <div className="text-3xl font-semibold text-gray-900 dark:text-white">
                        ₹{payments.filter(p => p.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </div>
                </div>
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Overdue Amount</div>
                    <div className="text-3xl font-semibold text-red-600 dark:text-red-400">
                        ₹{payments.filter(p => p.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {filteredPayments.map((payment) => (
                                <tr key={payment.payment_id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                        {payment.student_name || 'N/A'}
                                        <div className="text-xs text-gray-500 font-normal">{payment.room_number ? `Room ${payment.room_number}` : ''}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">₹{payment.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(payment.payment_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 capitalize">{payment.payment_type || 'Fee'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-accent hover:text-accent-hover text-sm font-medium transition-colors">
                                            View Receipt
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredPayments.length === 0 && (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        No payments found
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentsPage;
