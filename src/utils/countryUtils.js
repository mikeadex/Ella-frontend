// Comprehensive mapping of country names to their ISO 3166-1 alpha-2 codes
export const countryNameToCode = {
  'United Kingdom': 'GB',
  'United States': 'US',
  'United States of America': 'US',
  'Canada': 'CA',
  'Australia': 'AU',
  'New Zealand': 'NZ',
  'Germany': 'DE',
  'France': 'FR',
  'Italy': 'IT',
  'Spain': 'ES',
  'Netherlands': 'NL',
  'Belgium': 'BE',
  'Switzerland': 'CH',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Ireland': 'IE',
  'Poland': 'PL',
  'Portugal': 'PT',
  'Brazil': 'BR',
  'Argentina': 'AR',
  'Mexico': 'MX',
  'China': 'CN',
  'Japan': 'JP',
  'South Korea': 'KR',
  'India': 'IN',
  'Russia': 'RU',
  'South Africa': 'ZA',
  'Israel': 'IL',
  'Singapore': 'SG',
  'United Arab Emirates': 'AE'
};

// Function to get country code, with fallback
export const getCountryCode = (countryName) => {
  if (!countryName) return null;
  
  // Try exact match first
  const code = countryNameToCode[countryName];
  if (code) return code;
  
  // Try case-insensitive match
  const lowercaseCountry = countryName.toLowerCase();
  for (const [country, countryCode] of Object.entries(countryNameToCode)) {
    if (country.toLowerCase() === lowercaseCountry) {
      return countryCode;
    }
  }
  
  // If no match found, return null
  return null;
};
