    import React from 'react';
import { 
    DocumentTextIcon, 
    AcademicCapIcon, 
    BriefcaseIcon, 
    CodeBracketIcon, 
    GlobeAltIcon, 
    CheckBadgeIcon 
} from '@heroicons/react/24/solid';

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

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="flex items-center mb-8 border-b pb-4">
                <DocumentTextIcon className="h-12 w-12 text-blue-500 mr-4" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Comprehensive CV Analysis</h2>
                    <p className="text-sm text-gray-500">Detailed insights from your professional document</p>
                </div>
            </div>
            
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
                            {Array.isArray(data[key]) ? (
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