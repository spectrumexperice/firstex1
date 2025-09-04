"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import Axios from "@/app/utilities/axios";
import SummaryApi from "@/app/common/summaryApi";
import { useLocale, useTranslations } from "next-intl";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const t = useTranslations("footer");
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error(t("invalidEmail"));
      return;
    }

  try {
  const response = await Axios.post(
    SummaryApi.NewLetter.subscribe.url,
    { email }
  );
  toast.success(t("successMessage"));
  setEmail("");
} catch (err: any) {
  toast.error(err.response?.data?.message || t("errorMessage"));
} }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        dir={locale === "en" ? "ltr" : "rtl"}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("newsletterPlaceholder")}
        className="p-2 rounded text-white focus:outline-none"
        required
      />
      <button
        type="submit"
        className="bg-yellow-400 text-black py-2 rounded font-semibold hover:bg-yellow-500 transition"
      >
        {t("subscribeButton")}
      </button>
    </form>
  );
};

export default NewsletterForm
