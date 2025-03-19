import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadDocument, transferToWriter } from '../../api/cvParser';
import { 
    DocumentTextIcon, 
    ArrowUpTrayIcon, 
    CheckBadgeIcon, 
    ExclamationTriangleIcon,
    ClockIcon,
    PaperClipIcon,
    DocumentCheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

// Helper to count the number of non-empty sections in the parsed data
const countParsedSections = (data) => {
    if (!data) return 0;
    
    // Define the main sections we want to count
    const sections = [
        'professional_summary', 'skills', 'experience', 
        'education', 'certifications', 'languages', 
        'references', 'interests', 'social_media'
    ];
    
    // Count sections that have content
    return sections.filter(section => {
        const value = data[section];
        return value && 
              (Array.isArray(value) ? value.length > 0 : value !== "" && value !== "Parsing timed out");
    }).length;
};

const CVUpload = ({ onParseSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [parsedData, setParsedData] = useState(null);
    const [parsingProgress, setParsingProgress] = useState(0);
    const [uploadStartTime, setUploadStartTime] = useState(null);
    const [parsingTime, setParsingTime] = useState(null);
    const [transferringToWriter, setTransferringToWriter] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    // Timer for simulating progress when actual progress can't be determined
    useEffect(() => {
        let progressInterval;
        
        if (loading && uploadStartTime) {
            // Start at 10% immediately to show activity
            setParsingProgress(10);
            
            // Simulate progress: increase gradually but never reach 100%
            progressInterval = setInterval(() => {
                setParsingProgress(prev => {
                    const elapsedSeconds = (Date.now() - uploadStartTime) / 1000;
                    
                    // Different progress calculation stages based on elapsed time
                    if (elapsedSeconds < 5) {
                        // 0-5 seconds: progress to 30%
                        return Math.min(10 + (elapsedSeconds * 4), 30);
                    } else if (elapsedSeconds < 15) {
                        // 5-15 seconds: progress to 60%
                        return Math.min(30 + ((elapsedSeconds - 5) * 3), 60);
                    } else if (elapsedSeconds < 30) {
                        // 15-30 seconds: progress to 85%
                        return Math.min(60 + ((elapsedSeconds - 15) * 1.5), 85);
                    } else {
                        // After 30 seconds: progress very slowly to 95%
                        return Math.min(85 + ((elapsedSeconds - 30) * 0.2), 95);
                    }
                });
            }, 500);
        }
        
        return () => {
            if (progressInterval) clearInterval(progressInterval);
        };
    }, [loading, uploadStartTime]);

    // Check authentication on component mount
    useEffect(() => {
        if (!isAuthenticated) {
            setError('You must be logged in to use the CV parser');
        }
    }, [isAuthenticated]);

    const validateFile = (selectedFile) => {
        const allowedTypes = [
            'application/pdf', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        const maxFileSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(selectedFile.type)) {
            setError('Please upload a PDF or DOCX file');
            return false;
        }

        if (selectedFile.size > maxFileSize) {
            setError('File size should be less than 10MB');
            return false;
        }

        return true;
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && validateFile(selectedFile)) {
            setFile(selectedFile);
            setError(null);
            setParsedData(null);
            setParsingTime(null);
        }
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        
        if (!file) {
            setError('Please select a file');
            return;
        }

        setLoading(true);
        setError(null);
        setUploadStartTime(Date.now());
        setParsingProgress(0);

        try {
            console.log('Uploading with authenticated user:', user?.email);
            const result = await uploadDocument(file);
            
            // Progress simulation for better UX
            const intervalId = setInterval(() => {
                setParsingProgress(prev => {
                    // Cap at 95% until we actually get a result
                    return prev < 95 ? prev + 5 : 95;
                });
            }, 1000);

            // Calculate actual parsing time
            const parseDuration = ((Date.now() - uploadStartTime) / 1000).toFixed(1);
            
            // Validate the result format
            if (result && result.data) {
                console.log('CV parsed successfully!');
                console.log('Sections:', Object.keys(result.data));
                console.log('Metadata:', result.metadata);
                
                // Check for timeout indicators
                const hasTimedOut = 
                    result.data.error === "Parsing timed out" || 
                    result.data.professional_summary === "Parsing timed out" ||
                    result.metadata?.timed_out === true;
                
                if (hasTimedOut) {
                    console.warn("Parsing timed out, but partial results were returned");
                    // Still set the data, but mark progress as complete
                    setParsingProgress(100);
                    setParsedData(result.data);
                    setParsingTime(parseDuration);
                    setError('The CV parsing timed out, but we extracted some partial information. For better results, consider simplifying your CV or using a more standard format.');
                    
                    if (onParseSuccess) {
                        onParseSuccess(result.data);
                    }
                    
                    console.warn('CV parsing timed out with partial results:', {
                        sections: Object.keys(result.data),
                        metadata: result.metadata,
                        parsingTime: parseDuration
                    });
                } else {
                    // Normal successful path
                    setParsingProgress(100);
                    setParsedData(result.data);
                    setParsingTime(parseDuration);
                    setError(null);
                    
                    if (onParseSuccess) {
                        onParseSuccess(result.data);
                    }
                    
                    // Log successful parsing
                    console.log('CV parsed successfully:', {
                        sections: Object.keys(result.data),
                        metadata: result.metadata,
                        parsingTime: parseDuration
                    });
                }
            } else {
                throw new Error('Invalid response format from parser');
            }
        } catch (err) {
            clearInterval(intervalId);
            setLoading(false);
            setParsingProgress(0);
            
            // Improved error handling with specific messages
            if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
                setError('The parsing process is taking too long. For complex documents, try simplifying your CV or breaking it into smaller sections.');
            } else if (err.response?.status === 500) {
                // Handle server errors
                const serverError = err.response.data.error || err.response.data.detail || 'Internal server error';
                setError(`Server error: ${serverError}`);
            } else {
                const errorMessage = err.response?.data?.error || 
                                    err.message || 
                                    'Failed to upload and parse CV. Please try again.';
                setError(errorMessage);
            }
            console.error('Error parsing CV:', err);
        }
    };

    const handleTransferToWriter = async () => {
        if (!parsedData) return;
        
        setTransferringToWriter(true);
        try {
            await transferToWriter(parsedData);
            navigate('/cv-writer');
        } catch (error) {
            console.error('Error transferring to CV Writer:', error);
            setError('Failed to transfer data to CV Writer. Please try again.');
        } finally {
            setTransferringToWriter(false);
        }
    };

    const renderWarningBanner = () => {
        if (!parsedData) return null;
        
        // Check for explicit timeout indicators
        const hasTimedOut = 
            parsedData.error === "Parsing timed out" || 
            parsedData.professional_summary === "Parsing timed out" ||
            parsedData.metadata?.timed_out === true;
            
        // Check for processing warning
        const hasWarning = parsedData.processing_warning !== undefined;
        
        if (!hasTimedOut && !hasWarning) return null;
        
        return (
            <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md">
                <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-6 w-6 text-amber-500 mr-2 mt-0.5" />
                    <div>
                        <h5 className="font-medium mb-1">Limited Parsing Results</h5>
                        <p className="text-sm">
                            {hasTimedOut 
                                ? "The parsing operation timed out. We've extracted some basic information, but for better results, try with a simplified CV." 
                                : "The parsing was close to the time limit and some sections may be incomplete."}
                        </p>
                        <p className="text-sm mt-2">
                            Tip: Using a more standard CV format can improve parsing accuracy.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const renderParsingInsights = () => {
        if (!parsedData) return null;

        // Check parsing status 
        const parsingStatus = parsedData.error === "Parsing timed out" ? "Partial (Timed Out)" : 
                              parsedData.processing_warning ? "Partial" : "Complete";

        const insights = [
            {
                label: 'Parsing Status',
                value: parsingStatus
            },
            {
                label: 'Total Sections Extracted',
                value: countParsedSections(parsedData)
            },
            {
                label: 'Skills Identified',
                value: parsedData.skills?.length || 0
            },
            {
                label: 'Work Experiences',
                value: parsedData.experience?.length || 0
            },
            {
                label: 'Education Entries',
                value: parsedData.education?.length || 0
            },
            {
                label: 'Parsing Time',
                value: `${parsingTime || parsedData.metadata?.parsing_time_seconds || '?'} sec`
            }
        ];

        return (
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
                    Parsing Insights
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    {insights.map(({ label, value }) => (
                        <div key={label} className="flex justify-between border-b pb-2">
                            <span className="text-gray-500 text-sm font-medium">
                                {label}
                            </span>
                            <span className={`text-sm font-semibold ${
                                label === 'Parsing Status' && value !== 'Complete' 
                                    ? 'text-amber-600' 
                                    : 'text-gray-700'
                            }`}>
                                {value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderParsingStatus = () => {
        if (!loading) return null;
        
        const elapsedSeconds = uploadStartTime ? Math.floor((Date.now() - uploadStartTime) / 1000) : 0;
        let statusMessage = 'Uploading document...';
        
        if (elapsedSeconds > 3) {
            statusMessage = 'Extracting content from document...';
        }
        
        if (elapsedSeconds > 8) {
            statusMessage = 'Analyzing CV structure...';
        }
        
        if (elapsedSeconds > 15) {
            statusMessage = 'Identifying sections and extracting data...';
        }
        
        if (elapsedSeconds > 25) {
            statusMessage = 'Processing complex content, this may take a moment...';
        }
        
        if (elapsedSeconds > 40) {
            statusMessage = 'Still working on your document. Complex CVs may take longer...';
        }
        
        return (
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-center mb-3">
                    <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-blue-800 text-sm font-medium">
                        {statusMessage}
                    </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${parsingProgress}%` }}
                    ></div>
                </div>
                
                <p className="mt-2 text-xs text-blue-700">
                    {elapsedSeconds < 30 ? 
                        'This usually takes 10-30 seconds depending on document complexity' : 
                        'Processing a complex document may take up to 60 seconds'
                    }
                </p>
            </div>
        );
    };

    const renderProfessionalSummary = () => {
        if (!parsedData?.professional_summary) return null;

        return (
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-md font-semibold text-gray-700 mb-2 border-b pb-2">
                    Professional Summary
                </h4>
                <p className="text-gray-600 text-sm">
                    {parsedData.professional_summary}
                </p>
            </div>
        );
    };

    const renderPersonalInfo = () => {
        if (!parsedData?.personal_info || Object.keys(parsedData.personal_info).length === 0) return null;

        return (
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
                    Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(parsedData.personal_info).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b pb-2 last:border-b-0">
                            <span className="text-gray-500 text-sm capitalize font-medium">
                                {key.replace('_', ' ')}
                            </span>
                            <span className="text-gray-700 text-sm font-semibold">
                                {value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderSkills = () => {
        if (!parsedData?.skills?.length) return null;

        return (
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
                    Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                    {parsedData.skills.map((skill, index) => (
                        <span 
                            key={index} 
                            className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full 
                            transition duration-300 ease-in-out hover:bg-blue-100 hover:scale-105 
                            flex items-center"
                            title={`Proficiency: ${skill.level}`}
                        >
                            {skill.name}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const renderExperience = () => {
        if (!parsedData?.experience?.length) return null;

        return (
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
                    Work Experience
                </h4>
                <div className="space-y-4">
                    {parsedData.experience.map((exp, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h5 className="font-medium text-gray-800">{exp.title}</h5>
                                    <p className="text-sm text-gray-600">{exp.company}</p>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {exp.start_date} - {exp.end_date || 'Present'}
                                </div>
                            </div>
                            {exp.description && (
                                <p className="mt-2 text-sm text-gray-600">{exp.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderEducation = () => {
        if (!parsedData?.education?.length) return null;

        return (
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
                    Education
                </h4>
                <div className="space-y-4">
                    {parsedData.education.map((edu, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h5 className="font-medium text-gray-800">{edu.degree}</h5>
                                    <p className="text-sm text-gray-600">{edu.institution}</p>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {edu.start_date} - {edu.end_date || 'Present'}
                                </div>
                            </div>
                            {edu.description && (
                                <p className="mt-2 text-sm text-gray-600">{edu.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderCertifications = () => {
        if (!parsedData?.certifications?.length) return null;

        return (
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
                    Certifications
                </h4>
                <div className="space-y-3">
                    {parsedData.certifications.map((cert, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                            <div>
                                <p className="font-medium text-gray-800">{cert.name}</p>
                                {cert.issuer && <p className="text-sm text-gray-600">{cert.issuer}</p>}
                            </div>
                            {cert.date && <div className="text-sm text-gray-500">{cert.date}</div>}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="text-center mb-8">
                <DocumentTextIcon className="mx-auto h-16 w-16 text-blue-500 opacity-70" />
                <h2 className="mt-4 text-2xl font-bold text-gray-800">CV Parser</h2>
                <p className="mt-2 text-sm text-gray-500">
                    Upload your CV to extract professional insights
                </p>
            </div>

            {!isAuthenticated && (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
                    <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
                        <span>You need to be logged in to use this feature. Please <button 
                            onClick={() => navigate('/login', { state: { returnTo: '/cv-parser' } })}
                            className="text-blue-600 underline hover:text-blue-800"
                        >login</button> first.</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-4 flex items-center text-red-600 bg-red-50 p-3 rounded-md">
                    <ExclamationTriangleIcon className="h-6 w-6 mr-3" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Upload your CV (PDF or DOCX)
                </label>
                <div className="flex items-center justify-center w-full">
                    <label 
                        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer 
                        hover:bg-gray-50 transition duration-300 ease-in-out group
                        ${!isAuthenticated || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ArrowUpTrayIcon className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition" />
                            <p className="mb-2 text-sm text-gray-500 group-hover:text-blue-600">
                                {file ? file.name : 'Click to select or drag and drop'}
                            </p>
                            <p className="text-xs text-gray-400">PDF or DOCX (Max 10MB)</p>
                        </div>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.docx"
                            className="hidden"
                            disabled={!isAuthenticated || loading}
                        />
                    </label>
                </div>
            </div>

            {renderParsingStatus()}

            <button
                onClick={handleUpload}
                disabled={!file || loading || !isAuthenticated}
                className={`w-full py-3 px-6 rounded-lg text-white font-semibold tracking-wide uppercase text-sm
                    transition duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${!file || loading || !isAuthenticated
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md'
                    }`}
            >
                {loading ? (
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </div>
                ) : (
                    <span>Upload and Parse CV</span>
                )}
            </button>

            {/* Parsed Data Section with Enhanced Styling */}
            {parsedData && (
                <div className="mt-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <div className="flex items-center">
                                <DocumentCheckIcon className="h-6 w-6 text-green-500 mr-2" />
                                <h3 className="text-lg font-medium text-gray-900">Parsed CV</h3>
                            </div>
                            <div>
                                <button
                                    onClick={handleTransferToWriter}
                                    disabled={transferringToWriter}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                                >
                                    {transferringToWriter ? 'Transferring...' : 'Send to CV Writer'}
                                </button>
                            </div>
                        </div>

                        {renderWarningBanner()}
                        {renderParsingInsights()}

                        {renderProfessionalSummary()}
                        {renderPersonalInfo()}
                        {renderSkills()}
                        {renderExperience()}
                        {renderEducation()}
                        {renderCertifications()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CVUpload;