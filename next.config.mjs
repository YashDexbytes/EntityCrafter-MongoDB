import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true, // Use SWC for faster builds

  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.experiments = {
        layers: true
      };
      config.cache = {
        type: 'filesystem',
        cacheDirectory: path.resolve(process.cwd(), '.next/cache/webpack'), 
        buildDependencies: {
          config: [path.resolve(process.cwd(), 'next.config.mjs')], 
        },
      };

      // Reduce source map size for faster builds
      config.devtool = 'eval-source-map';
    }

    // Resolve paths to prevent conflicts
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd(), 'src'), 
    };

    return config;
  },

  productionBrowserSourceMaps: true,
};

export default nextConfig;
