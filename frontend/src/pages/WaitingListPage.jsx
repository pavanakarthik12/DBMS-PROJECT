import React, { useState, useEffect } from 'react';
import { fetchWaitingList } from '../services/api';

const WaitingListPage = () => {
    const [waitingList, setWaitingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadWaitingList();
        const interval = setInterval(loadWaitingList, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadWaitingList = async () => {
        try {
            setLoading(true);
            const response = await fetchWaitingList();
            if (response.data.success) {
                setWaitingList(response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Failed to load waiting list');
        } finally {
            setLoading(false);
        }
    };

    if (loading && waitingList.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (error && waitingList.length === 0) {
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
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Waiting List</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{waitingList.length} people waiting</p>
                </div>
                <button
                    onClick={loadWaitingList}
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
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Phone</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Join Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {waitingList.map((person) => (
                                <tr key={person.waiting_id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{person.student_name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{person.phone}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                        {new Date(person.join_date).toLocaleDateString()}
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

export default WaitingListPage;
