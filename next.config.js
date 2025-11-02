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
    optimizePackageImports: ['@tanstack/react-query', 'framer-motion', '@radix-ui/react-icons'],
  },
  // Enable static optimization where possible
  swcMinify: true,
  // Compress responses
  compress: true,
};

module.exports = nextConfig;
