import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // 1. استلام القيمة وعمل await (صحيح)
  let locale = await requestLocale;

  // 2. التحقق من وجود القيمة، إذا لم تكن موجودة (أثناء البناء مثلاً) 
  // نستخدم اللغة الافتراضية فوراً لمنع تعليق السيرفر
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});