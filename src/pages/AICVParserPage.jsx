import React from 'react';
import AICVUpload from '../components/AICVParser/AICVUpload';
import { DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';

const AICVParserPage = () => {
    const handleUploadComplete = (result) => {
        console.log('Upload completed:', result);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden pt-20 pb-12 sm:pb-16">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-purple-100 mb-6">
                            <SparklesIcon className="h-5 w-5 text-purple-600 mr-2" />
                            <span className="text-purple-600 font-medium">AI-Powered CV Parser</span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
                            Professional CV in
                            <span className="block text-purple-600">Minutes</span>
                        </h1>
                        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-12">
                            Stand out from the crowd with Ella. An AI-powered CV builder. Create 
                            professional, ATS-friendly resumes tailored to your industry and experience level.
                        </p>

                        {/* Upload Section - Prominently Displayed */}
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform hover:shadow-3xl transition-all duration-300">
                                <div className="p-8 border-b border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your CV</h2>
                                    <p className="text-gray-600">Supported formats: PDF, DOCX (Max 10MB)</p>
                                </div>
                                <AICVUpload onUploadComplete={handleUploadComplete} />
                            </div>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <div className="flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-purple-200"></div>
                                    <div className="w-8 h-8 rounded-full bg-purple-300"></div>
                                    <div className="w-8 h-8 rounded-full bg-purple-400"></div>
                                </div>
                                <span className="ml-3 text-gray-600">Trusted by 2,000+ professionals</span>
                            </div>
                            <div className="flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full">
                                <span className="text-yellow-400 mr-2">★</span>
                                <span className="text-gray-600">Top-rated on ProductHunt</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        Powered by advanced AI technology • Secure and private • No data retention
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AICVParserPage; 