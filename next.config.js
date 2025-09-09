/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // جرب 'standalone' بدل 'export'
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  reactStrictMode: true
}

module.exports = nextConfig