import React from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const JobFilters = ({ filters, setFilters, clearFilters }) => {
  const { isDark } = useTheme();
  
  const JOB_MODES = [
    { value: 'on_site', label: 'On Site' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  const TIME_COMMITMENTS = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'flexible', label: 'Flexible' },
    { value: 'one_off', label: 'One Off' },
    { value: 'occasional', label: 'Occasional' },
  ];

  const EXPERIENCE_LEVELS = [
    { value: 'entry_level', label: 'Entry Level' },
    { value: 'junior', label: 'Junior' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' },
    { value: 'manager', label: 'Manager' },
    { value: 'director', label: 'Director' },
    { value: 'executive', label: 'Executive' },
    { value: 'no_experience', label: 'No Experience Required' },
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value === prev[filterType] ? '' : value,
    }));
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => 
      key !== 'opportunity_type' && key !== 'ordering' && filters[key]
    ).length;
  };

  return (
    <div className="bg-[rgba(251,251,253,0.8)] dark:bg-black/80 backdrop-blur-[50px] rounded-xl shadow-sm border border-gray-200 dark:border-[#1d1d1f] overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-[#1d1d1f]'}`} />
            <h3 className={`text-base font-medium ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>Filters</h3>
            {getActiveFiltersCount() > 0 && (
              <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-400">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          {getActiveFiltersCount() > 0 && (
            <button
              onClick={clearFilters}
              className={`text-sm ${isDark ? 'text-gray-300' : 'text-[#1d1d1f]'} hover:opacity-80 transition-opacity flex items-center space-x-1`}
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Location Filter */}
          <div>
            <h3 className="text-sm font-medium text-[#1d1d1f] dark:text-white mb-4">Location</h3>
            <select
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="block w-full rounded-lg border-gray-200 dark:border-[#1d1d1f] bg-white dark:bg-black text-sm text-[#424245] dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Any Location</option>
              <option value="London">London</option>
              <option value="Remote">Remote</option>
              <option value="Manchester">Manchester</option>
              <option value="Birmingham">Birmingham</option>
              <option value="Leeds">Leeds</option>
              <option value="Glasgow">Glasgow</option>
              <option value="Edinburgh">Edinburgh</option>
            </select>
          </div>

          {/* Job Mode Filter */}
          <div>
            <label className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>Job Mode</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {JOB_MODES.map(mode => (
                <button
                  key={mode.value}
                  onClick={() => handleFilterChange('mode', mode.value)}
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-opacity ${
                    filters.mode === mode.value
                      ? 'bg-indigo-600 text-white'
                      : `bg-[rgba(251,251,253,0.8)] dark:bg-black/80 backdrop-blur-[50px] text-[#1d1d1f] dark:text-gray-300 hover:opacity-80 border border-gray-200 dark:border-[#1d1d1f]`
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Commitment Filter */}
          <div>
            <label className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>Time Commitment</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {TIME_COMMITMENTS.map(time => (
                <button
                  key={time.value}
                  onClick={() => handleFilterChange('time_commitment', time.value)}
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-opacity ${
                    filters.time_commitment === time.value
                      ? 'bg-indigo-600 text-white'
                      : `bg-[rgba(251,251,253,0.8)] dark:bg-black/80 backdrop-blur-[50px] text-[#1d1d1f] dark:text-gray-300 hover:opacity-80 border border-gray-200 dark:border-[#1d1d1f]`
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level Filter */}
          <div>
            <label className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>Experience Level</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {EXPERIENCE_LEVELS.map(level => (
                <button
                  key={level.value}
                  onClick={() => handleFilterChange('experience_level', level.value)}
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-opacity ${
                    filters.experience_level === level.value
                      ? 'bg-indigo-600 text-white'
                      : `bg-[rgba(251,251,253,0.8)] dark:bg-black/80 backdrop-blur-[50px] text-[#1d1d1f] dark:text-gray-300 hover:opacity-80 border border-gray-200 dark:border-[#1d1d1f]`
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
