// Environment variable validation utility

export interface EnvValidationResult {
  isValid: boolean;
  missingKeys: string[];
  warnings: string[];
}

export interface RequiredEnvVars {
  NEXT_PUBLIC_GEMINI_API_KEY?: string;
  NEXT_PUBLIC_UNSPLASH_ACCESS_KEY?: string;
  NEXT_PUBLIC_OPENWEATHER_API_KEY?: string;
}

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_GEMINI_API_KEY',
  'NEXT_PUBLIC_UNSPLASH_ACCESS_KEY',
  'NEXT_PUBLIC_OPENWEATHER_API_KEY'
] as const;

const ENV_VAR_DESCRIPTIONS: Record<string, string> = {
  NEXT_PUBLIC_GEMINI_API_KEY: 'Google Gemini API key for AI-powered destination suggestions',
  NEXT_PUBLIC_UNSPLASH_ACCESS_KEY: 'Unsplash API key for destination images',
  NEXT_PUBLIC_OPENWEATHER_API_KEY: 'OpenWeatherMap API key for weather data'
};

/**
 * Validates that all required environment variables are present
 * @returns Validation result with missing keys and warnings
 */
export function validateEnvironmentVariables(): EnvValidationResult {
  const missingKeys: string[] = [];
  const warnings: string[] = [];

  // Check each required environment variable
  for (const key of REQUIRED_ENV_VARS) {
    const value = process.env[key];
    
    if (!value || value.trim() === '') {
      missingKeys.push(key);
      console.error(`❌ Missing required environment variable: ${key}`);
      console.error(`   Description: ${ENV_VAR_DESCRIPTIONS[key]}`);
    } else {
      console.log(`✅ ${key} is configured`);
      
      // Warn if the key looks like a placeholder
      if (value.includes('your_') || value.includes('YOUR_') || value === 'placeholder') {
        warnings.push(`${key} appears to be a placeholder value. Please update with a real API key.`);
        console.warn(`⚠️  ${key} appears to be a placeholder value`);
      }
    }
  }

  const isValid = missingKeys.length === 0;

  if (!isValid) {
    console.error('\n❌ Environment validation failed!');
    console.error('Missing environment variables:', missingKeys.join(', '));
    console.error('\nTo fix this:');
    console.error('1. Create a .env.local file in the project root');
    console.error('2. Add the missing environment variables:');
    missingKeys.forEach(key => {
      console.error(`   ${key}=your_api_key_here`);
    });
    console.error('\n3. Restart the development server');
    console.error('\nSee .env.example for reference.');
  } else if (warnings.length > 0) {
    console.warn('\n⚠️  Environment validation passed with warnings:');
    warnings.forEach(warning => console.warn(`   - ${warning}`));
  } else {
    console.log('\n✅ All environment variables are properly configured!');
  }

  return {
    isValid,
    missingKeys,
    warnings
  };
}

/**
 * Checks if a specific API key is available
 * @param keyName - Name of the environment variable
 * @returns true if the key exists and is not empty
 */
export function hasApiKey(keyName: keyof RequiredEnvVars): boolean {
  const value = process.env[keyName];
  return !!value && value.trim() !== '';
}

/**
 * Gets a safe error message for missing API keys
 * @param keyName - Name of the environment variable
 * @returns User-friendly error message
 */
export function getMissingKeyError(keyName: keyof RequiredEnvVars): string {
  const description = ENV_VAR_DESCRIPTIONS[keyName] || 'API service';
  return `${description} is not configured. Please add ${keyName} to your .env.local file.`;
}

/**
 * Logs environment configuration status (safe for client-side)
 */
export function logEnvironmentStatus(): void {
  console.group('🔧 Environment Configuration Status');
  
  REQUIRED_ENV_VARS.forEach(key => {
    const isConfigured = hasApiKey(key);
    const status = isConfigured ? '✅' : '❌';
    console.log(`${status} ${key}: ${isConfigured ? 'Configured' : 'Missing'}`);
  });
  
  console.groupEnd();
}

// Run validation on module load (server-side only)
if (typeof window === 'undefined') {
  validateEnvironmentVariables();
}
