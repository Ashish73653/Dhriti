import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dhriti',
    short_name: 'Dhriti',
    description: 'Your personal health intelligence platform.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#030306',
    theme_color: '#030306',
    icons: [
      {
        src: '/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}