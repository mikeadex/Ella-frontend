import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (title) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '/features' },
        { name: 'Templates', href: '/templates' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Create CV', href: '/cv-writer' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'CV Tips', href: '/tips' },
        { name: 'API', href: '/api' },
        { name: 'Status', href: '/status' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Licenses', href: '/licenses' },
      ]
    }
  ];

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="Ella Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                Ella
              </span>
            </Link>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-400 max-w-md">
              Create professional CVs with AI-powered tools and expert-designed templates.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex space-x-6">
              <a
                href="https://twitter.com/ella"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <span className="sr-only">Twitter</span>
                <FiTwitter className="h-6 w-6" />
              </a>
              <a
                href="https://github.com/ella"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <span className="sr-only">GitHub</span>
                <FiGithub className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com/company/ella"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <span className="sr-only">LinkedIn</span>
                <FiLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1">
              {/* Mobile Accordion Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="flex md:hidden w-full items-center justify-between py-2 text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider"
              >
                <span>{section.title}</span>
                {openSections[section.title] ? (
                  <FiChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <FiChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {/* Desktop Title */}
              <h3 className="hidden md:block text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                {section.title}
              </h3>

              {/* Links */}
              <ul className={`mt-4 space-y-3 ${!openSections[section.title] ? 'hidden md:block' : 'block'}`}>
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-base text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-500 dark:text-gray-400 text-center md:text-left">
              {currentYear} Ella. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 text-sm text-gray-500 dark:text-gray-400">
              <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Terms
              </Link>
              <Link to="/sitemap" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
