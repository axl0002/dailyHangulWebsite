"use client";

import { useState } from 'react';

import ReferralChart from "../components/ReferralChart";
import HSKLevelChart from "../components/HSKLevelChart";
import ReasonChart from "../components/ReasonChart";
import TimezoneChart from "../components/TimezoneChart";
import CategoryChart from "../components/CategoryChart";

export default function AdminDashboard() {
    const [filter, setFilter] = useState<'all' | 'true' | 'false'>('all');

    return (
        <div className="p-6">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Overview of Daily Hanzi performance and user metrics.</p>
                </div>

                <div className="flex flex-col items-end">
                    <div className="bg-white p-1 rounded-lg border border-gray-200 flex shadow-sm">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            All Users
                        </button>
                        <button
                            onClick={() => setFilter('true')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === 'true' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Pro Users
                        </button>
                        <button
                            onClick={() => setFilter('false')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === 'false' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Free Users
                        </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-400 text-right">
                        <p><span className="font-medium text-gray-500">Pro Users:</span> Everyone who passed the paywall</p>
                        <p><span className="font-medium text-gray-500">Free Users:</span> Everyone who did not pass the paywall</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Analytics Section */}
                <ReferralChart filter={filter} />
                <HSKLevelChart filter={filter} />
                <ReasonChart filter={filter} />
                <TimezoneChart filter={filter} />
                <CategoryChart filter={filter} />
            </div>
        </div>
    );
}
