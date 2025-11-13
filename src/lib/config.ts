/**
 * Configuration for security headers and CSP
 * Add this to your index.html or configure in your server
 */

export const securityConfig = {
  // Content Security Policy
  csp: {
    directives: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'", // Required for Vite in dev mode
        'https://static.zdassets.com', // Zendesk
        'https://ekr.zdassets.com', // Zendesk
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Required for shadcn/ui and Tailwind
        'https://fonts.googleapis.com',
      ],
      'font-src': [
        "'self'",
        'https://fonts.gstatic.com',
        'data:', // For inline fonts
      ],
      'img-src': [
        "'self'",
        'data:',
        'https:', // Leaflet tiles from various CDNs
        'blob:',
      ],
      'connect-src': [
        "'self'",
        'http://localhost:8000', // Backend API
        'https://*.tile.openstreetmap.org', // Leaflet tiles
        'https://static.zdassets.com', // Zendesk
      ],
      'frame-src': ["'none'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'upgrade-insecure-requests': [],
    },
  },

  // Recommended HTTP security headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(self), microphone=(), camera=()',
  },
};

/**
 * Environment variables validation
 */
export const validateEnv = () => {
  const required = [] as string[]; // Add required env vars here
  const missing = required.filter((key) => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};

/**
 * API configuration
 */
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  retries: 2,
};

/**
 * Feature flags
 */
export const featureFlags = {
  enableZendesk: import.meta.env.VITE_ENABLE_ZENDESK === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableChatbot: import.meta.env.VITE_ENABLE_CHATBOT !== 'false', // Default to true
};
