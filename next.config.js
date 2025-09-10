/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  },
  trailingSlash: true,
  output: 'standalone', // مهم جدًا للـ Docker/Render
};

import createNextIntlPlugin from 'next-intl/plugin';
export default createNextIntlPlugin(nextConfig);
