import { useEffect } from 'react';

const SITE_NAME = 'Aarna Wedding Destination';
export const SITE_URL = (process.env.REACT_APP_SITE_URL || 'https://aarna.net.in').replace(/\/+$/, '');
const DEFAULT_IMAGE = `${SITE_URL}/images/logo512.png`;
const DEFAULT_ROBOTS = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    const firstAttr = Object.entries(attributes).find(([key]) => key !== 'content');
    if (firstAttr) {
      element.setAttribute(firstAttr[0], firstAttr[1]);
    }
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const upsertLink = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const getPublicUrl = (routePath) => {
  if (!routePath || routePath === '/') {
    return `${SITE_URL}/`;
  }

  return `${SITE_URL}${routePath}`;
};

export function usePageSeo({
  title,
  description,
  routePath = '/',
  canonicalPath,
  image = DEFAULT_IMAGE,
  robots = DEFAULT_ROBOTS,
  imageAlt = `${SITE_NAME} preview image`,
  type = 'website',
  jsonLd,
}) {
  useEffect(() => {
    const resolvedTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const resolvedUrl = getPublicUrl(routePath);
    const resolvedCanonicalUrl = getPublicUrl(canonicalPath || routePath);

    document.title = resolvedTitle;

    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: description,
    });
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: robots,
    });
    upsertMeta('meta[name="googlebot"]', {
      name: 'googlebot',
      content: robots,
    });
    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: resolvedTitle,
    });
    upsertMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: type,
    });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    });
    upsertMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: resolvedUrl,
    });
    upsertMeta('meta[property="og:image"]', {
      property: 'og:image',
      content: image,
    });
    upsertMeta('meta[property="og:image:alt"]', {
      property: 'og:image:alt',
      content: imageAlt,
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: SITE_NAME,
    });
    upsertMeta('meta[property="og:locale"]', {
      property: 'og:locale',
      content: 'en_IN',
    });
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: resolvedTitle,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    });
    upsertMeta('meta[name="twitter:url"]', {
      name: 'twitter:url',
      content: resolvedUrl,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: image,
    });
    upsertMeta('meta[name="twitter:image:alt"]', {
      name: 'twitter:image:alt',
      content: imageAlt,
    });
    upsertLink('link[rel="canonical"]', {
      rel: 'canonical',
      href: resolvedCanonicalUrl,
    });

    const existingJsonLd = document.head.querySelector('script[data-seo-json-ld="true"]');
    if (jsonLd) {
      const script = existingJsonLd || document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-seo-json-ld', 'true');
      script.textContent = JSON.stringify(jsonLd);
      if (!existingJsonLd) {
        document.head.appendChild(script);
      }
    } else if (existingJsonLd) {
      existingJsonLd.remove();
    }
  }, [canonicalPath, description, image, imageAlt, jsonLd, robots, routePath, title, type]);
}
