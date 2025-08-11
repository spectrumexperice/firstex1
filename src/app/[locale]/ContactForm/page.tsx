"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";
import Axios from "@/app/utilities/axios";
import { useLocale, useTranslations } from "next-intl";
import SummaryApi from "@/app/common/summaryApi";

type Attachment = { file: File; id: string };



const initialFormData: FormData = {
  fullName: "",
  email: "",
  phone: "",
  projectName: "",
  projectStatus: "",
  projectLocation: "",
  projectType: "",
  qty: "",
  specifications: "",
  description: "",
};

export default function ContactForm() {
  const locale = useLocale();

  const t = useTranslations("form");
   
  const [formData, setFormData] = useState({
  

  });
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files).map((file) => ({
      file,
      id: URL.createObjectURL(file),
    }));
    setAttachments((prev) => [...prev, ...filesArray]);
    e.target.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) =>{
        att.id !== id
       URL.revokeObjectURL(att.id);
    }
      
   ));
    
  };

  const validate = () => {
    if (!formData.fullName.trim()) {
      toast.error(t("errors.fullNameRequired"));
      return false;
    }
    if (!formData.email.trim()) {
      toast.error(t("errors.emailRequired"));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error(t("errors.emailInvalid"));
      return false;
    }
    if (!formData.projectName.trim()) {
      toast.error(t("errors.projectNameRequired"));
      return false;
    }
    if (!formData.projectStatus.trim()) {
      toast.error(t("errors.projectStatusRequired"));
      return false;
    }
    if (!formData.projectLocation.trim()) {
      toast.error(t("errors.projectLocationRequired"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const dataToSend = new FormData();
      for (const key in formData) {
        dataToSend.append(key, (formData as any)[key]);
      }
      attachments.forEach((att) => {
        dataToSend.append("attachments", att.file);
      });

      const res = await Axios({
        ...SummaryApi.MessageCapital,
        data:dataToSend
      })
       
      if (res.data.success) {
        toast.success(res.data.message || t("messages.success"));
        setFormData(initialFormData);
        setAttachments([]);
      } else {
        toast.error(res.data.message || t("messages.error"));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("messages.unexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      dir={locale === "en" ? "ltr" : "rtl"}
      className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md my-10 font-[cairo] mt-20"
    >
      <h2 className="text-3xl font-bold mb-6 text-[#6b252f] text-center mt-10">
        {t("title")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 text-right mt-10">
        <fieldset className="border p-4 rounded-md">
          <legend className="font-semibold text-lg mb-4">
            {t("personalData")}
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="fullName"
              type="text"
              placeholder={t("fullName")}
              value={formData.fullName}
              onChange={handleChange}
              className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#6b252f]"
              required
            />
            <input
              name="email"
              type="email"
              placeholder={t("email")}
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#6b252f]"
              required
            />
            <input
              name="phone"
              type="tel"
              dir={locale === "en" ? "ltr" : "rtl"}
              placeholder={t("phone")}
              value={formData.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#6b252f]"
            />
          </div>
        </fieldset>

        <fieldset className="border p-4 rounded-md">
          <legend className="font-semibold text-lg mb-4">
            {t("projectData")}
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="projectName"
              type="text"
              placeholder={t("projectName")}
              value={formData.projectName}
              onChange={handleChange}
              className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#6b252f]"
              required
            />
            <select
              name="projectStatus"
              value={formData.projectStatus}
              onChange={handleChange}
              className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#6b252f]"
              required
            >
              <option value="">اختر حالة المشروع</option>
              <option value="مخطط">مخطط</option>
              <option value="قيد التنفيذ">قيد التنفيذ</option>
              <option value="مكتمل">مكتمل</option>
              <option value="آخر">آخر</option>
            </select>

            <input
              name="projectLocation"
              type="text"
              placeholder={t("projectLocation")}
              value={formData.projectLocation}
              onChange={handleChange}
              className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#6b252f]"
              required
            />
            <input
              name="projectType"
              type="text"
              placeholder={t("projectType")}
              value={formData.projectType}
              onChange={handleChange}
              className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#6b252f]"
            />
            <input
              name="qty"
              type="text"
              placeholder={t("qty")}
              value={formData.qty}
              onChange={handleChange}
              className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#6b252f]"
            />
          </div>
          <textarea
            name="specifications"
            placeholder={t("specifications")}
            value={formData.specifications}
            onChange={handleChange}
            rows={3}
            className="w-full mt-4 border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#6b252f]"
          />
          <textarea
            name="description"
            placeholder={t("description")}
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full mt-4 border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#6b252f]"
          />
        </fieldset>

        <fieldset className="border p-4 rounded-md">
          <legend className="font-semibold text-lg mb-4">
            {t("attachments")}
          </legend>
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFilesChange}
            className="block w-full text-gray-600"
          />
          {attachments.length > 0 && (
            <ul className="mt-2 max-h-40 overflow-auto">
              {attachments.map((att) => (
                <li
                  key={att.id}
                  className="flex justify-between items-center bg-gray-100 rounded px-3 py-1 my-1"
                >
                  <span className="truncate max-w-[80%]" title={att.file.name}>
                    {att.file.name} ({(att.file.size / 1024).toFixed(2)} KB)
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(att.id)}
                    className="text-red-600 font-bold hover:text-red-800"
                    aria-label={t("removeFile")}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6b252f] hover:bg-[#4c1e21] text-white py-3 rounded font-semibold transition disabled:opacity-50"
        >
          {loading ? t("loading") : t("submit")}
        </button>
      </form>
    </section>
  );
}
