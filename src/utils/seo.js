const defaultMetadata = {
  title: 'Pius Shedrach | Business Websites',
  description:
    'Pius Shedrach designs and builds fast, modern websites that help businesses earn trust and win more clients.',
  siteUrl: 'http://localhost:5173',
  image: '/og.png',
  twitterUsername: '@PShedrach75368',
};

function getSiteMetadata(matches = []) {
  return matches.find(match => match.data?.siteMetadata)?.data.siteMetadata || defaultMetadata;
}

export function createMeta({ title, description, image, noindex = false } = {}) {
  return ({ location, matches }) => {
    const site = getSiteMetadata(matches);
    const pageTitle = title ? `${title} | ${site.title}` : site.title;
    const pageDescription = description || site.description;
    const imageUrl = new URL(image || site.image, site.siteUrl).href;
    const canonicalUrl = new URL(location.pathname, site.siteUrl).href;

    return [
      { title: pageTitle },
      { name: 'description', content: pageDescription },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: pageDescription },
      { property: 'og:image', content: imageUrl },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', content: site.twitterUsername },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: pageDescription },
      { name: 'twitter:image', content: imageUrl },
      { tagName: 'link', rel: 'canonical', href: canonicalUrl },
      ...(noindex ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
    ];
  };
}
