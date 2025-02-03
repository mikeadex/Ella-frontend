export const DEGREE_QUALIFICATIONS = [
  { value: "high_school", label: "High School Diploma" },
  { value: "associate", label: "Associate's Degree" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate (Ph.D.)" },
  { value: "professional", label: "Professional Degree (MD, JD, etc.)" },
  { value: "vocational", label: "Vocational Certificate" },
  { value: "diploma", label: "Diploma" },
  { value: "foundation", label: "Foundation Degree" },
  { value: "other", label: "Other" }
];

export const FIELDS_OF_STUDY = [
  // STEM Fields
  { category: "Computer & Information Sciences", fields: [
    "Computer Science",
    "Software Engineering",
    "Information Technology",
    "Data Science",
    "Cybersecurity",
    "Artificial Intelligence",
    "Web Development",
  ]},
  { category: "Engineering", fields: [
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Aerospace Engineering",
    "Industrial Engineering",
    "Environmental Engineering",
  ]},
  { category: "Natural Sciences", fields: [
    "Physics",
    "Chemistry",
    "Biology",
    "Environmental Science",
    "Mathematics",
    "Statistics",
    "Geology",
  ]},
  
  // Business & Management
  { category: "Business", fields: [
    "Business Administration",
    "Finance",
    "Marketing",
    "Accounting",
    "Management",
    "International Business",
    "Entrepreneurship",
  ]},
  
  // Healthcare & Medicine
  { category: "Healthcare", fields: [
    "Medicine",
    "Nursing",
    "Pharmacy",
    "Public Health",
    "Dentistry",
    "Veterinary Medicine",
    "Healthcare Administration",
  ]},
  
  // Social Sciences & Humanities
  { category: "Social Sciences", fields: [
    "Psychology",
    "Sociology",
    "Political Science",
    "Anthropology",
    "Economics",
    "International Relations",
  ]},
  { category: "Arts & Humanities", fields: [
    "English Literature",
    "History",
    "Philosophy",
    "Languages",
    "Fine Arts",
    "Music",
    "Design",
  ]},
  
  // Education
  { category: "Education", fields: [
    "Elementary Education",
    "Secondary Education",
    "Special Education",
    "Educational Leadership",
    "Curriculum and Instruction",
  ]},
  
  // Law & Legal Studies
  { category: "Law", fields: [
    "Law",
    "Criminal Justice",
    "Legal Studies",
    "International Law",
  ]},
  
  // Media & Communications
  { category: "Media & Communications", fields: [
    "Journalism",
    "Mass Communications",
    "Public Relations",
    "Digital Media",
    "Broadcasting",
  ]},
];

// Utility function to get all fields as a flat array
export const getAllFieldsOfStudy = () => {
  return FIELDS_OF_STUDY.reduce((allFields, category) => {
    return [...allFields, ...category.fields];
  }, []).sort();
};

export const SKILL_CATEGORIES = [
  {
    name: 'Soft Skills',
    skills: [
      'Communication',
      'Teamwork',
      'Problem Solving',
      'Leadership',
      'Adaptability',
      'Time Management',
      'Creativity',
      'Emotional Intelligence',
      'Conflict Resolution',
      'Critical Thinking',
      'Collaboration',
      'Negotiation',
      'Empathy',
      'Active Listening',
      'Resilience'
    ]
  },
  {
    name: 'Technical Skills',
    skills: [
      'Python',
      'JavaScript',
      'React',
      'Node.js',
      'SQL',
      'Machine Learning',
      'Data Analysis',
      'Cloud Computing',
      'Docker',
      'Git',
      'TensorFlow',
      'AWS',
      'Kubernetes',
      'TypeScript',
      'GraphQL'
    ]
  },
  {
    name: 'Design Skills',
    skills: [
      'UI/UX Design',
      'Figma',
      'Adobe XD',
      'Sketch',
      'InVision',
      'Wireframing',
      'Prototyping',
      'Design Thinking',
      'Color Theory',
      'Typography',
      'User Research',
      'Interaction Design',
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Brand Design'
    ]
  }
];

export const INTEREST_CATEGORIES = [
  {
    name: "Sports & Fitness",
    interests: [
      "Basketball", "Football", "Tennis", "Swimming", "Yoga", "Running",
      "Cycling", "Hiking", "Rock Climbing", "Martial Arts", "Golf"
    ]
  },
  {
    name: "Arts & Culture",
    interests: [
      "Photography", "Painting", "Drawing", "Music", "Theater", "Dance",
      "Writing", "Poetry", "Film", "Museums", "Literature"
    ]
  },
  {
    name: "Technology",
    interests: [
      "Programming", "AI & Machine Learning", "Robotics", "Gaming",
      "Virtual Reality", "Web Development", "Blockchain", "Cybersecurity"
    ]
  },
  {
    name: "Lifestyle",
    interests: [
      "Cooking", "Baking", "Travel", "Fashion", "Interior Design",
      "Gardening", "Reading", "Meditation", "Volunteering"
    ]
  }
];

export const LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese",
  "Russian", "Chinese (Mandarin)", "Japanese", "Korean", "Arabic",
  "Hindi", "Bengali", "Dutch", "Greek", "Turkish", "Vietnamese",
  "Thai", "Swedish", "Danish", "Norwegian", "Finnish", "Polish",
  "Czech", "Hungarian", "Romanian", "Bulgarian", "Croatian",
  "Serbian", "Ukrainian", "Hebrew", "Persian", "Urdu", "Malay",
  "Indonesian", "Tagalog", "Swahili"
];

