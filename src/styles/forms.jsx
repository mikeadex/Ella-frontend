// Form styling constants and utilities
export const formStyles = {
  // Container Styles
  container: {
    base: "rounded-lg border shadow-sm",
    dark: "dark:bg-gray-900 dark:border-yellow-500/30 dark:shadow-yellow-500/20"
  },

  // Header Styles
  header: {
    base: "px-6 py-4 border-b",
    dark: "dark:bg-gradient-to-r dark:from-yellow-900/40 dark:to-orange-900/40 dark:border-b dark:border-yellow-500/30"
  },

  headerText: {
    base: "text-xl font-semibold",
    dark: "dark:bg-clip-text dark:bg-gradient-to-r dark:from-yellow-400 dark:to-orange-400"
  },

  // Body Styles
  body: {
    base: "p-6",
    dark: "dark:bg-black"
  },

  // Label Styles
  label: {
    base: "block text-sm font-medium mb-1 text-gray-700",
    dark: "dark:text-yellow-300",
    required: "text-red-500"
  },

  // Input Styles
  input: {
    base: "w-full px-3 py-2 text-sm sm:text-base border rounded-md shadow-sm focus:outline-none placeholder:text-gray-400 transition-all duration-200",
    dark: "dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50"
  },

  // Error Styles
  error: {
    container: {
      base: "flex items-center gap-2 text-sm sm:text-base font-medium mt-2 p-3 rounded-md animate-fadeIn",
      dark: "dark:bg-red-950 dark:border-red-500/50 dark:text-red-300"
    },
    icon: {
      base: "w-5 h-5 flex-shrink-0",
      dark: "dark:text-red-400"
    },
    input: {
      base: "border-red-500 bg-red-50/50 focus:border-red-500 focus:ring-red-500",
      dark: "dark:border-red-500 dark:bg-red-950/50"
    }
  },

  // Layout Utilities
  layout: {
    splitRow: "space-y-4 sm:flex sm:space-x-4 sm:space-y-0",
    splitCol: "grid grid-cols-1 sm:grid-cols-2 gap-4",
    fullWidth: "w-full",
    flexGrow: "flex-1"
  }
};

// Utility function to combine form styles with dark mode
export const getFormStyles = (styleKey, isDark = false) => {
  const style = formStyles[styleKey];
  if (!style) return "";

  if (typeof style === "string") return style;
  return \`\${style.base} \${isDark ? style.dark || "" : ""}\`.trim();
};

// Utility function to combine multiple style objects
export const combineStyles = (...styles) => {
  return styles.filter(Boolean).join(" ").trim();
};
