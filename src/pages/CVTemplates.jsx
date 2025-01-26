import React, { useState } from 'react';
import { 
  ModernTemplate, 
  MinimalistTemplate, 
  Template1, 
  Template2, 
  ProfessionalTemplate, 
  ModernTemplate2 
} from '../components/CVTemplates';
import { transformCVData } from '../utils/dataTransformer';

const sampleData = {
  personalInfo: {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    contact_number: "+1 (555) 123-4567",
    address: "123 Main Street",
    city: "San Francisco",
    country: "USA"
  },
  professionalSummary: "Experienced software engineer with over 8 years of expertise in full-stack development. Passionate about creating scalable solutions and mentoring junior developers.",
  experience: [
    {
      job_title: "Senior Software Engineer",
      company_name: "Tech Solutions Inc.",
      start_date: "2020-01",
      end_date: "",
      current: true,
      job_description: "Lead developer for enterprise applications",
      achievements: "• Improved system performance by 40%\n• Led team of 5 developers\n• Implemented CI/CD pipeline"
    },
    {
      job_title: "Software Engineer",
      company_name: "Digital Innovations",
      start_date: "2017-03",
      end_date: "2019-12",
      current: false,
      job_description: "Full-stack developer for web applications",
      achievements: "• Developed 3 major features\n• Reduced bug count by 60%\n• Mentored 2 junior developers"
    }
  ],
  education: [
    {
      degree: "Master of Science",
      school_name: "Tech University",
      field_of_study: "Computer Science",
      start_date: "2015",
      end_date: "2017",
      current: false
    }
  ],
  skills: [
    { skill_name: "JavaScript", skill_level: "Expert" },
    { skill_name: "React", skill_level: "Expert" },
    { skill_name: "Node.js", skill_level: "Intermediate" },
    { skill_name: "Python", skill_level: "Intermediate" }
  ],
  languages: [
    { language_name: "English", language_level: "Native" },
    { language_name: "Spanish", language_level: "Intermediate" }
  ],
  interests: [
    { name: "Software Architecture" },
    { name: "Machine Learning" },
    { name: "Open Source" }
  ],
  references: [
    {
      name: "Jane Smith",
      title: "Engineering Manager",
      company: "Tech Solutions Inc.",
      email: "jane.smith@example.com",
      phone: "+1 (555) 987-6543",
      reference_type: "Professional"
    }
  ],
  socialMedia: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/johndoe" },
    { platform: "GitHub", url: "https://github.com/johndoe" }
  ]
};

const templates = [
  {
    id: 'modern',
    name: 'Modern Template',
    description: 'Clean and contemporary design with a focus on visual hierarchy',
    component: ModernTemplate
  },
  {
    id: 'minimalist',
    name: 'Minimalist Template',
    description: 'Simple and elegant layout with a sidebar for key information',
    component: MinimalistTemplate
  },
  {
    id: 'template1',
    name: 'Professional Template',
    description: 'Traditional format perfect for corporate and business roles',
    component: Template1
  },
  {
    id: 'template2',
    name: 'Creative Template',
    description: 'Bold and unique design for creative professionals',
    component: Template2
  }
];

const CVTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const transformedData = transformCVData(sampleData);

  const handlePrevious = () => {
    setSelectedTemplate((prev) => (prev === 0 ? templates.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedTemplate((prev) => (prev === templates.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {templates[selectedTemplate].name}
              </h2>
              <p className="text-gray-600">
                {templates[selectedTemplate].description}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handlePrevious}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Template Preview */}
        <div className="p-6">
          <div className="border rounded-lg p-8 bg-white">
            {selectedTemplate === 0 && <ModernTemplate data={transformedData} />}
            {selectedTemplate === 1 && <MinimalistTemplate data={transformedData} />}
            {selectedTemplate === 2 && <ProfessionalTemplate data={transformedData} />}
            {selectedTemplate === 3 && <ModernTemplate2 data={transformedData} />}
          </div>
        </div>

        {/* Template Actions */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Print Preview
          </button>
          <button
            onClick={() => {
              // Handle using the selected template
              console.log(`Using template: ${templates[selectedTemplate].id}`);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Use This Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVTemplates;
