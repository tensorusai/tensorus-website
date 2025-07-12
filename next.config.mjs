/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Remove fetchpriority attribute for Firefox compatibility
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          cacheGroups: {
            ...config.optimization?.splitChunks?.cacheGroups,
            default: {
              ...config.optimization?.splitChunks?.cacheGroups?.default,
              priority: undefined,
            },
          },
        },
      }
    }
    return config
  },
}

export default nextConfig
