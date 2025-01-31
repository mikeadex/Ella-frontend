import React, { useState } from 'react';
import axiosInstance from '../../api/axios';  
import { FaMagic } from 'react-icons/fa';

const RewriteCV = ({ cv, onUpdate }) => {
  const [isRewriting, setIsRewriting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rewrittenCV, setRewrittenCV] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const handleRewrite = async () => {
    setIsRewriting(true);
    setProgress(0);
    setError(null);
    setNotification({
      type: 'info',
      message: 'Rewriting your CV...'
    });

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + (90 - prev) * 0.1;
      });
    }, 1000);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Please log in to use this feature');
      }

      const response = await axiosInstance.post(
        '/api/cv_writer/cv/rewrite/',  
        { cv_data: cv },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 180000 // 3 minutes
        }
      );

      if (response.data && response.data.rewritten) {
        setProgress(100);
        setRewrittenCV(response.data.rewritten);
        setNotification({
          type: 'success',
          message: 'CV has been rewritten! Review the changes below.'
        });
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.error || 'Failed to rewrite CV. Please try again.');
      setNotification({
        type: 'error',
        message: err.response?.data?.error || 'Failed to rewrite CV. Please try again.'
      });
    } finally {
      clearInterval(progressInterval);
      setIsRewriting(false);
    }
  };

  const handleAccept = () => {
    if (rewrittenCV) {
      onUpdate(rewrittenCV);
      setNotification({
        type: 'success',
        message: 'Changes applied successfully!'
      });
      setRewrittenCV(null);
    }
  };

  const handleDiscard = () => {
    setRewrittenCV(null);
    setNotification(null);
  };

  const renderComparison = () => {
    if (!rewrittenCV) return null;

    const sections = [
      {
        title: 'Professional Summary',
        original: cv.professional_summary,
        rewritten: rewrittenCV.professional_summary
      },
      {
        title: 'Experience',
        original: cv.experiences,
        rewritten: rewrittenCV.experiences,
        isArray: true,
        compare: (orig, rewr, idx) => (
          <div key={idx} className="mb-4 p-4 border rounded">
            <h4 className="font-medium">{rewr.company || orig.company}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-500">Original</h5>
                <p>{orig.job_description}</p>
                <p className="mt-2">{orig.achievements}</p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-500">Rewritten</h5>
                <p>{rewr.job_description}</p>
                <p className="mt-2">{rewr.achievements}</p>
              </div>
            </div>
          </div>
        )
      },
      {
        title: 'Education',
        original: cv.education,
        rewritten: rewrittenCV.education,
        isArray: true,
        compare: (orig, rewr, idx) => (
          <div key={idx} className="mb-4 p-4 border rounded">
            <h4 className="font-medium">{rewr.institution || orig.institution}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-500">Original</h5>
                <p>{orig.details}</p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-500">Rewritten</h5>
                <p>{rewr.details}</p>
              </div>
            </div>
          </div>
        )
      }
    ];

    return (
      <div className="mt-6 space-y-6">
        <h3 className="text-lg font-medium">Review Changes</h3>
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h4 className="font-medium">{section.title}</h4>
            {section.isArray ? (
              section.original.map((orig, i) => 
                section.compare(orig, section.rewritten[i], i)
              )
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-500">Original</h5>
                  <p>{section.original}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-500">Rewritten</h5>
                  <p>{section.rewritten}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        
        <div className="flex space-x-4">
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Accept Changes
          </button>
          <button
            onClick={handleDiscard}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Discard Changes
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div
          className={`p-4 rounded ${
            notification.type === 'error'
              ? 'bg-red-100 text-red-700'
              : notification.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Rewrite Your CV</h3>
          <p className="text-sm text-gray-600">
            Let our AI enhance your CV while maintaining accuracy
          </p>
        </div>
        <button
          onClick={handleRewrite}
          disabled={isRewriting}
          className={`flex items-center space-x-2 px-4 py-2 rounded ${
            isRewriting
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <FaMagic className="w-4 h-4" />
          <span>{isRewriting ? 'Rewriting...' : 'Rewrite CV'}</span>
        </button>
      </div>

      {isRewriting && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 mt-1 text-center">
            {progress < 100 ? 'Rewriting your CV...' : 'Complete!'}
          </div>
        </div>
      )}

      {renderComparison()}
    </div>
  );
};

export default RewriteCV;
