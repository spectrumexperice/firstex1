"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import Axios from "@/app/utilities/axios";
import SummaryApi from "@/app/common/summaryApi";

const AddPartner = () => {
  
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName || !imageFile) {
      toast.error("يرجى إدخال اسم الشركة وتحميل الشعار");
      return;
    }
    if (imageFile.size > 2 * 1024 * 1024) {
      toast.error("الرجاء اختيار صورة أقل من 2MB");
      return;
    }


    const formData = new FormData();
    formData.append("companyName", companyName);
    if(displayOrder)
    if (displayOrder !== null) {
      formData.append("displayOrder", displayOrder.toString());
    }
    formData.append("image", imageFile);

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.Partner.addPartner,
        data:formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("تم إضافة الشريك بنجاح");
        router.push("/dashboard/partnerAdmin");
        setCompanyName("");
        setDisplayOrder(null);
        setImageFile(null);

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

        <div>
          <Label className="mb-2 block">ترتيب العرض (اختياري)</Label>
          <Input
            type="number"
            placeholder="مثال: 1"
            value={displayOrder ?? ""}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
          />
        </div>

        <div>
          <Label className="mb-2 block">شعار الشركة</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
            required
          />
        </div>

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
