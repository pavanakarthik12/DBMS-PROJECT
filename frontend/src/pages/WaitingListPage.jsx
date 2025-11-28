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
                setError(response.data.message);
            }
        } catch (err) {
            setError('Failed to load waiting list');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Waiting List</h2>
                <button
                    onClick={loadWaitingList}
                    className="px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                    Refresh
                </button>
            </div>

            <div className="bg-surface-dark border border-gray-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Join Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {waitingList.map((person) => (
                                <tr key={person.waiting_id} className="hover:bg-gray-800">
                                    <td className="px-6 py-4 text-sm font-medium text-white">{person.student_name}</td>
                                    <td className="px-6 py-4 text-sm text-white">{person.phone}</td>
                                    <td className="px-6 py-4 text-sm text-white">
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
