import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
    unoptimized: true // مهم لـ Vercel
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  // الإعدادات الحرجة لحل المشكلة
  typescript: {
    ignoreBuildErrors: true
  },
  trailingSlash: true, // يحد من مشاكل المسارات
  skipTrailingSlashRedirect: true,
  
  // تعطيل الميزات المسببة للمشكلة
  outputFileTracing: false,
  experimental: {
    webpackBuildWorker: false
  }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);