"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/app/store/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdEdit, MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {setpartnerDetails} from '@/app/store/partnerSlice'
import fetchpartnerDetails from "@/app/utilities/fetchPartnerDetails";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SummaryApi from "@/app/common/summaryApi";
import toast from "react-hot-toast";
import Axios from "@/app/utilities/axios";
import ConfirmModal from "@/app/component/ConfirmDelet";
type Partner = {
  _id: string;
  companyName: string;
  logoUrl: string;
  displayOrder: number;
  active: boolean;
};

export default function PartnerAdmin() {
  const router = useRouter();
  const dispatch =useDispatch()
  const { partners } = useSelector((state: RootState) => state.partner);
  const [showConfirm,setShowConfirm]=useState(false)
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  useEffect(()=>{
      const fetchpartnerdetails=async()=>{
   try {
        dispatch(setpartnerDetails({ loading: true }));
        const response = await fetchpartnerDetails();
        dispatch(setpartnerDetails({ partners: response.data, loading: false }));
      } catch (error) {
        dispatch(setpartnerDetails({ error: "فشل تحميل الشركاء", loading: false }));
      }
  }
  fetchpartnerdetails()
  },[])
    const handleDeleteClick = (id:String) => {
    setSelectedPartnerId(id);
    setShowConfirm(true);
  };
  const ConfirmDeleteHandler  = async () => {
    

  try {
    if(!selectedPartnerId) return
    const response = await Axios({
      ...SummaryApi.Partner.deletePartner(selectedPartnerId),
    });

    if (response.data.success) {
      toast.success("تم حذف الشريك بنجاح");
      const response = await fetchpartnerDetails();
      dispatch(setpartnerDetails({ partners: response.data, loading: false }));
    } else {
      toast.error(response.data.message || "فشل حذف الشريك");
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "حدث خطأ أثناء الحذف");
  }finally{
    setShowConfirm(false)
    setSelectedPartnerId(null)
  }
};

  return (
    <div className="p-6 mt-10 mx-auto" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-[#6b252f] font-[Cairo] mt-20 text-center">
        إدارة الشركاء
      </h1>

      <div className="flex justify-end mb-4">
        <Button
          onClick={() => router.push("/dashboard/addPartner")}
          className="bg-[#6b252f] hover:bg-[#5a1f28] text-white px-6 py-2 rounded-xl"
        >
          ➕ إضافة شريك جديد
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-[#f9f9f9] text-gray-700 font-semibold">
            <tr>
              <th className="p-3 text-center">#</th>
              <th className="p-3 text-center">الشعار</th>
              <th className="p-3 text-center">اسم الشركة</th>
              <th className="p-3 text-center">الترتيب</th>
              <th className="p-3 text-center">الحالة</th>
              <th className="p-3 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-gray-700">
            {
            partners.map((partner: Partner, index: number) => (
              <tr key={partner._id} className="hover:bg-gray-50">
                <td className="p-3 text-center">{index + 1}</td>
                <td className="p-3 text-center">
                  <Image
                    src={partner.logoUrl}
                    alt={partner.companyName}
                    width={60}
                    height={60}
                    className="mx-auto object-contain max-h-14"
                  />
                </td>
                <td className="p-3 text-center">{partner.companyName}</td>
                <td className="p-3 text-center">{partner.displayOrder}</td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      partner.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {partner.active ? "نشط" : "مخفي"}
                  </span>
                </td>
                <td className="p-3 text-center flex justify-center gap-2">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/edit-partner/${partner._id}`)
                    }
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <MdEdit /> تعديل
                  </button>
                 
                  <button
                    onClick={()=>handleDeleteClick(partner._id)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <MdDelete /> حذف
                  </button>
                 
                </td>
              </tr>
            ))}
            {partners.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">
                  لا يوجد شركاء حتى الآن.
                </td>
              </tr>
            )}
          </tbody>
          <ConfirmModal
            open={showConfirm}
            message="هل أنت متأكد من حذف هذا الشريك؟"
            onConfirm={ConfirmDeleteHandler }
            onCancel={() => setShowConfirm(false)}
          />
        </table>
      </div>
    </div>
  );
}
