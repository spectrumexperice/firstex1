"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Axios from "@/app/utilities/axios";
import SummaryApi from "@/app/common/summaryApi";

export default function EditPartner() {
  const router = useRouter();
  const { id } = useParams();
  const [companyName, setCompanyName] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number | null>(null);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const res = await Axios({
            ...SummaryApi.Partner.getSinglePartner(id)
        });
        const partner = res.data?.data;
        setCompanyName(partner.companyName);
        setDisplayOrder(partner.displayOrder);
        setActive(partner.active);
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
      const res=await Axios({
        ...SummaryApi.Partner.updatePartner(id),
        data:{
            companyName,
            displayOrder,
            active,
        }
      })
      if(res.data.success){
        
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
        <div>
          <Label className="mb-2 block">اسم الشركة</Label>
          <Input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label className="mb-2 block">الترتيب</Label>
          <Input
            type="number"
            value={displayOrder ?? ""}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
          />
        </div>

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

        <Button
          type="submit"
          className="bg-[#6b252f] text-white"
          disabled={loading}
        >
          {loading ? "جاري التحديث..." : "تحديث"}
        </Button>
      </form>
    </div>
  );
}
