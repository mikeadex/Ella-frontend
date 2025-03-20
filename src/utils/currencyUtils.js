import React from 'react';
import countries from 'i18n-iso-countries';
import countriesEn from 'i18n-iso-countries/langs/en.json';

// Initialize the countries database
countries.registerLocale(countriesEn);

// Map of country codes to currency details
const countryCurrencyMap = {
  US: { code: 'USD', symbol: '$' },
  CA: { code: 'CAD', symbol: 'CA$' },
  GB: { code: 'GBP', symbol: '£' },
  EU: { code: 'EUR', symbol: '€' }, // Generic for EU countries
  AU: { code: 'AUD', symbol: 'A$' },
  JP: { code: 'JPY', symbol: '¥' },
  CN: { code: 'CNY', symbol: '¥' },
  IN: { code: 'INR', symbol: '₹' },
  BR: { code: 'BRL', symbol: 'R$' },
  RU: { code: 'RUB', symbol: '₽' },
  // EU countries
  AT: { code: 'EUR', symbol: '€' },
  BE: { code: 'EUR', symbol: '€' },
  BG: { code: 'EUR', symbol: '€' },
  HR: { code: 'EUR', symbol: '€' },
  CY: { code: 'EUR', symbol: '€' },
  CZ: { code: 'EUR', symbol: '€' },
  DK: { code: 'DKK', symbol: 'kr' },
  EE: { code: 'EUR', symbol: '€' },
  FI: { code: 'EUR', symbol: '€' },
  FR: { code: 'EUR', symbol: '€' },
  DE: { code: 'EUR', symbol: '€' },
  GR: { code: 'EUR', symbol: '€' },
  HU: { code: 'HUF', symbol: 'Ft' },
  IE: { code: 'EUR', symbol: '€' },
  IT: { code: 'EUR', symbol: '€' },
  LV: { code: 'EUR', symbol: '€' },
  LT: { code: 'EUR', symbol: '€' },
  LU: { code: 'EUR', symbol: '€' },
  MT: { code: 'EUR', symbol: '€' },
  NL: { code: 'EUR', symbol: '€' },
  PL: { code: 'PLN', symbol: 'zł' },
  PT: { code: 'EUR', symbol: '€' },
  RO: { code: 'RON', symbol: 'lei' },
  SK: { code: 'EUR', symbol: '€' },
  SI: { code: 'EUR', symbol: '€' },
  ES: { code: 'EUR', symbol: '€' },
  SE: { code: 'SEK', symbol: 'kr' },
  // Add more countries as needed
};

// Default to USD
const defaultCurrency = { code: 'USD', symbol: '$' };

/**
 * Get the user's country code based on browser locale or geolocation
 * @returns {Promise<string>} The country code
 */
export const getUserCountry = async () => {
  try {
    // Try to get country from Geolocation API
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    if (data && data.country) {
      return data.country;
    }
  } catch (error) {
    console.error('Error getting user location:', error);
  }

  // Fallback to browser locale
  try {
    const locale = navigator.language || navigator.userLanguage;
    if (locale) {
      const parts = locale.split('-');
      if (parts.length > 1) {
        return parts[1];
      }
    }
  } catch (error) {
    console.error('Error getting user locale:', error);
  }

  // Default to US if all else fails
  return 'US';
};

/**
 * Get currency details for a given country code
 * @param {string} countryCode - The ISO country code
 * @returns {Object} Currency details (symbol and code)
 */
export const getCurrencyForCountry = (countryCode) => {
  return countryCurrencyMap[countryCode] || defaultCurrency;
};

/**
 * Format a price with the appropriate currency symbol
 * @param {number} price - The price to format
 * @param {Object} currency - The currency details
 * @returns {string} Formatted price with currency symbol
 */
export const formatPrice = (price, currency = defaultCurrency) => {
  return `${currency.symbol}${parseFloat(price).toFixed(2)}`;
};

/**
 * Format a price for display in the interface
 * @param {number} price - The price to format
 * @param {string} countryCode - The country code for currency
 * @returns {string} Formatted price with currency symbol
 */
export const formatPriceForDisplay = (price, countryCode = 'US') => {
  const currency = getCurrencyForCountry(countryCode);
  return formatPrice(price, currency);
};

/**
 * Utility hook to get the user's currency based on their location
 * @returns {Object} Currency object with loading state and currency data
 */
export const useUserCurrency = () => {
  const [currency, setCurrency] = React.useState(defaultCurrency);
  const [loading, setLoading] = React.useState(true);
  const [countryCode, setCountryCode] = React.useState('US');

  React.useEffect(() => {
    const detectCurrency = async () => {
      try {
        setLoading(true);
        const country = await getUserCountry();
        setCountryCode(country);
        setCurrency(getCurrencyForCountry(country));
      } catch (error) {
        console.error('Error detecting currency:', error);
        setCurrency(defaultCurrency);
      } finally {
        setLoading(false);
      }
    };

    detectCurrency();
  }, []);

  return { currency, loading, countryCode };
};
