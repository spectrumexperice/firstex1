import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  eslint:{
    ignoreDuringBuilds:true
  }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
