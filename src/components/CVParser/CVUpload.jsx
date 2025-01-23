import React, { useState } from 'react';
import { uploadDocument } from '../../api/cvParser';

const CVUpload = ({ onParseSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [parsedData, setParsedData] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            // Validate file type
            const fileType = selectedFile.type;
            if (fileType !== 'application/pdf' && fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                setError('Please upload a PDF or DOCX file');
                return;
            }
            // Validate file size (max 10MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('File size should be less than 10MB');
                return;
            }
            setFile(selectedFile);
            setError(null);
            setParsedData(null); // Reset parsed data when new file is selected
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
            if (err.response?.status === 401) {
                setError('Please log in to upload files');
            } else if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('Failed to upload and parse CV. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload your CV (PDF or DOCX)
                </label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.docx"
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
                {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
            </div>

            <button
                onClick={handleUpload}
                disabled={!file || loading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${!file || loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
                {loading ? 'Uploading...' : 'Upload and Parse CV'}
            </button>

            {/* Display parsed data */}
            {parsedData && (
                <div className="mt-8 bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Parsed CV Data</h3>
                    
                    {/* Professional Summary */}
                    {parsedData.professional_summary && (
                        <div className="mb-6">
                            <h4 className="text-md font-medium text-gray-700 mb-2">Professional Summary</h4>
                            <p className="text-gray-600 text-sm">{parsedData.professional_summary}</p>
                        </div>
                    )}

                    {/* Personal Information */}
                    {parsedData.personal_info && Object.keys(parsedData.personal_info).length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-md font-medium text-gray-700 mb-2">Personal Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(parsedData.personal_info).map(([key, value]) => (
                                    <div key={key}>
                                        <span className="text-gray-500 text-sm capitalize">{key.replace('_', ' ')}: </span>
                                        <span className="text-gray-700 text-sm">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {parsedData.skills && parsedData.skills.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-md font-medium text-gray-700 mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {parsedData.skills.map((skill, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CVUpload;