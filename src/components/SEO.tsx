import { useEffect } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function SEO({ title, description, image, url }: SEOProps) {
  const { meta } = usePortfolio();

  const seoTitle = title || meta.title;
  const seoDescription = description || meta.description;
  const seoImage = image || meta.ogImage;
  const seoUrl = url || meta.siteUrl;

  useEffect(() => {
    document.title = seoTitle;

    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', seoDescription);
    updateMeta('author', meta.author);
    updateMeta('keywords', meta.keywords.join(', '));

    updateMeta('og:title', seoTitle, true);
    updateMeta('og:description', seoDescription, true);
    updateMeta('og:image', seoImage, true);
    updateMeta('og:url', seoUrl, true);
    updateMeta('og:type', 'website', true);

    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', seoTitle);
    updateMeta('twitter:description', seoDescription);
    updateMeta('twitter:image', seoImage);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seoUrl);

  }, [seoTitle, seoDescription, seoImage, seoUrl, meta]);

  return null;
}
