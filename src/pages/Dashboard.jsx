import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import { Link } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { 
  DocumentDuplicateIcon, 
  BriefcaseIcon, 
  ChartBarIcon,
  ClockIcon,
  CreditCardIcon,
  PlusIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar/Navbar';
import JobsList from '../components/JobsList/JobsList';
import RecentApplications from '../components/Dashboard/RecentApplications';
import Applications from './Applications';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Dashboard = () => {
  const { user } = useAuth();
  const [cvCount, setCvCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cvs, setCvs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cvsResponse, jobsResponse] = await Promise.all([
          axiosInstance.get('/api/cv_writer/cv/'),
          axiosInstance.get('/api/jobstract/opportunities/')
        ]);
        
        setCvs(cvsResponse.data);
        setCvCount(cvsResponse.data.length);
        setJobs(jobsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const tabs = [
    { name: 'Overview', key: 'overview', icon: ChartBarIcon },
    { name: 'CVs', key: 'cvs', icon: DocumentDuplicateIcon },
    { name: 'Jobs', key: 'jobs', icon: BriefcaseIcon },
    { name: 'Activity', key: 'activity', icon: ClockIcon },
    { name: 'Applications', key: 'applications', icon: CreditCardIcon }
  ];

  const StatCard = ({ icon: Icon, title, value, actions }) => (
    <div className="bg-[rgba(251,251,253,0.8)] dark:bg-black/80 backdrop-blur-[50px] rounded-lg shadow-sm border border-gray-200 dark:border-[#1d1d1f] overflow-hidden">
      <div className="p-4">
        <div className="flex items-center">
          <Icon className="h-6 w-6 text-[#424245] dark:text-gray-400" />
          <div className="ml-4 flex-1">
            <h3 className="text-sm font-medium text-[#424245] dark:text-gray-300">{title}</h3>
            <p className="text-lg font-semibold text-[#1d1d1f] dark:text-white mt-1">{value}</p>
          </div>
        </div>
      </div>
      {actions && (
        <div className="border-t border-gray-200 dark:border-[#1d1d1f] bg-[rgba(251,251,253,0.8)] dark:bg-black/80 backdrop-blur-[50px] px-4 py-3">
          <div className="flex flex-wrap gap-2 text-sm">
            {actions}
          </div>
        </div>
      )}
    </div>
  );

  const ActionLink = ({ to, children }) => (
    <Link
      to={to}
      className="text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-opacity font-medium text-sm"
    >
      {children}
    </Link>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[rgba(251,251,253,0.8)] dark:bg-black pt-16">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
          {/* Mobile Header */}
          <div className="mb-6">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h1 className="text-xl font-bold text-[#1d1d1f] dark:text-white sm:text-2xl">Dashboard</h1>
                <p className="mt-1 text-sm text-[#424245] dark:text-gray-300">
                  Welcome back, {user?.email}
                </p>
              </div>
              <Link
                to="/cv-writer/write"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create New CV
              </Link>
            </div>
          </div>

          {/* Tab Navigation */}
          <Tab.Group onChange={(index) => setActiveTab(tabs[index].key)}>
            <Tab.List className="flex space-x-1 rounded-xl bg-[#f5f5f7] dark:bg-[#1d1d1f] p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.key}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white dark:bg-black text-[#1d1d1f] dark:text-white shadow'
                        : 'text-[#424245] dark:text-gray-400 hover:bg-white/[0.12] hover:text-[#1d1d1f] dark:hover:text-white'
                    )
                  }
                >
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels>
              {/* Overview Panel */}
              <Tab.Panel>
                <div className="space-y-4">
                  <StatCard
                    icon={DocumentDuplicateIcon}
                    title="Total CVs"
                    value={loading ? '...' : cvCount}
                    actions={
                      <>
                        <ActionLink to="/cv-writer/write">Create New CV</ActionLink>
                        <span className="text-gray-300 dark:text-gray-600 mx-2">|</span>
                        <ActionLink to="/cv-templates">View Templates</ActionLink>
                      </>
                    }
                  />
                </div>
              </Tab.Panel>

              {/* CVs Panel */}
              <Tab.Panel>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-12 text-[#424245] dark:text-gray-300">Loading...</div>
                  ) : cvs.length === 0 ? (
                    <div className="text-center py-12 text-[#424245] dark:text-gray-300">
                      No CVs found. Create your first CV!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {cvs.map((cv) => (
                        <div
                          key={cv.id}
                          className="bg-[rgba(251,251,253,0.8)] dark:bg-black/80 backdrop-blur-[50px] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-[#1d1d1f]"
                        >
                          <h3 className="text-lg font-medium text-[#1d1d1f] dark:text-white">{cv.title}</h3>
                          <p className="mt-1 text-sm text-[#424245] dark:text-gray-300">{cv.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Tab.Panel>

              {/* Jobs Panel */}
              <Tab.Panel>
                <JobsList />
              </Tab.Panel>

              {/* Activity Panel */}
              <Tab.Panel>
                <div className="text-center py-12 text-[#424245] dark:text-gray-300">
                  Activity tracking coming soon!
                </div>
              </Tab.Panel>

              {/* Applications Panel */}
              <Tab.Panel>
                <div className="text-center py-12 text-[#424245] dark:text-gray-300">
                  <Applications />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
      <div className="min-h-screen bg-[rgba(251,251,253,0.8)] dark:bg-black pt-16">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* CV Stats */}
            <div className="bg-white dark:bg-black/80 backdrop-blur-[50px] rounded-xl border border-gray-200 dark:border-[#1d1d1f] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
                  Your CVs
                </h2>
                <Link
                  to="/write"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Create CV
                </Link>
              </div>

              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-[#1d1d1f] rounded w-1/4 mb-4" />
                  <div className="space-y-3">
                    <div className="h-12 bg-gray-200 dark:bg-[#1d1d1f] rounded" />
                    <div className="h-12 bg-gray-200 dark:bg-[#1d1d1f] rounded" />
                  </div>
                </div>
              ) : cvs.length === 0 ? (
                <div className="text-center py-6">
                  <DocumentDuplicateIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No CVs created yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cvs.map((cv) => (
                    <Link
                      key={cv.id}
                      to={`/write/${cv.id}`}
                      className="block p-4 rounded-lg bg-gray-50 dark:bg-black/40 hover:bg-gray-100 dark:hover:bg-black/60 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-[#1d1d1f] dark:text-white">
                            {cv.title || 'Untitled CV'}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Last updated: {new Date(cv.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <ChartBarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Applications */}
            <RecentApplications />
          </div>

          {/* Job Recommendations */}
          <div className="mt-6">
            <div className="bg-white dark:bg-black/80 backdrop-blur-[50px] rounded-xl border border-gray-200 dark:border-[#1d1d1f] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
                  Recommended Jobs
                </h2>
                <Link
                  to="/jobs"
                  className="text-sm text-[#06c] dark:text-[#2997ff] hover:underline flex items-center"
                >
                  View all jobs
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <JobsList limit={3} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
