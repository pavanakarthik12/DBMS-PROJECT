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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
            </div>
        );
    }

    if (error && waitingList.length === 0) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-6 py-4 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Waiting List</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{waitingList.length} people waiting</p>
                </div>
                <button
                    onClick={loadWaitingList}
                    className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium rounded-md transition-colors"
                >
                    Refresh
                </button>
            </div>

            <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-border-light dark:border-border-dark">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Join Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {waitingList.map((person) => (
                                <tr key={person.waiting_id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{person.student_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{person.phone}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
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
