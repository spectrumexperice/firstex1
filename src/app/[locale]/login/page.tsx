"use client";
import fetchUserDetails from '../../utilities/fetchUserDetails';
import {setUserDetails} from '../../store/userSlice'
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import Axios from '../../utilities/axios';
import AxiosToastError from '../../utilities/AxiosToatError';
import SummaryApi from "../../common/summaryApi";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import Head from 'next/head';
export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // يجب إضافته في أعلى الصفحة
  const t = useTranslations("login");
  const locale = useLocale()   
  const dispatch=useDispatch()
  const [loading, setLoading] = useState(false);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  
  e.preventDefault();
  try {
    const response = await Axios({
      ...SummaryApi.login,
      data: data,
    });

    if (response.data.error) {
      toast.error(response.data.message);
      return;
    }

    if (response.data.success) {
      // حفظ التوكنات
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);

      // جلب بيانات المستخدم بعد تسجيل الدخول
     
  
      dispatch(setUserDetails(response.data.data.user));

      // تفريغ الفورم
      setData({ email: "", password: "" });

      // الانتقال للصفحة الرئيسية
         router.push(`/${locale}/`); // استخدم مسارًا محددًا

      toast.success(response.data.message);
    }

  } catch (error) {
    AxiosToastError(error);
  }
};


  return (
    <>
      <Head>
        <title>سبكتروم | {t("title")}</title>
        <meta
          name="description"
          content="تسجيل الدخول  لحسابك في سبكتروم."
        />
        <meta
          name="keywords"
          content="سبكتروم, تسجيل الدخول"
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <section
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 py-12 px-4"
        dir={locale === "en" ? "ltr" : "rtl"}
      >
        <noscript>
          <div>
            <h1>{t("title")}</h1>
           
          </div>
        </noscript>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="w-full max-w-md mb-4">
          <Link
            href={`/${locale}/`}
            className="inline-flex items-center text-[#6b252f] hover:underline"
          >
            ← {locale === "ar" ? "العودة للصفحة الرئيسية" : "Back to Home"}
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          dir={locale === "en" ? "ltr" : "rtl"}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl"
        >
          <h1 className="text-3xl font-bold text-[#6b252f] mb-6 text-center">
            {t("title")}
          </h1>
          <form onSubmit={handleSubmit} className="grid gap-4 mt-6">
            <div className="grid gap-1">
              <label htmlFor="email" className="block mb-1 font-semibold">
                {t("emailLabel")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder={t("emailPlaceholder")}
                required
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[#6b252f]"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block mb-1 font-semibold">
                {t("passwordLabel")}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder={t("passwordPlaceholder")}
                required
                className="w-full border border-gray-300 rounded p-2 pr-10 focus:outline-none focus:border-[#6b252f]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-8 right-3 text-gray-500"
                aria-label={
                  showPassword ? t("hidePasswordAria") : t("showPasswordAria")
                }
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
            <div className="text-sm text-right mt-1">
              <Link
                href={`/${locale}/forgot-password`}
                className="text-blue-600 hover:underline"
              >
                {t("forgotPassword")}
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#6b252f] hover:bg-[#4c1e21] text-white py-2 rounded font-semibold transition"
            >
              {t("loginButton")}
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            {t("noAccount")}{" "}
            <Link
              href={`/${locale}/register`}
              className="text-[#6b252f] hover:underline"
            >
              {t("createAccount")}
            </Link>
          </p>
        </motion.div>
      </section>
    </>
  );
}
