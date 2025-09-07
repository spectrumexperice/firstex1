"use client";

import { useEffect, useState } from "react";
import { useRouter,useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import Axios from "../../utilities/axios";
import AxiosToastError from "../../utilities/AxiosToatError.js";
import SummaryApi from "../../common/summaryApi.js"
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
export default function ResetPassword() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const [data, setData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
   const t = useTranslations("resetPassword");
   const locale = useLocale()  
  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (data.newPassword !== data.confirmPassword) {
      toast.error("كلمة المرور غير متطابقة");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: {
          email:email,
          newPassword: data.newPassword,
          confirmPassword :data.confirmPassword       },
      });

      if (response.data.error) {
        toast.error(response.data.message);
        return;
      }

      toast.success("تم تحديث كلمة المرور بنجاح");


      setData({
        newPassword: "",
        confirmPassword: "",
      });

      router.push(`/${locale}/login`);
    } catch (err) {
      AxiosToastError(err);
    }
  };
  useEffect(() => {
  if (!email) {
    toast.error("رابط غير صالح أو مفقود");
    router.push("/forgot-password");
  }
},[email, router]);

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
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
          <div className="relative">
            <label htmlFor="newPassword" className="block mb-1 font-medium">
              {t("newPasswordLabel")}
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={data.newPassword}
              onChange={handleChange}
              required
              placeholder={t("newPasswordPlaceholder")}
              className="w-full border border-gray-300 rounded p-2 pr-10 focus:outline-none focus:border-[#6b252f]"
            />
          </div>
          <div className="relative">
            <label htmlFor="confirmPassword" className="block mb-1 font-medium">
              {t("confirmPasswordLabel")}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              required
              placeholder={t("confirmPasswordPlaceholder")}
              className="w-full border border-gray-300 rounded p-2 pr-10 focus:outline-none focus:border-[#6b252f]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#6b252f] hover:bg-[#4c1e21] text-white py-2 rounded font-semibold transition"
          >
            {t("submit")}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
