import React from 'react';
import { motion } from 'framer-motion';

const ErrorAlert = ({ message }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 
               text-red-800 dark:text-red-200 p-3 rounded-md mb-4"
  >
    {message}
  </motion.div>
);

export default ErrorAlert;
