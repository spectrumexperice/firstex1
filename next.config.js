import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  eslint:{
    ignoreDuringBuilds:true
  },
  experimental: {
    webpackBuildWorker: false, // أو true إذا تريد تمكينه مع مراقبة الأخطاء
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
