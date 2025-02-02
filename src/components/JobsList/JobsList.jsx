import React, { useState, useEffect, Fragment, useRef, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  ChevronRightIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import axiosInstance from '../../api/axios';
import JobFilters from './JobFilters';
import JobRecommendations from './JobRecommendations';
import { useTheme } from '../../context/ThemeContext';

const JobBadge = ({ children, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-600/10',
    green: 'bg-green-50 text-green-700 ring-green-600/10',
    yellow: 'bg-yellow-50 text-yellow-700 ring-yellow-600/10',
    purple: 'bg-purple-50 text-purple-700 ring-purple-600/10',
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/10',
  };

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorClasses[color]}`}>
      {children}
    </span>
  );
};

const JobsList = () => {
  const { isDark } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const [filters, setFilters] = useState({
    mode: '',
    time_commitment: '',
    experience_level: '',
    location: '',
    opportunity_type: 'job',
    ordering: '-created_at'
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const lastJobElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    setJobs([]);
    setPage(1);
    setHasMore(true);
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [filters, page]);

  const fetchJobs = async () => {
    try {
      if (page === 1) setLoading(true);
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      queryParams.append('page', page);

      const response = await axiosInstance.get(`/api/jobstract/opportunities/?${queryParams.toString()}`);
      const newJobs = response.data.results || [];
      setJobs(prevJobs => page === 1 ? newJobs : [...prevJobs, ...newJobs]);
      setHasMore(!!response.data.next);
      setError(null);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      mode: '',
      time_commitment: '',
      experience_level: '',
      location: '',
      opportunity_type: 'job',
      ordering: '-created_at'
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Posted yesterday';
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
    return `Posted ${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="min-h-screen bg-[rgba(251,251,253,0.8)] dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-[#1d1d1f] pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
            Job Opportunities
          </h1>

          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center lg:hidden text-[#1d1d1f] dark:text-gray-300 hover:opacity-80 transition-opacity"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <span className="text-sm font-medium">Filters</span>
              <FunnelIcon className="ml-1 h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div>
          {/* Mobile filter dialog */}
          <Transition.Root show={mobileFiltersOpen} as={Fragment}>
            <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 z-40 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-[rgba(251,251,253,0.8)] dark:bg-black backdrop-blur-[50px] py-4 pb-6 shadow-xl">
                    <div className="flex items-center justify-between px-4">
                      <h2 className="text-lg font-medium text-[#1d1d1f] dark:text-white">Filters</h2>
                      <button
                        type="button"
                        className="-mr-2 flex h-10 w-10 items-center justify-center text-[#1d1d1f] dark:text-gray-300 hover:opacity-80 transition-opacity"
                        onClick={() => setMobileFiltersOpen(false)}
                      >
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Mobile Filters */}
                    <div className="mt-4 px-4">
                      <JobFilters
                        filters={filters}
                        setFilters={setFilters}
                        clearFilters={clearFilters}
                      />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Desktop Filters */}
            <div className="hidden lg:block">
              <JobFilters
                filters={filters}
                setFilters={setFilters}
                clearFilters={clearFilters}
              />
            </div>

            {/* Job Grid */}
            <div className="lg:col-span-3">
              {/* Recommendations Section */}
              <div className="mb-8">
                <JobRecommendations />
              </div>

              {/* Jobs List */}
              <div className="space-y-8">
                {loading && page === 1 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[...Array(6)].map((_, index) => (
                      <div
                        key={index}
                        className="bg-[rgba(251,251,253,0.8)] dark:bg-black/80 backdrop-blur-[50px] rounded-lg p-6 animate-pulse"
                      >
                        <div className="h-4 bg-gray-200 dark:bg-[#1d1d1f] rounded w-3/4 mb-4" />
                        <div className="h-3 bg-gray-200 dark:bg-[#1d1d1f] rounded w-1/2 mb-2" />
                        <div className="h-3 bg-gray-200 dark:bg-[#1d1d1f] rounded w-1/4" />
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-[#1d1d1f] dark:text-gray-300">
                    {error}
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-12 text-[#1d1d1f] dark:text-gray-300">
                    No jobs found matching your criteria.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {jobs.map((job, index) => (
                      <div
                        key={job.id}
                        ref={index === jobs.length - 1 ? lastJobElementRef : null}
                        className="bg-[rgba(251,251,253,0.8)] dark:bg-black/80 backdrop-blur-[50px] hover:bg-white/90 dark:hover:bg-black/60 rounded-lg p-6 transition-all duration-200 border border-gray-200 dark:border-[#1d1d1f]"
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h2 className="text-sm text-[#424245] dark:text-gray-300 line-clamp-2">
                                {job.title}
                              </h2>
                              <span className="text-xs text-[#424245] dark:text-gray-400">
                                {formatDate(job.date_posted)}
                              </span>
                            </div>
                            <p className="text-sm text-[#424245] dark:text-gray-400 mb-2">
                              {job.employer.employer_name}
                              {job.location && (
                                <span className="ml-2 text-[#424245] dark:text-gray-400">
                                  • {job.location}
                                </span>
                              )}
                            </p>
                            {job.salary_range && (
                              <p className="text-sm text-[#424245] dark:text-gray-400 mb-2">
                                {job.salary_range}
                              </p>
                            )}
                            <p className="text-sm text-[#424245] dark:text-gray-300 line-clamp-3 mb-4">
                              {job.description}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {job.mode && (
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-500/10 text-indigo-400">
                                {job.mode}
                              </span>
                            )}
                            {job.time_commitment && (
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-500/10 text-green-400">
                                {job.time_commitment}
                              </span>
                            )}
                            {job.experience_level && (
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-500/10 text-yellow-400">
                                {job.experience_level}
                              </span>
                            )}
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => window.open(job.application_url, '_blank')}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-sm transition-colors duration-200"
                            >
                              Apply Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {loading && page > 1 && (
                      <div className="col-span-full flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsList;
