"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Axios from "@/app/utilities/axios.js";
import AxiosToastError from "@/app/utilities/AxiosToatError";
import SummaryApi from "@/app/common/summaryApi";
import toast from "react-hot-toast";

export default function SendMessageSection() {
  const t = useTranslations("sendMessage");
  const locale = useLocale()   
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const [loading, setLoading] = useState(false);

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
    <section className="bg-white py-12 px-4 lg:px-8 ">
      <div className="max-w-4xl mx-auto text-center ">
        <h2 className="text-3xl font-bold mb-4 text-[#6b252f] font-[cairo]">
          {t("title")}
        </h2>
        <p className="text-gray-600 mb-8">{t("subtitle")}</p>

        <form
           dir={locale === 'en' ? 'ltr' : 'rtl'}
          onSubmit={handleOnSubmit}
          className="grid grid-cols-1 gap-6 text-right"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleOnChange}
              type="text"
              placeholder={t("fields.fullName")}
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleOnChange}
              type="email"
              placeholder={t("fields.email")}
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleOnChange}
            type="text"
            placeholder={t("fields.phone")}
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleOnChange}
            rows={5}
            placeholder={t("fields.message")}
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            {loading ? t("submitButton.sending") : t("submitButton.send")}
          </button>
        </form>
      </div>
    </section>
  );
}
