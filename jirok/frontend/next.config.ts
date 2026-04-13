
// next.config.js
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,        // check for changes every 1 second
      aggregateTimeout: 300,
    };
    return config;
  },
};

module.exports = nextConfig;

