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
    webpackBuildWorker: true, // أو true إذا تريد تمكينه مع مراقبة الأخطاء
  },
  swcMinify: true,
  compress: true,
  // تقليل تتبع الملفات بدون التأثير على المشروع
  outputFileTracingExcludes: {
    '*': [
      'node_modules/**/@next/swc*/**/*',
      'node_modules/**/next/dist/compiled/@next/swc*/**/*'
    ]
  }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
