import React, { useState, useEffect } from 'react';
import { fetchWaitingList } from '../services/api';

const WaitingListPage = () => {
    const [waitingList, setWaitingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [newStudent, setNewStudent] = useState({
        student_name: '',
        phone: '',
        branch: '',
        year_of_study: '',
        notes: ''
    });

    useEffect(() => {
        loadWaitingList();
    }, []);

    const sampleWaitingList = [
        { id: 1, name: 'Alex Johnson', email: 'alex.johnson@college.edu', phone: '9876543210', position: 1, applied_date: '2024-11-20' },
        { id: 2, name: 'Sarah Mitchell', email: 'sarah.mitchell@college.edu', phone: '9876543211', position: 2, applied_date: '2024-11-21' },
        { id: 3, name: 'David Chen', email: 'david.chen@college.edu', phone: '9876543212', position: 3, applied_date: '2024-11-22' },
        { id: 4, name: 'Emma Rodriguez', email: 'emma.rodriguez@college.edu', phone: '9876543213', position: 4, applied_date: '2024-11-23' },
        { id: 5, name: 'Michael Thompson', email: 'michael.thompson@college.edu', phone: '9876543214', position: 5, applied_date: '2024-11-24' }
    ];

    const loadWaitingList = async () => {
        try {
            setLoading(true);
            setWaitingList(sampleWaitingList);

            const response = await fetchWaitingList();
            if (response.data.success && response.data.data.length > 0) {
                setWaitingList(response.data.data);
            }
        } catch (err) {
            console.log('Backend not available, using sample data');
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



    const handleInputChange = (e) => {
        setNewStudent({
            ...newStudent,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/api/waiting-list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newStudent,
                    join_date: new Date().toISOString().split('T')[0]
                }),
            });
            const data = await response.json();
            if (data.success) {
                alert('Added to waiting list successfully');
                setNewStudent({ student_name: '', phone: '', branch: '', year_of_study: '', notes: '' });
                loadWaitingList();
            } else {
                alert('Failed to add: ' + data.message);
            }
        } catch (error) {
            console.error('Error adding to waiting list:', error);
            alert('Error adding to waiting list');
        }
    };

    return (
        <div className="p-8 space-y-12">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Waiting List</h1>
                    <p className="text-xl text-gray-700 dark:text-gray-300">Students waiting for room allocation</p>
                </div>
            </div>

            {/* Add New Student Form */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add to Waiting List</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input
                            type="text"
                            name="student_name"
                            value={newStudent.student_name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={newStudent.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Branch</label>
                        <select
                            name="branch"
                            value={newStudent.branch}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        >
                            <option value="">Select Branch</option>
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="MECH">MECH</option>
                            <option value="CIVIL">CIVIL</option>
                            <option value="EEE">EEE</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                        <select
                            name="year_of_study"
                            value={newStudent.year_of_study}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        >
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                        <input
                            type="text"
                            name="notes"
                            value={newStudent.notes || ''}
                            onChange={handleInputChange}
                            placeholder="Optional"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Add Student
                    </button>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
                                <th className="px-8 py-6 font-bold text-gray-900 dark:text-white uppercase tracking-wider">Position</th>
                                <th className="px-8 py-6 font-bold text-gray-900 dark:text-white uppercase tracking-wider">Student Name</th>
                                <th className="px-8 py-6 font-bold text-gray-900 dark:text-white uppercase tracking-wider">Details</th>
                                <th className="px-8 py-6 font-bold text-gray-900 dark:text-white uppercase tracking-wider">Notes</th>
                                <th className="px-8 py-6 font-bold text-gray-900 dark:text-white uppercase tracking-wider">Date Added</th>
                                <th className="px-8 py-6 font-bold text-gray-900 dark:text-white uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
                            {waitingList.map((item, index) => (
                                <tr key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td className="px-8 py-6">
                                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                                            {item.position || index + 1}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-semibold text-gray-900 dark:text-white">{item.name || item.student_name}</div>
                                        <div className="text-sm text-gray-500">{item.phone}</div>
                                    </td>
                                    <td className="px-8 py-6 text-gray-700 dark:text-gray-300">
                                        {item.branch && item.year_of_study ? (
                                            <span>{item.branch} - Year {item.year_of_study}</span>
                                        ) : (
                                            <span className="text-gray-400 italic">Not provided</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-gray-700 dark:text-gray-300">
                                        {item.notes || <span className="text-gray-400 italic">None</span>}
                                    </td>
                                    <td className="px-8 py-6 text-gray-700 dark:text-gray-300">
                                        {new Date(item.applied_date || item.join_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-4 py-2 font-bold rounded bg-orange-600 text-white">
                                            Waiting
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {waitingList.length === 0 && (
                    <div className="p-16 text-center text-gray-700 dark:text-gray-300">
                        <h3 className="text-2xl font-bold mb-2">No Students in Waiting List</h3>
                        <p>All rooms are currently allocated</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WaitingListPage;
