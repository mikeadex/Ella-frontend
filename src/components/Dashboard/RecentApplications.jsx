import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import {
  BriefcaseIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const statusColors = {
  applied: 'bg-blue-50 text-blue-700 ring-blue-600/10',
  screening: 'bg-yellow-50 text-yellow-700 ring-yellow-600/10',
  interview: 'bg-purple-50 text-purple-700 ring-purple-600/10',
  offer: 'bg-green-50 text-green-700 ring-green-600/10',
  accepted: 'bg-indigo-50 text-indigo-700 ring-indigo-600/10',
  rejected: 'bg-red-50 text-red-700 ring-red-600/10',
  withdrawn: 'bg-gray-50 text-gray-700 ring-gray-600/10',
};

const RecentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/jobstract/applications/?page_size=5');
      setApplications(response.data.results || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-black/80 backdrop-blur-[50px] rounded-xl border border-gray-200 dark:border-[#1d1d1f] p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-[#1d1d1f] rounded w-1/4 mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-[#1d1d1f] rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-black/80 backdrop-blur-[50px] rounded-xl border border-gray-200 dark:border-[#1d1d1f] p-6">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black/80 backdrop-blur-[50px] rounded-xl border border-gray-200 dark:border-[#1d1d1f] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
          Recent Applications
        </h2>
        <Link
          to="/applications"
          className="text-sm text-[#06c] dark:text-[#2997ff] hover:underline flex items-center"
        >
          View all
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-6">
          <BriefcaseIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No applications yet
          </p>
          <Link
            to="/jobs"
            className="text-sm text-[#06c] dark:text-[#2997ff] hover:underline"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-black/40"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-sm font-medium text-[#1d1d1f] dark:text-white truncate">
                    {application.opportunity.title}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      statusColors[application.status]
                    }`}
                  >
                    {application.status_display}
                  </span>
                </div>
                <div className="mt-1 flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                    {application.opportunity.employer.employer_name}
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {formatDate(application.applied_date)}
                  </div>
                </div>
              </div>
              <Link
                to="/applications"
                className="ml-4 flex-shrink-0 text-[#06c] dark:text-[#2997ff]"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentApplications;
