import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadCV } from '../../api/aiCvParser';
import { ArrowUpTrayIcon, DocumentTextIcon, CpuChipIcon, ChartBarIcon, BeakerIcon, DocumentMagnifyingGlassIcon, PencilSquareIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import cvImprovementService from '../../services/cvImprovement';

const LoadingStep = ({ step, currentStep, text }) => (
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
        <div className="p-6">
            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                </div>
            )}

            <div className="flex flex-col items-center gap-8">
                {!loading && !uploadSuccess && (
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

                {loading && (
                    <div className="w-full max-w-[280px] bg-white rounded-xl p-6 shadow-lg border border-purple-100 animate-fadeIn">
                        <div className="space-y-4">
                            {loadingSteps.map((step, index) => (
                                <LoadingStep 
                                    key={index}
                                    step={index}
                                    currentStep={currentStep}
                                    text={step.text}
                                />
                            ))}
                        </div>
                        
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Processing Progress</span>
                                <span className="text-sm font-medium text-purple-600">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div 
                                    className="bg-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="mt-3 text-sm text-gray-500 text-center animate-pulse">
                                {loadingText}
                            </p>
                        </div>
                    </div>
                )}

                {rewriteLoading && (
                    <div className="w-full max-w-[280px] bg-white rounded-xl p-6 shadow-lg border border-purple-100 animate-fadeIn">
                        <div className="space-y-4">
                            {rewriteSteps.map((step, index) => (
                                <LoadingStep 
                                    key={index}
                                    step={index}
                                    currentStep={rewriteStep}
                                    text={step.text}
                                />
                            ))}
                        </div>
                        
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Improvement Progress</span>
                                <span className="text-sm font-medium text-purple-600">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div 
                                    className="bg-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="mt-3 text-sm text-gray-500 text-center animate-pulse">
                                {loadingText}
                            </p>
                        </div>
                    </div>
                )}

                {uploadSuccess && !rewriteLoading ? (
                    <div className="w-full max-w-[280px] animate-fadeIn">
                        <div className="bg-green-50 rounded-xl p-6 mb-6 text-center">
                            <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-green-700 mb-2">
                                CV Successfully Processed!
                            </h3>
                            <p className="text-sm text-green-600">
                                Your CV has been analyzed. Choose your next step:
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <ActionButton
                                icon={DocumentMagnifyingGlassIcon}
                                text="Review My CV"
                                onClick={handleReviewCV}
                                primary
                                disabled={rewriteLoading}
                            />
                            <ActionButton
                                icon={PencilSquareIcon}
                                text="Rewrite My CV"
                                onClick={handleRewriteCV}
                                loading={rewriteLoading}
                                disabled={rewriteLoading}
                            />
                            <ActionButton
                                icon={ChartBarIcon}
                                text="Check ATS Compatibility"
                                onClick={handleATSCheck}
                                disabled={rewriteLoading}
                            />
                        </div>
                    </div>
                ) : !loading && !rewriteLoading && (
                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className={`px-12 py-4 rounded-xl font-semibold text-white transition-all duration-300 text-lg
                            ${!file || loading
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg'
                            } w-full max-w-[280px]`}
                    >
                        {loading ? 'Processing...' : 'Get Started'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AICVUpload; 