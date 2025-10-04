/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.(mp4|webm|ogg|avi|mov)$/,
        type: 'asset/resource',
      });
      return config;
    },
  };

export default nextConfig;
