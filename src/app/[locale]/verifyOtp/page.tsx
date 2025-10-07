"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import Axios from "../../utilities/axios";
import AxiosToastError from "../../utilities/AxiosToatError";
import SummaryApi from "../../common/summaryApi";
import { useLocale, useTranslations } from "next-intl";
import Head from "next/head";

function VerifyOTPInner() {
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const t = useTranslations("verifyOtp");
  const locale = useLocale();

  useEffect(() => {
    if (inputRef.current[0]) {
      inputRef.current[0]?.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otp = data.join("");

    if (!email) {
      toast.error("البريد الإلكتروني غير صالح");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.verifyOtp,
        data: { otp, email },
      });

      if (response.data.error) {
        toast.error(response.data.message);
        return;
      }

      toast.success("تم التحقق من الرمز بنجاح");
      router.push(`/${locale}/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      AxiosToastError(err);
    }
  };

  return (
    <>
      <Head>
        <title>سبكتروم | {t("title")}</title>
        <meta name="description" content="  تاكيد رمز التحقق لكلمة المرور في سبكتروم." />
        <meta name="keywords" content="سبكتروم, تاكيد رمز التحقق" />
        <meta name="robots" content="index, follow" />
      </Head>
      <section
        className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
        dir={locale === "en" ? "ltr" : "rtl"}
      >
         <noscript>
          <div>
            <h1>{t("title")}</h1>
           
          </div>
        </noscript>
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
          <p className="text-sm text-gray-600 mb-3 text-center">
            {t("subtitle")}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 justify-between mt-3">
              {data.map((val, index) => (
                <input
                  key={"otp" + index}
                  type="text"
                  maxLength={1}
                  ref={(el) => {
                    inputRef.current[index] = el;
                  }}
                  value={val}
                  onChange={(e) => {
                    const value = e.target.value;
                    const newData = [...data];
                    newData[index] = value;
                    setData(newData);
                    if (value && index < 5)
                      inputRef.current[index + 1]?.focus();
                  }}
                  className="bg-blue-50 w-full max-w-16 p-2 border rounded outline-none text-center font-semibold"
                />
              ))}
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-[#6b252f] hover:bg-[#4c1e21] text-white py-2 rounded font-semibold transition"
            >
              {t("submit")}
            </button>
          </form>
        </motion.div>
      </section>
    </>
  );
}

export default function VerifyOTP() {
  return (
    
     
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyOTPInner />
      </Suspense>
    
  );
}
