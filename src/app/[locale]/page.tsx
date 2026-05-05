import { setRequestLocale } from 'next-intl/server';
import HomeClient from './Homeclient';
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // هنا نضعها بأمان لأننا في Server Component
  setRequestLocale(locale); 

  return <HomeClient />;
}