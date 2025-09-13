"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Axios from "../../utilities/axios";
import AxiosToastError from "../../utilities/AxiosToatError";
import SummaryApi from "../../common/summaryApi";
 import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const t = useTranslations("forgotPassword");
 const locale = useLocale()   
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
    try {
      const response = await Axios({
        ...SummaryApi.forgotPassword, // 👈 يجب إضافتها في summaryApi
        data: { email },
      });

      if (response.data.error) {
        toast.error(response.data.message);
        return;
      }

      toast.success("تم إرسال رمز التحقق إلى بريدك");
       router.push(`/${locale}/verifyOtp?email=${encodeURIComponent(email)}`);
       // 👈 الانتقال للخطوة التالية
    } catch (err) {
      AxiosToastError(err);
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4 flex-col"
      dir={locale === "en" ? "ltr" : "rtl"}
    >
       <div className="w-full max-w-md mb-4">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center text-[#6b252f] hover:underline"
        >
          ← {locale === "ar" ? "العودة للصفحة الرئيسية" : "Back to Home"}
        </Link>
      </div>
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-[#6b252f]">
          {t("title")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              {t("emailLabel")}
            </label>
            <input
              type="email"
              id="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[#6b252f]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#6b252f] hover:bg-[#4c1e21] text-white py-2 rounded font-semibold transition"
          >
            {t("sendCode")}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
