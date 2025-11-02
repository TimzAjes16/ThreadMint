/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.ipfs.io',
      },
      {
        protocol: 'https',
        hostname: '**.web3.storage',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
  },
  experimental: {
    optimizePackageImports: ['@tanstack/react-query', 'framer-motion', '@radix-ui/react-icons', '@react-three/fiber', '@react-three/drei'],
  },
  // Enable static optimization where possible
  swcMinify: true,
  // Compress responses
  compress: true,
  // Optimize bundle size
  productionBrowserSourceMaps: false,
  // Fix chunk loading issues
  webpack: (config, { isServer, dev }) => {
    if (!isServer && dev) {
      // Improve chunk loading in development
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
