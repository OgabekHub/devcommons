const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin(
  './src/i18n.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Compress responses
  compress: true,
  // Optimize bundle size — tree-shake
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{ kebabCase member }}',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
    // Enable image optimization
    formats: ['image/avif', 'image/webp'],
  },
  // Headers for caching static assets
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/icon.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
