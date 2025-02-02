import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import {
  CalendarIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ClockIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const statusColors = {
  applied: 'bg-blue-50 text-blue-700 ring-blue-600/10',
  screening: 'bg-yellow-50 text-yellow-700 ring-yellow-600/10',
  interview: 'bg-purple-50 text-purple-700 ring-purple-600/10',
  offer: 'bg-green-50 text-green-700 ring-green-600/10',
  accepted: 'bg-indigo-50 text-indigo-700 ring-indigo-600/10',
  rejected: 'bg-red-50 text-red-700 ring-red-600/10',
  withdrawn: 'bg-gray-50 text-gray-700 ring-gray-600/10',
};

const ApplicationsList = () => {
  const { isDark } = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/jobstract/applications/');
      setApplications(response.data.results || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch applications. Please try again later.');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await axios.post(`/api/jobstract/applications/${applicationId}/update_status/`, {
        status: newStatus,
      });
      fetchApplications(); // Refresh the list
    } catch (err) {
      console.error('Error updating application status:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-[#1d1d1f] dark:text-gray-300">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgba(251,251,253,0.8)] dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-[#1d1d1f] pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
            My Applications
          </h1>
        </div>

        <div className="mt-8 space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-12 text-[#1d1d1f] dark:text-gray-300">
              No applications found. Start applying to jobs to track your applications here!
            </div>
          ) : (
            applications.map((application) => (
              <div
                key={application.id}
                className="bg-white dark:bg-black/80 backdrop-blur-[50px] rounded-lg p-6 shadow-sm border border-gray-200 dark:border-[#1d1d1f]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-lg font-medium text-[#1d1d1f] dark:text-white">
                        {application.opportunity.title}
                      </h2>
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusColors[application.status]}`}>
                        {application.status_display}
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                        {application.opportunity.employer.employer_name}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {application.opportunity.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Applied: {formatDate(application.applied_date)}
                      </div>
                      {application.next_follow_up && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          Follow up: {formatDate(application.next_follow_up)}
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <select
                        value={application.status}
                        onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                        className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-black dark:text-white dark:ring-gray-700"
                      >
                        <option value="applied">Applied</option>
                        <option value="screening">Screening</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedApplication(application);
                      setShowDetails(true);
                    }}
                    className="ml-4 p-2 text-gray-400 hover:text-gray-500"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Timeline of events */}
                <div className="mt-6 flow-root">
                  <ul role="list" className="-mb-8">
                    {application.events.map((event, eventIdx) => (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {eventIdx !== application.events.length - 1 ? (
                            <span
                              className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center ring-8 ring-white dark:ring-black">
                                <BriefcaseIcon className="h-5 w-5 text-white" aria-hidden="true" />
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {event.description}
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(event.event_date)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsList;
