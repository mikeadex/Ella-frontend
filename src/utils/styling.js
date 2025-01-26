// Button Base Style - Common properties for all buttons
const buttonBase = "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

// Button Sizes
const buttonSizes = {
  sm: "text-sm px-3 py-1.5",
  md: "text-base px-4 py-2",
  lg: "text-lg px-6 py-3"
};

// Shared styles object containing all our styles
export const sharedStyles = {
  // Form Input Styles
  inputStyle: "input input-field w-full border-solid border-1 border-orange-300 rounded-md shadow-lg shadow-slate-500/20 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-sky-500",
  
  // Textarea Style
  textareaStyle: "w-full border-solid border-1 border-orange-300 rounded-md shadow-lg shadow-slate-500/20 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-sky-500 p-3 min-h-[200px] resize-y",
  
  // Error Styles
  error: "flex items-center gap-2 text-red-500 text-sm mt-1",
  errorBorder: "border-red-500",
  
  // Button Styles
  buttonBase,
  buttonSizes,
  
  // Button Variants
  buttonPrimary: `${buttonBase} bg-sky-950 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500`,
  buttonSecondary: `${buttonBase} bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 focus:ring-gray-500`,
  buttonOutline: `${buttonBase} border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus:ring-blue-500`,
  buttonDanger: `${buttonBase} bg-red-900 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500`,
  buttonSuccess: `${buttonBase} bg-orange-400 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500`,
  buttonGhost: `${buttonBase} text-gray-600 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500`,
  buttonLink: `${buttonBase} text-blue-600 hover:text-blue-700 hover:underline focus:ring-blue-500 p-0`,

  // Card Styles
  card: "bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200",
  cardHeader: "p-4 bg-sky-950 text-white rounded-t-lg",
  cardBody: "p-6",

  // Education list styles
  educationList: "grid gap-4 sm:grid-cols-2",
  educationCard: "bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200",
  educationHeader: "p-4 border-b border-gray-100",
  educationTitle: "text-lg font-semibold text-gray-900",
  educationSubtitle: "text-sm text-gray-600 mt-1",
  educationBody: "p-4",
  educationMeta: "flex items-center text-sm text-gray-500 space-x-2",
  educationDelete: "absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors",

  // Experience list styles
  experienceList: "grid gap-4 sm:grid-cols-2",
  experienceCard: "bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200",
  experienceHeader: "p-4 border-b border-gray-100",
  experienceTitle: "text-lg font-semibold text-gray-900",
  experienceSubtitle: "text-sm text-gray-600 mt-1",
  experienceBody: "p-4",
  experienceMeta: "flex items-center text-sm text-gray-500 space-x-2",
  experienceDelete: "absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors",
};
