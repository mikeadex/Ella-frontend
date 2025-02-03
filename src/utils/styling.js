// Button Base Style - Common properties for all buttons
const buttonBase = "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

// Button Sizes
const buttonSizes = {
  sm: "text-sm px-2 py-1 sm:px-3 sm:py-1.5",
  md: "text-base px-3 py-1.5 sm:px-4 sm:py-2",
  lg: "text-lg px-4 py-2 sm:px-6 sm:py-3"
};

// Shared styles object containing all our styles
export const sharedStyles = {
  // Form Input Styles
  inputStyle: "w-full px-3 py-2 text-sm sm:text-base border-solid border-1 border-orange-300 rounded-md shadow-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-sky-500 placeholder:text-gray-400 transition-all duration-200",
  
  // Textarea Style
  textareaStyle: "w-full px-3 py-2 text-sm sm:text-base border-solid border-1 border-orange-300 rounded-md shadow-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-sky-500 p-3 min-h-[120px] sm:min-h-[200px] resize-y placeholder:text-gray-400",
  
  // Error Styles
  error: "flex items-center gap-2 text-sm sm:text-base text-red-700 font-medium mt-2 p-3 bg-red-50 border-l-4 border border-l-red-500 border-red-200 rounded-md shadow-sm",
  errorBorder: "border-red-500 bg-red-50/50 focus:border-red-500 focus:ring-red-500 transition-colors duration-200",
  errorIcon: "w-5 h-5 text-red-600 flex-shrink-0 animate-pulse",
  
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
  cardHeader: "p-3 sm:p-4 bg-sky-950 text-white rounded-t-lg",
  cardBody: "p-4 sm:p-6",

  // Section Styles
  sectionTitle: "text-lg sm:text-xl font-semibold text-gray-900",
  sectionSubtitle: "text-sm sm:text-base text-gray-600 mt-1",
  
  // Form Layout
  formGrid: "grid gap-4 sm:gap-6",
  formRow: "space-y-4 sm:flex sm:space-x-4 sm:space-y-0",
  formColumn: "flex-1",
  
  // Label Styles
  label: "block text-sm font-medium text-gray-700 mb-1",
  
  // List Styles
  list: "space-y-2 sm:space-y-3",
  listItem: "bg-white p-3 sm:p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow",
  
  // Responsive Container
  container: "w-full px-4 sm:px-6 lg:px-8 mx-auto",
  
  // Modal Styles
  modal: "fixed inset-0 z-50 overflow-y-auto",
  modalOverlay: "fixed inset-0 bg-black bg-opacity-50 transition-opacity",
  modalContent: "relative bg-white rounded-lg mx-auto my-8 max-w-lg w-full p-4 sm:p-6 shadow-xl",
  
  // Responsive Grid
  responsiveGrid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
  
  // Navigation
  nav: "flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4",
  navItem: "text-sm sm:text-base text-gray-600 hover:text-gray-900",
  
  // Status Indicators
  badge: "inline-flex items-center px-2 py-0.5 rounded text-xs sm:text-sm font-medium",
  badgeSuccess: "bg-green-100 text-green-800",
  badgeError: "bg-red-100 text-red-800",
  badgeWarning: "bg-yellow-100 text-yellow-800",
  badgeInfo: "bg-blue-100 text-blue-800"
};
