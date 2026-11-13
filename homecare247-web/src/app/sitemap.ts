import { MetadataRoute } from 'next';
import { CITIES } from '@/data/cities';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://homecare247.com';

  const cityUrls = CITIES.map((city) => ({
    url: `${baseUrl}/#${city.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const serviceAnchorUrls = [
    '#services',
    '#icu-setup',
    '#calculator',
    '#why-us',
    '#testimonials',
    '#faqs',
  ].map((anchor) => ({
    url: `${baseUrl}/${anchor}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always' as const,
      priority: 1.0,
    },
    ...cityUrls,
    ...serviceAnchorUrls,
  ];
}

