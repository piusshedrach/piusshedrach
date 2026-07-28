const localSiteUrl = 'http://localhost:5173';

export function getSiteUrl({ allowLocal = process.env.NODE_ENV !== 'production' } = {}) {
  const configuredUrl = process.env.SITE_URL;
  const vercelDomain =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VITE_VERCEL_PROJECT_PRODUCTION_URL;
  const candidate = configuredUrl || (vercelDomain ? `https://${vercelDomain}` : null);

  if (!candidate) {
    if (allowLocal) {
      return localSiteUrl;
    }

    throw new Error(
      'SITE_URL is required outside Vercel. Set it to the canonical production origin.',
    );
  }

  const siteUrl = new URL(
    /^[a-z][a-z\d+.-]*:\/\//i.test(candidate) ? candidate : `https://${candidate}`,
  );

  if (!['http:', 'https:'].includes(siteUrl.protocol)) {
    throw new Error('SITE_URL must use the http or https protocol.');
  }

  return siteUrl.origin;
}
