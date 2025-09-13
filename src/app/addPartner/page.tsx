"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { toast } from "react-hot-toast";
import Axios from "../utilities/axios";
import SummaryApi from "../common/summaryApi";
import Image from "next/image";

const AddPartner = () => {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [thankImageFile, setThankImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [thankImagePreview, setThankImagePreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file)); // لعرض معاينة الشعار
    }
  };

  const handleThankImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setThankImageFile(file);
      setThankImagePreview(URL.createObjectURL(file)); // لعرض معاينة صورة الشكر
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName || !logoFile) {
      toast.error("يرجى إدخال اسم الشركة وتحميل الشعار");
      return;
    }

    if (
      logoFile.size > 2 * 1024 * 1024 ||
      (thankImageFile && thankImageFile.size > 2 * 1024 * 1024)
    ) {
      toast.error("الرجاء اختيار صور أقل من 2MB لكل صورة");
      return;
    }

    const formData = new FormData();
    formData.append("companyName", companyName);
    if (displayOrder !== null)
      formData.append("displayOrder", displayOrder.toString());
    formData.append("image", logoFile); // شعار الشركة
    if (thankImageFile) formData.append("thankImage", thankImageFile); // صورة رسالة الشكر اختيارية

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.Partner.addPartner,
        data: formData,
      });

      if (response.data.success) {
        toast.success("تم إضافة الشريك بنجاح");
        router.push("../partnerAdmin");
        setCompanyName("");
        setDisplayOrder(null);
        setLogoFile(null);
        setThankImageFile(null);
        setLogoPreview(null); // إعادة تعيين معاينة الشعار
        setThankImagePreview(null); // إعادة تعيين معاينة صورة الشكر
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء الإضافة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto mt-25" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-[#6b252f] font-[Cairo]">
        إضافة شريك جديد
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-5">
        {/* اسم الشركة */}
        <div>
          <Label className="mb-2 block">اسم الشركة</Label>
          <Input
            type="text"
            placeholder="مثال: شركة ABC"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>

        {/* ترتيب العرض */}
        <div>
          <Label className="mb-2 block">ترتيب العرض (اختياري)</Label>
          <Input
            type="number"
            placeholder="مثال: 1"
            value={displayOrder ?? ""}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
          />
        </div>

        {/* شعار الشركة */}
        <div>
          <Label className="mb-2 block">شعار الشركة</Label>
          {logoPreview && (
            <div className="mb-3">
              <Image src={logoPreview} alt="Logo Preview" className="h-14 object-contain" />
            </div>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            required
          />
        </div>

        {/* صورة رسالة الشكر */}
        <div>
          <Label className="mb-2 block">صورة رسالة الشكر</Label>
          {thankImagePreview && (
            <div className="mb-3">
              <Image
                src={thankImagePreview}
                alt="Thank Image Preview"
                className="h-14 object-contain"
              />
            </div>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={handleThankImageChange}
          />
        </div>

        {/* زر الإضافة */}
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#6b252f] text-white"
        >
          {loading ? "جاري الحفظ..." : "➕ إضافة الشريك"}
        </Button>
      </form>
    </div>
  );
};

export default AddPartner;
