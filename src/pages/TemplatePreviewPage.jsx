import React, { useState } from 'react';
import CVTemplateRenderer from '../components/CVTemplates/CVTemplateRenderer';
import './TemplatePreviewPage.css';

// Sample CV data for preview
const sampleCVData = {
  profile: {
    name: "Jamie Smith",
    title: "Senior Software Developer",
    email: "jamie.smith@example.com",
    phone: "+44 7700 900123"
  },
  contacts: [
    { icon: "envelope", value: "jamie.smith@example.com" },
    { icon: "phone", value: "+44 7700 900123" },
    { icon: "globe", value: "jamiesmith.dev" },
    { icon: "map-marker", value: "London, UK" }
  ],
  professionalSummary: "Experienced software developer with over 8 years of experience building scalable applications. Skilled in React, Node.js, and cloud infrastructure. Passionate about clean code and user-centered design. Led development teams to deliver enterprise solutions that increased operational efficiency by 30%.",
  education: [
    {
      degree: "MSc Computer Science",
      institution: "University College London",
      period: "2015 - 2016"
    },
    {
      degree: "BSc Software Engineering",
      institution: "University of Manchester",
      period: "2012 - 2015"
    }
  ],
  workExperience: [
    {
      title: "Senior Software Developer",
      job_title: "Senior Software Developer",
      company: "Tech Innovations Ltd",
      company_name: "Tech Innovations Ltd",
      start_date: "Jan 2020",
      end_date: "Present",
      period: "Jan 2020 - Present",
      location: "London, UK",
      description: "Lead a team of 6 developers building enterprise SaaS products using React, Node.js and AWS. Architected microservices infrastructure that scaled to support 2M+ users.",
      job_description: "Lead a team of 6 developers building enterprise SaaS products using React, Node.js and AWS. Architected microservices infrastructure that scaled to support 2M+ users.",
      responsibilities: [
        "Reduced application load time by 40% through code optimization",
        "Implemented CI/CD pipeline that cut deployment time from days to minutes",
        "Led transition from monolith to microservices architecture"
      ],
      achievements: [
        "Reduced application load time by 40% through code optimization",
        "Implemented CI/CD pipeline that cut deployment time from days to minutes",
        "Led transition from monolith to microservices architecture"
      ]
    },
    {
      title: "Full Stack Developer",
      job_title: "Full Stack Developer",
      company: "Digital Solutions",
      company_name: "Digital Solutions",
      start_date: "Mar 2017",
      end_date: "Dec 2019",
      period: "Mar 2017 - Dec 2019",
      location: "Manchester, UK",
      description: "Developed web applications for financial services clients. Worked with React, Django and PostgreSQL to create responsive and secure applications.",
      job_description: "Developed web applications for financial services clients. Worked with React, Django and PostgreSQL to create responsive and secure applications.",
      responsibilities: [
        "Built authentication system with 2FA that became company standard",
        "Developed data visualization dashboard for financial analytics",
        "Mentored junior developers and led code reviews"
      ],
      achievements: [
        "Built authentication system with 2FA that became company standard",
        "Developed data visualization dashboard for financial analytics",
        "Mentored junior developers and led code reviews"
      ]
    },
    {
      title: "Junior Developer",
      job_title: "Junior Developer",
      company: "WebTech Startup",
      company_name: "WebTech Startup",
      start_date: "Jun 2015",
      end_date: "Feb 2017",
      period: "Jun 2015 - Feb 2017",
      location: "London, UK",
      description: "Worked on front-end development for e-commerce platforms. Implemented responsive designs and integrated with payment gateways.",
      job_description: "Worked on front-end development for e-commerce platforms. Implemented responsive designs and integrated with payment gateways.",
      responsibilities: [
        "Improved checkout conversion rate by 15% through UX redesign",
        "Implemented A/B testing framework for product pages",
        "Created reusable component library for faster development"
      ],
      achievements: [
        "Improved checkout conversion rate by 15% through UX redesign",
        "Implemented A/B testing framework for product pages",
        "Created reusable component library for faster development"
      ]
    }
  ],
  skills: [
    { name: "JavaScript", level: 95, levelDisplay: "95%" },
    { name: "React", level: 90, levelDisplay: "90%" },
    { name: "Node.js", level: 85, levelDisplay: "85%" },
    { name: "TypeScript", level: 80, levelDisplay: "80%" },
    { name: "AWS", level: 75, levelDisplay: "75%" },
    { name: "Python", level: 70, levelDisplay: "70%" },
    { name: "Docker", level: 80, levelDisplay: "80%" },
    { name: "CI/CD", level: 85, levelDisplay: "85%" },
    { name: "GraphQL", level: 75, levelDisplay: "75%" },
    { name: "RESTful APIs", level: 90, levelDisplay: "90%" }
  ],
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Intermediate" },
    { name: "French", level: "Basic" }
  ],
  certifications: [
    { name: "AWS Certified Solutions Architect", date: "2023" },
    { name: "Professional Scrum Master I", date: "2021" },
    { name: "Google Cloud Professional Developer", date: "2020" }
  ],
  interests: [
    { name: "Open Source Development" },
    { name: "Machine Learning" },
    { name: "Hiking" },
    { name: "Photography" }
  ]
};

const TemplatePreviewPage = () => {
  return (
    <div className="template-preview-page">
      <header className="preview-header">
        <h1>CV Template Preview</h1>
        <p>Select a template below to preview it with sample data</p>
      </header>
      
      <div className="template-preview-container">
        <CVTemplateRenderer cvData={sampleCVData} />
      </div>
    </div>
  );
};

export default TemplatePreviewPage;
