import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaPlus, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { sharedStyles } from '../../utils/styling';
import { SOCIAL_MEDIA_PLATFORMS } from '../../utils/constants';
import SocialMediaFormModal from './SocialMedia/SocialMediaFormModal';

const SocialMedia = ({ data, updateData, errors }) => {
  const { isDark } = useTheme();
  const [profiles, setProfiles] = useState(data || {});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      setProfiles(data);
    } else {
      setProfiles({});
    }
  }, [data]);

  const handleSave = (updatedProfiles) => {
    setProfiles(updatedProfiles);
    updateData(updatedProfiles);
    setIsModalOpen(false);
  };

  const handleRemoveProfile = (platform) => {
    const updatedProfiles = { ...profiles };
    delete updatedProfiles[platform];
    setProfiles(updatedProfiles);
    updateData(updatedProfiles);
  };

  const activeProfiles = Object.entries(profiles).filter(([_, url]) => url?.trim());

  return (
    <div className={`${sharedStyles.card} ${isDark ? 'dark:bg-gray-900 dark:border-yellow-500/30 dark:shadow-yellow-500/20' : ''}`}>
      <div className={`${sharedStyles.cardHeader} ${isDark ? 'dark:bg-gradient-to-r dark:from-yellow-900/40 dark:to-orange-900/40 dark:border-b dark:border-yellow-500/30' : ''}`}>
        <h2 className={`text-xl font-semibold ${isDark ? 'dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-yellow-400 dark:to-orange-400' : ''}`}>
          Links
        </h2>
      </div>

      <div className={`${sharedStyles.cardBody} ${isDark ? 'dark:bg-black' : ''}`}>
        {activeProfiles.length === 0 ? (
          <div className={`mb-6 p-6 rounded-lg text-center border-2 border-dashed
            ${isDark 
              ? 'dark:border-yellow-500/20 dark:bg-gray-800/50' 
              : 'border-gray-200 bg-gray-50'}`}
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full
              ${isDark ? 'bg-yellow-500/10' : 'bg-blue-50'}`}
            >
              <svg
                className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <h3 className={`text-lg font-medium mb-2 
              ${isDark ? 'dark:text-yellow-400' : 'text-gray-900'}`}
            >
              Add Your Links Profiles
            </h3>
            <p className={`text-sm mb-4 
              ${isDark ? 'dark:text-gray-400' : 'text-gray-600'}`}
            >
              Links profiles can help you:
            </p>
            <ul className={`text-sm space-y-2 mb-4 text-left mx-auto max-w-md
              ${isDark ? 'dark:text-gray-400' : 'text-gray-600'}`}
            >
              <li className="flex items-start">
                <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                <span>Showcase your professional presence</span>
              </li>
              <li className="flex items-start">
                <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                <span>Display your portfolio and work</span>
              </li>
              <li className="flex items-start">
                <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                <span>Network with potential employers</span>
              </li>
            </ul>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <AnimatePresence>
              {activeProfiles.map(([platform, url]) => {
                const platformConfig = SOCIAL_MEDIA_PLATFORMS.find(p => p.name === platform);
                return (
                  <motion.div
                    key={platform}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`relative p-4 rounded-lg border
                      ${isDark 
                        ? 'bg-gray-800 border-yellow-500/30 hover:border-yellow-400/50' 
                        : 'bg-white border-gray-200 hover:border-gray-300'} 
                      transition-colors duration-200`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 ${isDark ? 'text-yellow-400' : 'text-gray-600'}`}>
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            {platformConfig?.icon === "linkedin" && (
                              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.68 1.68 0 0 0-1.68 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                            )}
                            {platformConfig?.icon === "github" && (
                              <path d="M12 0a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.2-1.8-1.2-1.8-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.1-3.2-.1-.3-.5-1.5.1-3.2 0 0 .9-.3 3 1.1a10.5 10.5 0 0 1 5.5 0c2.1-1.4 3-1.1 3-1.1.6 1.7.2 2.9.1 3.2.7.8 1.1 1.9 1.1 3.2 0 4.6-2.8 5.6-5.4 5.9.4.3.7 1 .7 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 0z" />
                            )}
                            {platformConfig?.icon === "twitter" && (
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            )}
                            {platformConfig?.icon === "globe" && (
                              <path d="M12 0c-6.628 0-12 5.373-12 12s5.372 12 12 12 12-5.373 12-12-5.372-12-12-12zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1 4.165-2.358 5.548-4.082 1.35 1.594 2.197 3.619 2.322 5.835zm-3.842-7.282c-1.205 1.554-2.868 2.783-4.986 3.68-1.016-1.861-2.178-3.676-3.488-5.438.779-.197 1.591-.314 2.431-.314 2.275 0 4.368.85 5.943 2.072zm-8.228-1.22c1.331 1.742 2.511 3.538 3.537 5.381-2.43.715-5.331 1.082-8.684 1.105.692-2.835 2.601-5.193 5.147-6.486zm-5.816 8.061v-.398c3.735 0 7.034-.38 9.896-1.187.308.616.583 1.237.826 1.862-3.784 1.137-7.288 3.405-9.324 6.771-1.036-1.793-1.637-3.891-1.637-6.118zm4.304 7.403c1.798-3.203 5.082-5.32 8.549-6.4.418 1.162.755 2.346 1.007 3.55-2.984 1.181-4.965 3.818-5.894 7.08-1.474-.813-2.71-2.051-3.662-3.51zm6.534 4.201c.753-2.947 2.471-5.368 5.097-6.517.266 1.32.398 2.679.398 4.082 0 1.085-.147 2.116-.397 3.122-1.434.562-2.991.876-4.629.876-.517.001-1.028-.038-1.529-.114z" />
                            )}
                          </svg>
                        </div>
                        <div>
                          <h3 className={`font-medium ${isDark ? 'text-yellow-400' : 'text-gray-900'}`}>
                            {platform}
                          </h3>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${
                              isDark ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-600 hover:text-blue-600'
                            } transition-colors duration-200`}
                          >
                            {url}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveProfile(platform)}
                        className={`p-1.5 rounded-full transition-colors duration-200
                          ${isDark 
                            ? 'text-red-400 hover:bg-red-400/10' 
                            : 'text-red-600 hover:bg-red-50'}`}
                        aria-label={`Remove ${platform} profile`}
                      >
                        <FaTrashAlt className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center justify-center w-full p-3 rounded-md border-2 border-dashed
            ${isDark 
              ? 'dark:border-yellow-500/30 dark:text-yellow-400 hover:dark:border-yellow-400 hover:dark:text-yellow-300' 
              : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
            } transition-colors duration-200`}
        >
          <FaPlus className="mr-2" />
          {activeProfiles.length === 0 ? 'Add Links Profiles' : 'Edit Links Profiles'}
        </button>

        <SocialMediaFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          initialData={profiles}
        />
      </div>
    </div>
  );
};

SocialMedia.propTypes = {
  data: PropTypes.objectOf(PropTypes.string),
  updateData: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    socialMedia: PropTypes.string
  })
};

export default SocialMedia;