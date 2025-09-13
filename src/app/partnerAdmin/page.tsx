"use client";

import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdEdit, MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { setpartnerDetails } from "../store/partnerSlice";
import fetchpartnerDetails from "../utilities/fetchPartnerDetails";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SummaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import Axios from "../utilities/axios";
import ConfirmModal from "../ConfirmDelet";
import Link from "next/link";

type Partner = {
  _id: string;
  companyName: string;
  logoUrl: string;
  thankImageUrl?: string;
  displayOrder: number;
  active: boolean;
};

export default function PartnerAdmin() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { partners } = useSelector((state: RootState) => state.partner);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchpartnerdetails = async () => {
      try {
        setLoading(true);
        dispatch(setpartnerDetails({ loading: true }));
        const response = await fetchpartnerDetails();
        dispatch(setpartnerDetails({ partners: response.data, loading: false }));
      } catch (error) {
        dispatch(setpartnerDetails({ error: "فشل تحميل الشركاء", loading: false }));
      } finally {
        setLoading(false);
      }
    };
    fetchpartnerdetails();
  }, [dispatch]);

  const handleDeleteClick = (id: string) => {
    setSelectedPartnerId(id);
    setShowConfirm(true);
  };

  const ConfirmDeleteHandler = async () => {
    try {
      if (!selectedPartnerId) return;
      const res = await Axios({
        ...SummaryApi.Partner.deletePartner(selectedPartnerId),
      });
      if (res.data.success) {
        toast.success("تم حذف الشريك بنجاح");
        const response = await fetchpartnerDetails();
        dispatch(setpartnerDetails({ partners: response.data, loading: false }));
      } else {
        toast.error(res.data.message || "فشل حذف الشريك");
      }
    } catch (error: any) {
      toast.error(error?.res?.data?.message || "حدث خطأ أثناء الحذف");
    } finally {
      setShowConfirm(false);
      setSelectedPartnerId(null);
    }
  };

  return (
    <div className="p-6 mt-10 mx-auto" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-[#6b252f] font-[Cairo] mt-20 text-center">
        إدارة الشركاء
      </h1>

      <div className="flex justify-end mb-4 flex-col">
        <div className="w-full max-w-md mb-4 flex justify-end">
          <Link href="/" className="inline-flex text-[#6b252f] hover:underline">
            ← "العودة للصفحة الرئيسية"
          </Link>
        </div>
        <Button
          onClick={() => router.push("../addPartner")}
          className="bg-[#6b252f] hover:bg-[#5a1f28] text-white px-6 py-2 rounded-xl"
        >
          ➕ إضافة شريك جديد
        </Button>
      </div>

      {/* حالة التحميل */}
      {loading ? (
        <div className="text-center py-10">جارٍ تحميل الشركاء...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* عرض الشركاء كـ Cards */}
          {partners.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500 py-20">لا يوجد شركاء حتى الآن.</div>
          ) : (
            partners.map((partner: Partner, index: number) => (
              <div key={partner._id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition">
                <div className="flex justify-between">
                  <Image
                    src={partner.logoUrl}
                    alt={partner.companyName}
                    width={80}
                    height={80}
                    className="object-contain max-h-16"
                  />
                  <div className="flex gap-2 items-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        partner.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {partner.active ? "نشط" : "مخفي"}
                    </span>
                  </div>
                </div>

                <h3 className="text-center mt-4 font-semibold text-lg">{partner.companyName}</h3>
                <div className="text-center mt-2">
                  {partner.thankImageUrl ? (
                    <Image
                      src={partner.thankImageUrl}
                      alt="صورة الشكر"
                      width={60}
                      height={60}
                      className="mx-auto object-contain max-h-14"
                    />
                  ) : (
                    <p>-</p>
                  )}
                </div>

                <div className="flex justify-center mt-4 gap-4">
                  <button
                    onClick={() => router.push(`../edit-partner/${partner._id}`)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <MdEdit /> تعديل
                  </button>
                  <button
                    onClick={() => handleDeleteClick(partner._id)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <MdDelete /> حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirm Deletion Modal */}
      <ConfirmModal
        open={showConfirm}
        message="هل أنت متأكد من حذف هذا الشريك؟"
        onConfirm={ConfirmDeleteHandler}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
