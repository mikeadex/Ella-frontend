import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    DocumentTextIcon, 
    AcademicCapIcon, 
    BriefcaseIcon, 
    CodeBracketIcon, 
    GlobeAltIcon, 
    CheckBadgeIcon,
    ArrowPathIcon,
    PencilSquareIcon
} from '@heroicons/react/24/solid';
import { transferToWriter } from '../../api/cvParser';

const sectionIcons = {
    'professional_summary': DocumentTextIcon,
    'education': AcademicCapIcon,
    'experience': BriefcaseIcon,
    'skills': CodeBracketIcon,
    'languages': GlobeAltIcon,
    'certifications': CheckBadgeIcon,
    'references': DocumentTextIcon,
    'social_media': DocumentTextIcon
};

const ParsedCV = ({ data }) => {
    const navigate = useNavigate();
    const [isTransferring, setIsTransferring] = useState(false);
    const [transferError, setTransferError] = useState(null);
    
    if (!data) return null;

    const sections = [
        { title: 'Professional Summary', key: 'professional_summary' },
        { title: 'Education', key: 'education' },
        { title: 'Experience', key: 'experience' },
        { title: 'Skills', key: 'skills' },
        { title: 'Languages', key: 'languages' },
        { title: 'Certifications', key: 'certifications' },
        { title: 'References', key: 'references' },
        { title: 'Social Media', key: 'social_media' },
    ];
    
    // Function to transfer parsed data to CV Writer
    const handleTransferToWriter = async () => {
        setIsTransferring(true);
        setTransferError(null);
        
        try {
            const result = await transferToWriter(data);
            console.log('Transfer successful:', result);
            
            // Navigate to the CV Writer page with the new CV ID
            navigate(`/cv-writer/write/${result.cv_id}`);
        } catch (error) {
            console.error('Transfer failed:', error);
            setTransferError(error.message || 'Failed to transfer data to CV Writer');
        } finally {
            setIsTransferring(false);
        }
    };

    // Helper function to render skills items
    const renderSkillsItems = (items) => {
        return (
            <div className="flex flex-wrap gap-2">
                {items.map((item, idx) => (
                    <span 
                        key={idx} 
                        className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                    >
                        {typeof item === 'string' ? item : item.name || 'Unnamed skill'}
                    </span>
                ))}
            </div>
        );
    };

    // Helper function to render languages items
    const renderLanguagesItems = (items) => {
        return (
            <div className="flex flex-wrap gap-2">
                {items.map((item, idx) => (
                    <span 
                        key={idx} 
                        className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm"
                    >
                        {typeof item === 'string' 
                            ? item 
                            : `${item.language || 'Unnamed'} ${item.proficiency ? `(${item.proficiency})` : ''}`}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-8 border-b pb-4">
                <div className="flex items-center">
                    <DocumentTextIcon className="h-12 w-12 text-blue-500 mr-4" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Comprehensive CV Analysis</h2>
                        <p className="text-sm text-gray-500">Detailed insights from your professional document</p>
                    </div>
                </div>
                
                {/* Transfer to CV Writer Button */}
                <button
                    onClick={handleTransferToWriter}
                    disabled={isTransferring}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg 
                              shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105
                              disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isTransferring ? (
                        <>
                            <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                            Transferring...
                        </>
                    ) : (
                        <>
                            <PencilSquareIcon className="h-5 w-5 mr-2" />
                            Improve with CV Writer
                        </>
                    )}
                </button>
            </div>
            
            {transferError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {transferError}
                </div>
            )}
            
            {isTransferring && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md flex items-center">
                    <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                    <span>Transferring your CV data to the writer... This may take a moment.</span>
                </div>
            )}
            
            {sections.map(({ title, key }) => {
                const SectionIcon = sectionIcons[key] || DocumentTextIcon;
                
                if (!data[key] || (Array.isArray(data[key]) && data[key].length === 0)) return null;
                
                return (
                    <div key={key} className="mb-6 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                        <div className="bg-white p-4 flex items-center border-b">
                            <SectionIcon className="h-6 w-6 text-blue-500 mr-3" />
                            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                        </div>
                        
                        <div className="p-4">
                            {/* Render skill tags if it's the skills section */}
                            {key === 'skills' && Array.isArray(data[key]) ? (
                                renderSkillsItems(data[key])
                            ) : key === 'languages' && Array.isArray(data[key]) ? (
                                renderLanguagesItems(data[key])
                            ) : Array.isArray(data[key]) ? (
                                <ul className="space-y-4">
                                    {data[key].map((item, index) => (
                                        <li 
                                            key={index} 
                                            className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition duration-300"
                                        >
                                            {Object.entries(item).map(([k, v]) => (
                                                <div 
                                                    key={k} 
                                                    className="flex justify-between text-sm mb-2 pb-2 border-b last:border-b-0"
                                                >
                                                    <span className="font-medium text-gray-600 capitalize">
                                                        {k.replace(/_/g, ' ')}
                                                    </span>
                                                    <span className="text-gray-800 font-semibold">{v}</span>
                                                </div>
                                            ))}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-700 italic">{data[key]}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ParsedCV;