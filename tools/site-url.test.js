// @vitest-environment node

import { afterEach, describe, expect, it } from 'vitest';
import { getSiteUrl } from './site-url.js';

const originalEnvironment = {
  SITE_URL: process.env.SITE_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  VITE_VERCEL_PROJECT_PRODUCTION_URL: process.env.VITE_VERCEL_PROJECT_PRODUCTION_URL,
};

afterEach(() => {
  for (const [name, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) {
      delete process.env[name];
    } else {
      process.env[name] = value;
    }
  }
});

describe('getSiteUrl', () => {
  it('prefers an explicitly configured canonical URL', () => {
    process.env.SITE_URL = 'https://portfolio.example/path';
    process.env.VERCEL_PROJECT_PRODUCTION_URL = 'fallback.vercel.app';

    expect(getSiteUrl({ allowLocal: false })).toBe('https://portfolio.example');
  });

  it('uses the Vercel production domain when SITE_URL is absent', () => {
    delete process.env.SITE_URL;
    process.env.VERCEL_PROJECT_PRODUCTION_URL = 'portfolio.vercel.app';

    expect(getSiteUrl({ allowLocal: false })).toBe('https://portfolio.vercel.app');
  });

  it('fails clearly when a production origin cannot be resolved', () => {
    delete process.env.SITE_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    delete process.env.VITE_VERCEL_PROJECT_PRODUCTION_URL;

    expect(() => getSiteUrl({ allowLocal: false })).toThrow(
      'SITE_URL is required outside Vercel',
    );
  });
});
