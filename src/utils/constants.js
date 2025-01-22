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
    name: "Technical Skills",
    skills: [
      "JavaScript", "Python", "Java", "C++", "React", "Node.js", "SQL", "Git",
      "Docker", "AWS", "Azure", "Machine Learning", "Data Analysis", "DevOps",
      "Cloud Computing", "Cybersecurity", "UI/UX Design", "Mobile Development"
    ]
  },
  {
    name: "Soft Skills",
    skills: [
      "Communication", "Leadership", "Problem Solving", "Team Work", "Time Management",
      "Critical Thinking", "Adaptability", "Project Management", "Creativity",
      "Emotional Intelligence", "Conflict Resolution", "Decision Making"
    ]
  },
  {
    name: "Languages",
    skills: [
      "English", "Spanish", "French", "German", "Chinese", "Japanese", "Arabic",
      "Portuguese", "Italian", "Russian", "Korean", "Hindi"
    ]
  },
  {
    name: "Tools & Software",
    skills: [
      "Microsoft Office", "Adobe Creative Suite", "Jira", "Slack", "Figma",
      "Visual Studio Code", "AutoCAD", "Salesforce", "SAP", "Tableau", "Power BI"
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
    template: "Results-driven [profession] with [X] years of experience in [industry/field]. Proven track record of [key achievement] and [key skill]. Skilled in [relevant skills], with a focus on [specialization]. Seeking to leverage my expertise in [area] to drive success in [target role/industry]."
  },
  {
    title: "Recent Graduate",
    template: "Motivated [field] graduate with strong foundation in [key areas]. Demonstrated ability to [relevant skill] through [project/internship experience]. Eager to apply my knowledge in [specific areas] to contribute to [industry/field]."
  },
  {
    title: "Career Changer",
    template: "Versatile professional transitioning from [previous field] to [target field], bringing transferable skills in [relevant skills]. Combining [previous experience] with newly acquired expertise in [new skills/qualifications] to offer a unique perspective in [target role/industry]."
  },
  {
    title: "Senior Executive",
    template: "Strategic [job title] with [X] years of leadership experience in [industry]. Proven success in [key achievement] and [major responsibility]. Track record of [specific accomplishment], resulting in [measurable outcome]. Seeking to bring my expertise in [areas] to drive growth and innovation."
  }
];

export const SUMMARY_TIPS = [
  "Keep it concise (3-5 sentences)",
  "Focus on your most relevant achievements",
  "Use action words and quantifiable results",
  "Tailor it to your target role or industry",
  "Highlight your unique value proposition",
  "Include relevant keywords from job descriptions",
  "Avoid generic statements and clichés"
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
