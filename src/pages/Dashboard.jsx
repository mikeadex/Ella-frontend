import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import { Link } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import {
  DocumentDuplicateIcon,
  ClockIcon,
  CreditCardIcon,
  PlusIcon,
  ChevronRightIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar/Navbar';
import JobsList from '../components/JobsList/JobsList';
import RecentApplications from '../components/Dashboard/RecentApplications';
import Applications from './Applications';
import Footer from '../components/Footer/Footer';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Custom function to format relative time
function formatRelativeTime(date) {
  if (!date) return 'Never';
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  
  if (diffInSeconds < minute) return 'Just now';
  if (diffInSeconds < hour) return `${Math.floor(diffInSeconds / minute)} min ago`;
  if (diffInSeconds < day) return `${Math.floor(diffInSeconds / hour)} hr ago`;
  if (diffInSeconds < week) return `${Math.floor(diffInSeconds / day)} days ago`;
  if (diffInSeconds < month) return `${Math.floor(diffInSeconds / week)} weeks ago`;
  
  return new Date(date).toLocaleDateString();
}

const Dashboard = () => {
  const { user } = useAuth();
  const [cvs, setCvs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const dashboardMetrics = {
    totalCVs: cvs.length,
    matchedJobs: jobs.length,
    totalApplications: 0, // TODO: Add actual applications count
    cvStatus: cvs.length > 0 ? 'Good' : 'Needs Improvement',
    jobApplyClicks: 0, // TODO: Add actual job apply clicks
    cvCreationAttempts: cvs.length
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cvsResponse, jobsResponse] = await Promise.all([
          axiosInstance.get('/api/cv_writer/cv/'),
          axiosInstance.get('/api/jobstract/opportunities/')
        ]);
        
        setCvs(cvsResponse.data);
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

  const CVOverviewSection = () => {
    const quickLinks = [
      {
        name: 'Create CV',
        icon: PlusIcon,
        to: '/cv-writer/write',
        description: 'Start a new CV from scratch',
        color: 'bg-indigo-50 hover:bg-indigo-100',
        textColor: 'text-indigo-600 hover:text-indigo-700'
      },
      {
        name: 'CV Templates',
        icon: DocumentDuplicateIcon,
        to: '/cv-templates',
        description: 'Browse professional templates',
        color: 'bg-emerald-50 hover:bg-emerald-100',
        textColor: 'text-emerald-600 hover:text-emerald-700'
      },
      {
        name: 'CV Versions',
        icon: DocumentTextIcon,
        to: '/cv-versions',
        description: 'Manage your CV versions',
        color: 'bg-sky-50 hover:bg-sky-100',
        textColor: 'text-sky-600 hover:text-sky-700'
      }
    ];

    const getStatusColor = (status) => {
      switch(status) {
        case 'Excellent': return 'text-green-600';
        case 'Good': return 'text-blue-600';
        case 'Needs Improvement': return 'text-yellow-600';
        default: return 'text-gray-600';
      }
    };

    return (
      <div className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {/* First Row Metrics */}
          <div className="bg-white dark:bg-black/80 rounded-xl border border-gray-200 dark:border-[#1d1d1f] p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Total CVs
            </h3>
            <p className="text-3xl font-bold text-[#1d1d1f] dark:text-white">
              {dashboardMetrics.totalCVs}
            </p>
          </div>

          <div className="bg-white dark:bg-black/80 rounded-xl border border-gray-200 dark:border-[#1d1d1f] p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Matched Jobs
            </h3>
            <p className="text-3xl font-bold text-[#1d1d1f] dark:text-white">
              {dashboardMetrics.matchedJobs}
            </p>
          </div>

          <div className="bg-white dark:bg-black/80 rounded-xl border border-gray-200 dark:border-[#1d1d1f] p-4 text-center sm:col-span-1 col-span-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Total Applications
            </h3>
            <p className="text-3xl font-bold text-[#1d1d1f] dark:text-white">
              {dashboardMetrics.totalApplications}
            </p>
          </div>

          {/* Second Row Metrics */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-600 p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              CV Status
            </h3>
            <p className={`text-2xl font-bold ${getStatusColor(dashboardMetrics.cvStatus)}`}>
              {dashboardMetrics.cvStatus}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-600 p-4 text-center">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Job Apply Clicks
            </h3>
            <p className="text-3xl font-bold text-[#1d1d1f] dark:text-white">
              {dashboardMetrics.jobApplyClicks}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-600 p-4 text-center sm:col-span-1 col-span-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              CV Creation Attempts
            </h3>
            <p className="text-3xl font-bold text-[#1d1d1f] dark:text-white">
              {dashboardMetrics.cvCreationAttempts}
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {quickLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="group block"
            >
              <div className={`
                ${link.color}
                rounded-xl p-4 
                flex items-center 
                space-x-4 
                transform transition-all duration-300 
                hover:scale-105 
                hover:shadow-lg
                text-center flex-col justify-center
                bg-opacity-90 hover:bg-opacity-100
                border border-transparent
                hover:border-opacity-50
              `}>
                <link.icon className={`h-8 w-8 ${link.textColor} mb-2`} />
                <div>
                  <h3 className={`text-base font-semibold ${link.textColor}`}>
                    {link.name}
                  </h3>
                  <p className={`text-sm ${link.textColor} bg-opacity-60`}>
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

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

  const tabs = [
    { name: 'Overview', key: 'overview', icon: DocumentDuplicateIcon },
    { name: 'CVs', key: 'cvs', icon: DocumentDuplicateIcon },
    { name: 'Jobs', key: 'jobs', icon: CreditCardIcon },
    { name: 'Activity', key: 'activity', icon: ClockIcon },
    { name: 'Applications', key: 'applications', icon: ChevronRightIcon }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[rgba(251,251,253,0.8)] dark:bg-black pt-16">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <Tab.Group defaultIndex={tabs.findIndex((tab) => tab.key === activeTab)} onChange={(index) => setActiveTab(tabs[index].key)}>
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
                <div className="mt-6">
                  <CVOverviewSection />
                </div>
              </Tab.Panel>

              {/* CVs Panel */}
              <Tab.Panel>
                <div className="mt-6">
                  {loading ? (
                    <div className="text-center py-12 text-[#424245] dark:text-gray-300">Loading...</div>
                  ) : cvs.length === 0 ? (
                    <div className="text-center py-12 text-[#424245] dark:text-gray-300">
                      No CVs found. Create your first CV!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {cvs.map((cv) => (
                        <Link 
                          key={cv.id} 
                          to={`/cv-writer/edit/${cv.id}`}
                          className="bg-[rgba(251,251,253,0.8)] dark:bg-black/80 backdrop-blur-[50px] rounded-lg shadow-sm border border-gray-200 dark:border-[#1d1d1f] overflow-hidden"
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-base font-medium text-[#1d1d1f] dark:text-white">
                                  {cv.title || 'Untitled CV'}
                                </h3>
                                <p className="mt-1 text-sm text-[#424245] dark:text-gray-400">
                                  Last updated: {new Date(cv.updated_at).toLocaleDateString()}
                                </p>
                              </div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                {cv.version_name || 'Version 1'}
                              </span>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-[#424245] dark:text-gray-400">
                              <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
                              <span>Template: {cv.template || 'Modern Professional'}</span>
                            </div>
                          </div>
                          <div className="border-t border-gray-200 dark:border-[#1d1d1f] bg-[rgba(251,251,253,0.8)] dark:bg-black/80 backdrop-blur-[50px] px-4 py-3">
                            <div className="flex justify-between space-x-2">
                              <Link
                                to={`/cv-writer/preview/${cv.id}`}
                                className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Preview
                              </Link>
                              <Link
                                to={`/cv-writer/write/${cv.id}`}
                                className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Edit
                              </Link>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </Tab.Panel>

              {/* Jobs Panel */}
              <Tab.Panel>
                <div className="mt-6">
                  {loading ? (
                    <div className="text-center py-12 text-[#424245] dark:text-gray-300">Loading...</div>
                  ) : jobs.length === 0 ? (
                    <div className="text-center py-12 text-[#424245] dark:text-gray-300">
                      No jobs found. Keep exploring!
                    </div>
                  ) : (
                    <JobsList jobs={jobs} />
                  )}
                </div>
              </Tab.Panel>

              {/* Activity Panel */}
              <Tab.Panel>
                <div className="mt-6">
                  <RecentApplications />
                </div>
              </Tab.Panel>

              {/* Applications Panel */}
              <Tab.Panel>
                <div className="mt-6">
                  <Applications />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