export const LANGUAGE_PROFICIENCY = [
  { value: "native", label: "Native", description: "Native or Bilingual Proficiency" },
  { value: "fluent", label: "Fluent", description: "Professional Working Proficiency" },
  { value: "advanced", label: "Advanced", description: "Advanced Working Proficiency" },
  { value: "intermediate", label: "Intermediate", description: "Limited Working Proficiency" },
  { value: "basic", label: "Basic", description: "Elementary Proficiency" },
  { value: "beginner", label: "Beginner", description: "Beginner/Basic Understanding" }
];

export const SUMMARY_TEMPLATES = [
  {
    title: "Experienced Professional",
    template: "Results-driven professional with [X] years of experience in [industry/field]. Proven track record of [key achievement] and expertise in [key skills]. Skilled at [relevant skill] and [relevant skill], consistently delivering [specific outcome]. Seeking to leverage my expertise in [target role/industry].",
    placeholder: true
  },
  {
    title: "Recent Graduate",
    template: "Recent [degree] graduate in [field] with strong foundation in [relevant skills]. Completed projects in [project types] demonstrating expertise in [technical skills]. Seeking to leverage academic excellence and [relevant experience] to contribute to [target role/company].",
    placeholder: true
  },
  {
    title: "Career Changer",
    template: "Versatile professional transitioning from [previous field] to [target field], bringing transferable skills in [skill 1], [skill 2], and [skill 3]. Successfully [key achievement] in previous role, demonstrating ability to [relevant competency]. Eager to apply unique perspective and proven abilities to [target role].",
    placeholder: true
  },
  {
    title: "Technical Specialist",
    template: "Innovative [job title] with expertise in [technical skill 1], [technical skill 2], and [technical skill 3]. Led development of [project/product] resulting in [specific outcome]. Proven ability to [key competency] while ensuring [important metric]. Seeking to advance technical expertise in [target role/company].",
    placeholder: true
  },
  {
    title: "Manager/Leader",
    template: "Dynamic leader with [X] years managing [team size/type] teams in [industry]. Successfully [key achievement] while directing [project/initiative]. Skilled in [leadership skill 1], [leadership skill 2], and [leadership skill 3], consistently achieving [specific outcomes]. Looking to bring strategic leadership to [target role].",
    placeholder: true
  }
];

export const SUMMARY_TIPS = [
  "Keep your summary concise (3-5 sentences)",
  "Focus on your most relevant achievements and skills",
  "Use action words and quantifiable results",
  "Tailor your summary to the specific job or industry",
  "Highlight what makes you unique",
  "Avoid generic phrases and clichés",
  "Include keywords from the job description",
  "Make it forward-looking - state your career goals"
];

export const SOCIAL_MEDIA_PLATFORMS = [
  {
    name: "LinkedIn",
    icon: "linkedin",
    placeholder: "https://linkedin.com/in/username",
    pattern: "^https?://((www|\\w\\w)\\.)?linkedin\\.com/.*$"
  },
  {
    name: "GitHub",
    icon: "github",
    placeholder: "https://github.com/username",
    pattern: "^https?://((www)\\.)?github\\.com/.*$"
  },
  {
    name: "Twitter",
    icon: "twitter",
    placeholder: "https://twitter.com/username",
    pattern: "^https?://((www|\\w\\w)\\.)?twitter\\.com/.*$"
  },
  {
    name: "Portfolio",
    icon: "globe",
    placeholder: "https://yourportfolio.com",
    pattern: "^https?://.*$"
  },
  {
    name: "Behance",
    icon: "behance",
    placeholder: "https://behance.net/username",
    pattern: "^https?://((www)\\.)?behance\\.net/.*$"
  },
  {
    name: "Dribbble",
    icon: "dribbble",
    placeholder: "https://dribbble.com/username",
    pattern: "^https?://((www)\\.)?dribbble\\.com/.*$"
  }
];

export const REFERENCE_TYPES = [
  "Professional",
  "Academic",
  "Personal",
  "Character"
];
