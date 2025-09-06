"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Axios from "@/app/utilities/axios";
import SummaryApi from "@/app/common/summaryApi";
import Image from "next/image";

export default function EditPartner() {
  const router = useRouter();
  const { id } = useParams();
  const [companyName, setCompanyName] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number | null>(null);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [thankImageFile, setThankImageFile] = useState<File | null>(null);
  const [currentLogo, setCurrentLogo] = useState<string>("");
  const [currentThankImage, setCurrentThankImage] = useState<string>("");

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const res = await Axios({ ...SummaryApi.Partner.getSinglePartner(id) });
        const partner = res.data?.data;
        setCompanyName(partner.companyName);
        setDisplayOrder(partner.displayOrder);
        setActive(partner.active);
        setCurrentLogo(partner.logoUrl);
        setCurrentThankImage(partner.thankImageUrl || "");
      } catch (err) {
        toast.error("فشل تحميل بيانات الشريك");
      }
    };
    fetchPartner();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("companyName", companyName);
      if (displayOrder !== null)
        formData.append("displayOrder", displayOrder.toString());
      formData.append("active", active.toString());
      if (logoFile) formData.append("image", logoFile);
      if (thankImageFile) formData.append("thankImage", thankImageFile);

      const res = await Axios({
        ...SummaryApi.Partner.updatePartner(id),
        data: formData,
      });

      if (res.data.success) {
        toast.success("تم تحديث بيانات الشريك");
        router.push("/dashboard/partnerAdmin");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "فشل التحديث");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto mt-24" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-[#6b252f] font-[Cairo]">
        تعديل بيانات الشريك
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-5">
        {/* اسم الشركة */}
        <div>
          <Label className="mb-2 block">اسم الشركة</Label>
          <Input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className="border-gray-300"
          />
        </div>

        {/* شعار الشركة */}
        <div>
          <Label className="mb-2 block">شعار الشركة (اختياري لتغييره)</Label>
          {currentLogo && (
            <div className="mb-3">
              <Image alt="currentLogo" src={currentLogo} className="h-14 object-contain" />
            </div>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setLogoFile(e.target.files[0])}
            className="border-gray-300"
          />
        </div>

        {/* صورة رسالة الشكر */}
        <div>
          <Label className="mb-2 block">صورة رسالة الشكر (اختياري لتغييره)</Label>
          {currentThankImage && (
            <div className="mb-3">
              <Image alt="ThankImage" src={currentThankImage} className="h-14 object-contain" />
            </div>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && setThankImageFile(e.target.files[0])
            }
            className="border-gray-300"
          />
        </div>

        {/* الترتيب */}
        <div>
          <Label className="mb-2 block">الترتيب</Label>
          <Input
            type="number"
            value={displayOrder ?? ""}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            className="border-gray-300"
          />
        </div>

        {/* الحالة */}
        <div>
          <Label className="mb-2 block">الحالة</Label>
          <select
            value={active ? "true" : "false"}
            onChange={(e) => setActive(e.target.value === "true")}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="true">نشط</option>
            <option value="false">مخفي</option>
          </select>
        </div>

        {/* زر التحديث */}
        <Button
          type="submit"
          className="bg-[#6b252f] text-white"
          disabled={loading}
        >
          {loading ? (
            <span className="animate-spin mr-2">🔄</span>
          ) : (
            "تحديث"
          )}
          {loading && "جاري التحديث..."}
        </Button>
      </form>
    </div>
  );
}
