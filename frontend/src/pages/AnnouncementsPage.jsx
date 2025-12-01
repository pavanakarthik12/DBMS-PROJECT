import React, { useState, useEffect } from 'react';
import { fetchAnnouncements } from '../services/api';

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await fetchAnnouncements();
            if (response.data && response.data.success) {
                setAnnouncements(response.data.data);
            }
        } catch (err) {
            console.error('Failed to load announcements:', err);
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

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Announcements</h1>
                <p className="text-gray-600 dark:text-gray-400">Important updates and notices</p>
            </div>

            <div className="space-y-6">
                {announcements.map((announcement) => (
                    <div key={announcement.id} className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-8">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{announcement.title}</h2>
                                <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs font-medium">
                                        {announcement.category}
                                    </span>
                                    <span>{new Date(announcement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{announcement.message}</p>
                    </div>
                ))}

                {announcements.length === 0 && (
                    <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No announcements at this time</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnouncementsPage;
