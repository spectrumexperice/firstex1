'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { routing } from '@/src/i18n/routing';
import { GrLanguage } from 'react-icons/gr';
import { Suspense } from 'react';

function LanguageSwitcherInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const localeNames: Record<string, string> = {
    ar: 'العربية',
    en: 'English',
  };

  const currentLocale =
    routing.locales.find((locale) =>
      pathname.startsWith(`/${locale}`)
    ) || routing.defaultLocale;

  const changeLanguage = (locale: string) => {
    let newPath = pathname;
    const localeRegex = new RegExp(`^/(${routing.locales.join('|')})`);

    if (localeRegex.test(pathname)) {
      newPath = pathname.replace(localeRegex, `/${locale}`);
    } else {
      newPath = `/${locale}${pathname}`;
    }

    const params = searchParams.toString();
    const fullPath = params ? `${newPath}?${params}` : newPath;

    router.push(fullPath);
  };

  return (
    <div className="flex items-center space-x-2">
      <GrLanguage className="text-yellow-400 w-5 h-5" />
      {routing.locales.map((locale) =>
        locale === currentLocale ? null : (
          <button
            key={locale}
            onClick={() => changeLanguage(locale)}
            className="px-2 py-1 rounded transition text-white hover:text-yellow-400 "
          >
            {localeNames[locale]}
          </button>
        )
      )}
    </div>
  );
}

export default function LanguageSwitcher() {
  return (
    <Suspense fallback={null}>
      <LanguageSwitcherInner />
    </Suspense>
  );
}
