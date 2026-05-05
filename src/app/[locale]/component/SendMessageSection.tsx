"use client";
import { motion } from "framer-motion";
import { ChangeEvent, FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Axios from "../../utilities/axios";
import AxiosToastError from "../../utilities/AxiosToatError";
import SummaryApi from "../../common/summaryApi";
import toast from "react-hot-toast";
import Head from "next/head";

export default function SendMessageSection() {
  const t = useTranslations("sendMessage");
  const locale = useLocale();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await Axios({
        ...SummaryApi.Message.sendMSG,
        data: formData,
      });

      if (res.data.error) toast.error(res.data.message);

      if (res.data.success) {
        toast.success(res.data.message);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          message: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>سبكتروم | {t("title")}</title>
        <meta name="description" content={t("subtitle")} />
      </Head>

      <section className="bg-gradient-to-b from-white to-gray-50 py-16 px-4 lg:px-8">
        
        <noscript>
          <h1>{t("title")}</h1>
          <p>{t("subtitle")}</p>
        </noscript>

        <div className="max-w-4xl mx-auto text-center">

        

          <div className="mb-5 flex items-center justify-center gap-6">
           <span className="h-px flex-1 max-w-[140px] bg-[#6b252f]"></span>
          <motion.h2
        className="text-4xl font-[Cairo] font-extrabold text-[#6b252f] text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {t("title")}
      </motion.h2>
          <span className="h-px flex-1 max-w-[140px] bg-[#6b252f]"></span>
       </div>

          <div className="w-16 h-1 bg-[#6b252f] mx-auto rounded-full mb-4" />

          <p className="text-gray-600 mb-4">
            {t("subtitle")}
          </p>

          {/* FORM */}
          <form
            dir={locale === "en" ? "ltr" : "rtl"}
            onSubmit={handleOnSubmit}
            className="
              bg-white
              shadow-xl
              border border-gray-100
              rounded-2xl
              p-6 md:p-10
              grid grid-cols-1 gap-5
              text-right
            "
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleOnChange}
                type="text"
                placeholder={t("fields.fullName")}
                className="
                  border border-gray-200
                  rounded-xl
                  p-4
                  bg-blue-50
                  focus:bg-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#6b252f]
                  transition
                "
              />

              <input
                name="email"
                value={formData.email}
                onChange={handleOnChange}
                type="email"
                placeholder={t("fields.email")}
                className="
                  border border-gray-200
                  rounded-xl
                  p-4
                    bg-blue-50
                  focus:bg-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#6b252f]
                  transition
                "
              />
            </div>

            <input
              name="phone"
              value={formData.phone}
              onChange={handleOnChange}
              type="text"
              placeholder={t("fields.phone")}
              className="
                border border-gray-200
                rounded-xl
                p-4
                  bg-blue-50
                focus:bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-[#6b252f]
                transition
              "
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleOnChange}
              rows={5}
              placeholder={t("fields.message")}
              className="
                border border-gray-200
                rounded-xl
                p-4
                  bg-blue-50
                focus:bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-[#6b252f]
                transition
                resize-none
              "
            />

            <button
              type="submit"
              disabled={loading}
              className="
                bg-[#6b252f]
                hover:bg-[#5a1f27]
                text-white font-semibold
                py-3 px-6
                rounded-xl
                transition-all duration-300
                hover:shadow-lg
                active:scale-95
                disabled:opacity-60
              "
            >
              {loading ? t("submitButton.sending") : t("submitButton.send")}
            </button>

          </form>
        </div>
      </section>
    </>
  );
}