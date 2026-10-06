import axios from 'axios';
import { handleMockRequest } from './mockAdapter';

export const API_BASE_URL = 'http://127.0.0.1:3000/api';

// Pure frontend client-side adapter for 100% offline & standalone reliability
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  adapter: async (config) => {
    try {
      // Normalize URL: remove base URL and trailing slashes if present
      let cleanUrl = config.url || '';
      if (cleanUrl.startsWith(API_BASE_URL)) {
        cleanUrl = cleanUrl.substring(API_BASE_URL.length);
      }
      if (cleanUrl.endsWith('/') && cleanUrl.length > 1) {
        cleanUrl = cleanUrl.slice(0, -1);
      }
      if (!cleanUrl.startsWith('/')) {
        cleanUrl = '/' + cleanUrl;
      }

      const res = await handleMockRequest({ ...config, url: cleanUrl });
      return {
        data: res.data,
        status: res.status || 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {},
      };
    } catch (err) {
      console.error('Frontend Mock Adapter Error:', err);
      return Promise.reject(err);
    }
  },
});

export default apiClient;
