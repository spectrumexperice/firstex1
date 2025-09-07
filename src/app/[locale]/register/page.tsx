"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import Axios from "../../utilities/axios";
import AxiosToastError from "../../utilities/AxiosToatError.js";
import SummaryApi from "../../common/summaryApi.js"
import { useRouter } from 'next/navigation';

// استيراد useTranslations
import { useLocale, useTranslations } from "next-intl";

export default function Register() {
  const t = useTranslations("register");
  const router = useRouter();
  const locale = useLocale()   
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error(t("passwordMismatchError"));
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: data
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        router.push('/login');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section
      className="mx-auto min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 py-12 px-4"
       dir={locale === 'en' ? 'ltr' : 'rtl'}
    >
       <div className="w-full max-w-md mb-4">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center text-[#6b252f] hover:underline"
        >
          ← {locale === "ar" ? "العودة للصفحة الرئيسية" : "Back to Home"}
        </Link>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-[#6b252f] mb-6 text-center">
          {t("title")}
        </h1>
        <form onSubmit={handleSubmit} className="grid gap-4 mt-6">
          <div className="grid gap-1">
            <label htmlFor="name" className="block mb-1 font-semibold">
              {t("nameLabel")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder={t("namePlaceholder")}
              required
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[#6b252f]"
            />
          </div>

          <div>
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
              aria-label={showPassword ? t("hidePasswordAria") : t("showPasswordAria")}
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className="block mb-1 font-semibold">
              {t("confirmPasswordLabel")}
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              placeholder={t("confirmPasswordPlaceholder")}
              required
              className="w-full border border-gray-300 rounded p-2 pr-10 focus:outline-none focus:border-[#6b252f]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-8 right-3 text-gray-500"
              aria-label={showConfirmPassword ? t("hideConfirmPasswordAria") : t("showConfirmPasswordAria")}
            >
              {showConfirmPassword ? "👁️" : "🙈"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#6b252f] hover:bg-[#4c1e21] text-white py-2 rounded font-semibold transition"
          >
            {t("submitButton")}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          {t("haveAccount")}{" "}
          <Link  href='login' className="text-[#6b252f] hover:underline">
            {t("login")}
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
