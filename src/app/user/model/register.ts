export interface Country {
  name: string;
  code: string; // ISO 3166-1 alpha-2
  dialCode: string;
}

export const COUNTRY_LIST: readonly Country[] = [
  { name: 'India', code: 'IN', dialCode: '+91' },
  { name: 'United States', code: 'US', dialCode: '+1' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44' },
  { name: 'Germany', code: 'DE', dialCode: '+49' },
  { name: 'Canada', code: 'CA', dialCode: '+1' },
  { name: 'Australia', code: 'AU', dialCode: '+61' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971' },
  { name: 'France', code: 'FR', dialCode: '+33' },
] as const;