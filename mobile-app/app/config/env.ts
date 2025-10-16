// Centralized environment configuration for the mobile app
// No external libs (like react-native-config); uses defaults and optional global override

export type EnvConfig = {
  API_URL: string; // e.g., http://localhost:4000/api
  WS_URL: string; // e.g., http://localhost:4000
  TIMEOUT: number; // ms
};

const DEFAULTS: EnvConfig = {
  API_URL: 'http://localhost:4000/api',
  WS_URL: 'http://localhost:4000',
  TIMEOUT: 30000,
};

// Allow overriding via global for debugging or E2E without rebuilding
const g: any = globalThis as any;
const overrides: Partial<EnvConfig> = g && g.__SHAREUP_ENV__ ? g.__SHAREUP_ENV__ : {};

const ENV: EnvConfig = {
  ...DEFAULTS,
  ...overrides,
};

export const API_BASE_URL = ENV.API_URL;
export const WS_BASE_URL = ENV.WS_URL;
export const REQUEST_TIMEOUT = ENV.TIMEOUT;

export default ENV;
