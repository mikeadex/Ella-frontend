import React, { useState } from 'react';
import { uploadDocument } from '../../api/cvParser';
import { 
    DocumentTextIcon, 
    ArrowUpTrayIcon, 
    CheckBadgeIcon, 
    ExclamationTriangleIcon 
} from '@heroicons/react/24/solid';

// Utility function to count non-empty sections
const countParsedSections = (parsedData) => {
    if (!parsedData) return 0;
    return Object.keys(parsedData).filter(key => 
        parsedData[key] && 
        (Array.isArray(parsedData[key]) ? parsedData[key].length > 0 : Boolean(parsedData[key]))
    ).length;
};

const CVUpload = ({ onParseSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [parsedData, setParsedData] = useState(null);

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
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await uploadDocument(file);
            setParsedData(result.data);
            
            if (onParseSuccess) {
                onParseSuccess(result.data);
            }
        } catch (err) {
            console.error('Upload error:', err);
            const errorMessage = err.response?.data?.error || 
                                 (err.response?.status === 401 
                                    ? 'Please log in to upload files' 
                                    : 'Failed to upload and parse CV. Please try again.');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const renderParsingInsights = () => {
        if (!parsedData) return null;

        const insights = [
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
                            <span className="text-gray-700 text-sm font-semibold">
                                {value}
                            </span>
                        </div>
                    ))}
                </div>
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

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="text-center mb-8">
                <DocumentTextIcon className="mx-auto h-16 w-16 text-blue-500 opacity-70" />
                <h2 className="mt-4 text-2xl font-bold text-gray-800">CV Parser</h2>
                <p className="mt-2 text-sm text-gray-500">
                    Upload your CV to extract professional insights
                </p>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Upload your CV (PDF or DOCX)
                </label>
                <div className="flex items-center justify-center w-full">
                    <label 
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer 
                        hover:bg-gray-50 transition duration-300 ease-in-out group"
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
                        />
                    </label>
                </div>

                {error && (
                    <div className="mt-4 flex items-center text-red-600 bg-red-50 p-3 rounded-md">
                        <ExclamationTriangleIcon className="h-6 w-6 mr-3" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
            </div>

            <button
                onClick={handleUpload}
                disabled={!file || loading}
                className={`w-full py-3 px-6 rounded-lg text-white font-semibold tracking-wide uppercase text-sm
                    transition duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${!file || loading 
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
                        Uploading...
                    </div>
                ) : (
                    <span>Upload and Parse CV</span>
                )}
            </button>

            {/* Parsed Data Section with Enhanced Styling */}
            {parsedData && (
                <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-6">
                        <CheckBadgeIcon className="h-8 w-8 text-green-500 mr-3" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">CV Parsing Complete</h3>
                            <p className="text-sm text-gray-500">Comprehensive CV Analysis</p>
                        </div>
                    </div>
                    
                    {renderParsingInsights()}

                    {/* Professional Summary */}
                    {parsedData.professional_summary && (
                        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="text-md font-semibold text-gray-700 mb-2 border-b pb-2">
                                Professional Summary
                            </h4>
                            <p className="text-gray-600 text-sm italic">
                                {parsedData.professional_summary}
                            </p>
                        </div>
                    )}

                    {renderPersonalInfo()}
                    {renderSkills()}
                </div>
            )}
        </div>
    );
};

export default CVUpload;