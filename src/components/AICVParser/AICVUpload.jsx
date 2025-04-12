import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadCV } from '../../api/aiCvParser';
import { ArrowUpTrayIcon, DocumentTextIcon, CpuChipIcon, ChartBarIcon, BeakerIcon, DocumentMagnifyingGlassIcon, PencilSquareIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import cvImprovementService from '../../services/cvImprovement';

const LoadingStep = ({ step, currentStep, text, icon: Icon }) => (
    <div className={`flex items-center space-x-2 transition-all duration-500 ${currentStep === step ? 'text-purple-600 scale-105' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
            ${currentStep === step ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}>
            {currentStep > step ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <span className={`text-sm font-semibold ${currentStep === step ? 'text-purple-600' : 'text-gray-400'}`}>
                    {step + 1}
                </span>
            )}
        </div>
        <Icon className="w-5 h-5" />
        <span className={`text-sm font-medium ${currentStep === step ? 'text-purple-600' : 'text-gray-500'}`}>
            {text}
        </span>
    </div>
);

const ActionButton = ({ icon: Icon, text, onClick, primary = false, loading = false, disabled = false }) => (
    <button
        onClick={onClick}
        disabled={loading || disabled}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 w-full
            ${loading ? 'opacity-75 cursor-wait' : disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${primary 
                ? 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg' 
                : 'bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300'
            }`}
    >
        {loading ? (
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        ) : (
            <Icon className="w-5 h-5" />
        )}
        <span>{loading ? 'Processing...' : text}</span>
    </button>
);

const AICVUpload = ({ onUploadComplete }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [parsedResult, setParsedResult] = useState(null);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('');
    const [rewriteLoading, setRewriteLoading] = useState(false);
    const [rewriteStep, setRewriteStep] = useState(0);
    const [rewriteSuccess, setRewriteSuccess] = useState(false);
    const [rewriteResult, setRewriteResult] = useState(null);

    const loadingSteps = [
        { text: 'Extracting text from document', icon: DocumentTextIcon },
        { text: 'Processing with Ella...', icon: CpuChipIcon },
        { text: 'Analyzing content', icon: ChartBarIcon },
        { text: 'Structuring information', icon: BeakerIcon }
    ];

    const rewriteSteps = [
        { text: 'Analyzing CV content', icon: DocumentTextIcon },
        { text: 'Improving professional summary', icon: CpuChipIcon },
        { text: 'Enhancing experience descriptions', icon: ChartBarIcon },
        { text: 'Optimizing skills and keywords', icon: BeakerIcon }
    ];

    useEffect(() => {
        if (loading) {
            const messages = [
                'Initializing Ella...',
                'Analyzing document structure...',
                'Extracting key information...',
                'Processing professional experience...',
                'Identifying skills and qualifications...',
                'Organizing education history...',
                'Finalizing results...'
            ];
            
            let currentIndex = 0;
            const interval = setInterval(() => {
                setLoadingText(messages[currentIndex % messages.length]);
                currentIndex++;
                
                // Update progress and steps
                const progressIncrement = 100 / (messages.length * 1.5);
                setProgress(prev => Math.min(prev + progressIncrement, 95));
                setCurrentStep(prev => Math.min(prev + 1, loadingSteps.length - 1));
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [loading]);

    useEffect(() => {
        if (rewriteLoading) {
            const messages = [
                'Analyzing your CV structure...',
                'Enhancing professional tone...',
                'Optimizing for ATS compatibility...',
                'Adding impactful achievements...',
                'Improving skills presentation...',
                'Finalizing improvements...'
            ];
            
            let currentIndex = 0;
            const interval = setInterval(() => {
                setLoadingText(messages[currentIndex % messages.length]);
                currentIndex++;
                
                const progressIncrement = 100 / (messages.length * 1.5);
                setProgress(prev => Math.min(prev + progressIncrement, 95));
                setRewriteStep(prev => Math.min(prev + 1, rewriteSteps.length - 1));
            }, 2500);

            return () => clearInterval(interval);
        }
    }, [rewriteLoading]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Please upload a PDF or DOCX file');
                return;
            }
            
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                return;
            }
            
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setLoading(true);
        setError(null);
        setProgress(0);
        setCurrentStep(0);
        setUploadSuccess(false);

        try {
            const result = await uploadCV(file);
            setParsedResult(result);
            setUploadSuccess(true);
            if (onUploadComplete) {
                onUploadComplete(result);
            }
        } catch (error) {
            console.error('Error parsing CV:', error);
            setError(error.message || 'An error occurred while parsing your CV');
        } finally {
            setLoading(false);
        }
    };

    const handleReviewCV = () => {
        // Navigate to CV review page
        navigate('/cv-review', { state: { parsedData: parsedResult } });
    };

    const handleRewriteCV = async () => {
        try {
            // Validate parsed result first
            if (!parsedResult) {
                throw new Error('No CV data available for rewriting. Please upload your CV first.');
            }

            // Log the data being sent for debugging
            console.log('Sending CV data for rewrite:', parsedResult);

            setRewriteLoading(true);
            setError(null);
            setProgress(0);
            setRewriteStep(0);

            // Format the data for the rewrite service
            const cvData = {
                professional_summary: parsedResult.data?.professional_summary || '',
                experience: parsedResult.data?.experience?.map(exp => ({
                    job_title: exp.job_title || exp.position || '',
                    company_name: exp.company_name || exp.company || '',
                    description: exp.description || exp.job_description || ''
                })) || [],
                skills: Array.isArray(parsedResult.data?.skills) 
                    ? parsedResult.data.skills.map(s => s.name || s.skill_name || s).join(', ')
                    : parsedResult.data?.skills || ''
            };

            // Start rewrite process
            const result = await cvImprovementService.rewriteCV(cvData);
            
            console.log('Rewrite result:', result);

            if (result && result.rewritten) {
                // Show success message before navigation
                setUploadSuccess(false); // Hide current success state
                
                // Validate that we have a valid CV ID before navigating
                if (result.new_cv_id) {
                    // Navigate to CV preview with improvements
                    navigate(`/cv-writer/preview/${result.new_cv_id}`, {
                        state: { 
                            message: 'Your CV has been rewritten and improved!',
                            improvements: {
                                original: parsedResult.data,
                                rewritten: result.rewritten
                            }
                        }
                    });
                } else {
                    // Handle the case where new_cv_id is null or undefined
                    console.warn('No CV ID returned from server. Showing improvements without navigation.');
                    setRewriteSuccess(true);
                    setRewriteResult(result.rewritten);
                    setError(null);
                }
            } else if (result && result.error) {
                throw new Error(result.error);
            } else {
                throw new Error('Failed to create improved CV version. The service returned an invalid response.');
            }
        } catch (error) {
            console.error('Error rewriting CV:', error);
            let errorMessage = 'An error occurred while rewriting your CV.';
            
            if (error.response) {
                // Server responded with an error
                errorMessage = error.response.data?.error || 
                             error.response.data?.message || 
                             `Server error: ${error.response.status}`;
                console.error('Server error details:', error.response.data);
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = 'Unable to reach the server. Please check your connection and try again.';
            } else {
                // Error in request setup
                errorMessage = error.message || 'Failed to process your request.';
            }

            setError(errorMessage);
            // Scroll to error message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setRewriteLoading(false);
            setProgress(0);
            setRewriteStep(0);
        }
    };

    const handleATSCheck = () => {
        // Navigate to ATS compatibility check page
        navigate('/ats-check', { state: { parsedData: parsedResult } });
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">AI CV Parser</h2>
            <p className="text-gray-600 mb-6">
                Upload your CV to analyze its content and structure. Our AI will parse the information and help you improve it.
            </p>

            {error && (
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        <p>{error}</p>
                    </div>
                    <ActionButton 
                        icon={ArrowUpTrayIcon}
                        text="Try Again"
                        onClick={() => setError(null)}
                        primary
                    />
                </div>
            )}

            {loading ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-center space-x-6">
                        {loadingSteps.map((step, index) => (
                            <LoadingStep 
                                key={index} 
                                step={index} 
                                currentStep={currentStep} 
                                text={step.text}
                                icon={step.icon}
                            />
                        ))}
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div 
                            className="bg-blue-600 h-full rounded-full transition-all duration-500"
                            style={{width: `${progress}%`}}
                        ></div>
                    </div>
                    <p className="text-center text-gray-600">{loadingText || 'Processing your document...'}</p>
                </div>
            ) : uploadSuccess ? (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                        <p className="font-medium">Success! We've parsed your CV.</p>
                        <p className="text-sm mt-1">What would you like to do next?</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                        <ActionButton 
                            icon={ChartBarIcon}
                            text="Review Your CV"
                            onClick={handleReviewCV}
                            primary
                        />
                        <ActionButton
                            icon={PencilSquareIcon}
                            text="Improve Your CV"
                            onClick={handleRewriteCV}
                            loading={rewriteLoading}
                            disabled={rewriteLoading}
                        />
                    </div>
                    
                    {rewriteLoading && (
                        <div className="mt-4 p-4 border border-blue-100 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-3 mb-2">
                                <CpuChipIcon className="h-5 w-5 text-blue-500" />
                                <p className="font-medium text-blue-700">AI is improving your CV</p>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                                    style={{width: `${(rewriteStep / 3) * 100}%`}}
                                ></div>
                            </div>
                            <p className="text-sm text-blue-600 mt-2">
                                {rewriteStep === 0 && "Analyzing your professional summary..."}
                                {rewriteStep === 1 && "Enhancing your work experience..."}
                                {rewriteStep === 2 && "Optimizing your skills..."}
                                {rewriteStep === 3 && "Generating improved CV..."}
                            </p>
                        </div>
                    )}
                </div>
            ) : rewriteSuccess ? (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                        <p className="font-medium">Success! We've improved your CV.</p>
                        <p className="text-sm mt-1">Here are the improvements we made:</p>
                    </div>
                    
                    {rewriteResult && (
                        <div className="space-y-6">
                            {rewriteResult.professional_summary && (
                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <h3 className="font-bold text-gray-800 mb-2">Improved Professional Summary</h3>
                                    <p className="text-gray-700 whitespace-pre-line">{rewriteResult.professional_summary}</p>
                                </div>
                            )}
                            
                            {rewriteResult.experience && rewriteResult.experience.length > 0 && (
                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <h3 className="font-bold text-gray-800 mb-3">Improved Experience</h3>
                                    <div className="space-y-4">
                                        {rewriteResult.experience.map((exp, index) => (
                                            <div key={index} className="border-l-4 border-blue-500 pl-3 py-1">
                                                <p className="font-medium">{exp.job_title} at {exp.company_name}</p>
                                                <p className="text-gray-700 whitespace-pre-line">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {rewriteResult.skills && (
                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <h3 className="font-bold text-gray-800 mb-2">Improved Skills</h3>
                                    <p className="text-gray-700 whitespace-pre-line">{rewriteResult.skills}</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className="flex flex-wrap gap-4">
                        <ActionButton 
                            icon={ArrowUpTrayIcon}
                            text="Upload New CV"
                            onClick={() => {
                                setUploadSuccess(false);
                                setRewriteSuccess(false);
                                setRewriteResult(null);
                                setFile(null);
                                setParsedResult(null);
                            }}
                            primary
                        />
                    </div>
                </div>
            ) : (
                <label 
                    className="aspect-square w-full max-w-[280px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
                >
                    <ArrowUpTrayIcon className="w-10 h-10 text-gray-400 mb-3" />
                    <span className="text-gray-600 text-center px-4">
                        {file ? file.name : 'Drop your CV here or click to browse'}
                    </span>
                    <span className="text-sm text-gray-400 mt-2">PDF or DOCX (Max 10MB)</span>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.docx"
                        className="hidden"
                        disabled={loading}
                    />
                </label>
            )}
        </div>
    );
};

export default AICVUpload; 