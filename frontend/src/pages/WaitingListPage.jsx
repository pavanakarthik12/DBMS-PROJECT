import React, { useState, useEffect } from 'react';
import { fetchWaitingList } from '../services/api';

const WaitingListPage = () => {
    const [waitingList, setWaitingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadWaitingList();
    }, []);

    const loadWaitingList = async () => {
        try {
            setLoading(true);
            const response = await fetchWaitingList();
            if (response.data.success) {
                setWaitingList(response.data.data);
            } else {
                setError('Failed to load waiting list');
            }
        } catch (err) {
            setError('Failed to load waiting list data');
        } finally {
            setLoading(false);
        }
    };

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
            <div>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Waiting List</h1>
                <p className="text-gray-600 dark:text-gray-400">Students waiting for room allocation</p>
            </div>

            <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                                <th className="px-8 py-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Position</th>
                                <th className="px-8 py-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                                <th className="px-8 py-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="px-8 py-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date Added</th>
                                <th className="px-8 py-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {waitingList.map((item, index) => (
                                <tr key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-gray-900 dark:text-white">{item.student_name}</td>
                                    <td className="px-8 py-5 text-sm text-gray-500 dark:text-gray-400">{item.email}</td>
                                    <td className="px-8 py-5 text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                                            Waiting
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {waitingList.length === 0 && (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        Waiting list is currently empty
                    </div>
                )}
            </div>
        </div>
    );
};

export default WaitingListPage;
