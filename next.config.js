/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    fontLoaders: [
      {
        loader: '@next/font/google',
        options: { 
          subsets: ['latin'],
          display: 'swap',
          timeout: 10000 // Increased timeout to 10 seconds
        },
      },
    ],
  },
  webpack: (config, { dev, isServer }) => {
    // Disable caching in development to prevent file system errors
    if (dev) {
      config.cache = false;
    }
    return config;
  }
};

module.exports = nextConfig;