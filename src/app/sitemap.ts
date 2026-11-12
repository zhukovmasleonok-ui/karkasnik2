import type { MetadataRoute } from 'next';
import { realProjects } from '@/content/projects';

const BASE = 'https://xn--80aknigcncfkc7d8byc.xn--p1ai';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '', priority: 1, freq: 'weekly' as const },
    { path: '/technologies', priority: 0.9, freq: 'monthly' as const },
    { path: '/komplektacii', priority: 0.8, freq: 'monthly' as const },
    { path: '/projects', priority: 0.9, freq: 'weekly' as const },
    { path: '/selection', priority: 0.8, freq: 'monthly' as const },
    { path: '/portfolio', priority: 0.8, freq: 'weekly' as const },
    { path: '/about', priority: 0.7, freq: 'monthly' as const },
    { path: '/mortgage', priority: 0.8, freq: 'monthly' as const },
    { path: '/contacts', priority: 0.7, freq: 'monthly' as const },
    { path: '/privacy', priority: 0.2, freq: 'yearly' as const },
  ];
  const projectPages = realProjects.map((p) => ({
    url: `${BASE}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  return [
    ...routes.map((r) => ({
      url: `${BASE}${r.path}`,
      lastModified: new Date(),
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...projectPages,
  ];
}
