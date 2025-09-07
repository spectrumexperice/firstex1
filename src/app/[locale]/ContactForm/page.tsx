"use client";
export const dynamic = "force-dynamic";

import React, { useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";
import Axios from "@/app/utilities/axios";
import { useLocale, useTranslations } from "next-intl";
import SummaryApi from "@/app/common/summaryApi";

type Attachment = { file: File; id: string };



type FormValues = {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  projectName: string;
  projectStatus: string;
  projectLocation: string;
  projectType: string;
  qty: string 
  specifications: string;
  description: string;
};

const initialFormData: FormValues = {
  fullName: "",
  company: "",
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
   
 const [formValues, setFormValues] = useState<FormValues>(initialFormData);

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
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
   setAttachments((prev) => {
  const removed = prev.find(att => att.id === id);
  if (removed) URL.revokeObjectURL(removed.id);
  return prev.filter(att => att.id !== id);
});

    
  };

  const validate = () => { //داله التحقق
    if (!formValues.fullName.trim()) {
      toast.error(t("errors.fullNameRequired"));
      return false;
    }
     if (!formValues.company.trim()) {
      toast.error(t("errors.companyRequired"));
      return false;
    }
    if (!formValues.email.trim()) {
      toast.error(t("errors.emailRequired"));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      toast.error(t("errors.emailInvalid"));
      return false;
    }
    if (!formValues.projectName.trim()) {
      toast.error(t("errors.projectNameRequired"));
      return false;
    }
    if (!formValues.projectStatus.trim()) {
      toast.error(t("errors.projectStatusRequired"));
      return false;
    }
    if (!formValues.projectLocation.trim()) {
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
      const dataToSend = new FormData();//مهم للملفات المتعدده
      for (const key in formValues) {
        dataToSend.append(key,(formValues as any)[key])
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
        setFormValues(initialFormData);
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

      <form onSubmit={handleSubmit} className="space-y-6  mt-10">
        <fieldset
          className="border border-gray-300 p-4 rounded-md bg-gray-50"
          aria-labelledby="personal-data-legend"
        >
          <legend
            id="personal-data-legend"
            className="px-3 font-semibold text-lg text-gray-800 bg-white rounded-md shadow-sm"
          >
            
            {t("personalData")}
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="fullName"
              type="text"
              placeholder={t("fullName")}
              value={formValues.fullName}
              onChange={handleChange}
              className="border border-gray-300 rounded p-3 bg-white focus:outline-none "
              required
            />
            <input
              name="email"
              type="email"
              placeholder={t("email")}
              value={formValues.email}
              onChange={handleChange}
              className="border border-gray-300 rounded p-3 bg-white focus:outline-none"
              required
            />
             <input
              name="company"
              type="text"
              placeholder={t("company")}
              value={formValues.company}
              onChange={handleChange}
              className="border border-gray-300 rounded p-3 bg-white focus:outline-none "
              required
            />
            <input
              name="phone"
              type="tel"
              dir={locale === "en" ? "ltr" : "rtl"}
              placeholder={t("phone")}
              value={formValues.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded p-3 bg-white focus:outline-none"
            />
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 p-4 rounded-md bg-gray-50">
          <legend className="px-3 font-semibold text-lg text-gray-800 bg-white rounded-md shadow-sm ">
            {t("projectData")}
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="projectName"
              type="text"
              placeholder={t("projectName")}
              value={formValues.projectName}
              onChange={handleChange}
              className="border border-gray-300 p-4 rounded-md bg-white"
              required
            />
            <select
              name="projectStatus"
              value={formValues.projectStatus}
              onChange={handleChange}
              className="border border-gray-300 bg-white rounded p-3 focus:outline-none "
              required
            >
              <option  value="">اختر حالة المشروع</option>
              <option value="مخطط">مخطط</option>
              <option value="قيد التنفيذ">قيد التنفيذ</option>
              <option value="مكتمل">مكتمل</option>
              <option value="آخر">آخر</option>
            </select>

            <input
              name="projectLocation"
              type="text"
              placeholder={t("projectLocation")}
              value={formValues.projectLocation}
              onChange={handleChange}
              className="border border-gray-300 rounded p-3 focus:outline-none bg-white"
              required
            />
            <input
              name="projectType"
              type="text"
              placeholder={t("projectType")}
              value={formValues.projectType}
              onChange={handleChange}
              className="border border-gray-300 rounded p-3 focus:outline-none bg-white"
            />
            <input
              name="qty"
              type="text"
              placeholder={t("qty")}
              value={formValues.qty}
              onChange={handleChange}
              className="border border-gray-300 rounded p-3 focus:outline-none bg-white"
            />
          </div>
          <textarea
            name="specifications"
            placeholder={t("specifications")}
            value={formValues.specifications}
            onChange={handleChange}
            rows={3}
            className="w-full mt-4 border border-gray-300 rounded p-3 focus:outline-none bg-white"
          />
          <textarea
            name="description"
            placeholder={t("description")}
            value={formValues.description}
            onChange={handleChange}
            rows={3}
            className="w-full mt-4 border border-gray-300 rounded p-3 focus:outline-none bg-white"
          />
        </fieldset>

        <fieldset className="border border-gray-300 p-4 rounded-md bg-gray-50">
          <legend className="px-3 font-semibold text-lg text-gray-800 bg-white rounded-md shadow-sm ">
            {t("attachments")}
          </legend>
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFilesChange}
            className="block w-full text-gray-600"
          />
          {
          attachments.length > 0 && (
            <ul className="mt-2 max-h-40 overflow-auto">
              {
              attachments.map((att) => (
                <li
                  key={att.id}
                  className="flex justify-between items-center bg-white rounded px-3 py-1 my-1"
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
