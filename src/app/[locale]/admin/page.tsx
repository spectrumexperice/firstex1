"use client";
import { useSelector,useDispatch } from "react-redux";
import { setWorksDetails } from "@/app/store/workSlice";
import { useEffect, useState } from "react";
import Axios from "@/app/utilities/axios";
import SummaryApi from "@/app/common/summaryApi";
import { toast } from "react-hot-toast";
import Link from "next/link";
import ConfirmModal from "@/app/ConfirmDelet";
import { MdDelete } from "react-icons/md";
import Image from "next/image";


const WorkAdmin = () => {
 
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const dispatch=useDispatch()
    const { works, loading, error } = useSelector((state: any) => state.works);
  const handleDeleteClick = (id: string) => {
    setSelectedWorkId(id);
    setShowConfirm(true);
  };


  const fetchWorks = async () => {
  try {
    dispatch(setWorksDetails({ loading: true }));
    const res = await Axios({ ...SummaryApi.Work.getall });
    dispatch(setWorksDetails({ works: res.data.data, loading: false, error: null }));
  } catch (err: any) {
    dispatch(setWorksDetails({ error: "فشل جلب الأعمال", loading: false }));
    toast.error(err?.response?.data?.message || "فشل جلب الأعمال");
  }
};


  useEffect(() => {
    fetchWorks();
  },[]);

  // معاينة الصورة
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleAddWork = async () => {
    if (!selectedFile) return toast.error("اختر صورة أولاً");
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      dispatch(setWorksDetails({loading:true}))
      const res = await Axios({ ...SummaryApi.Work.addwork, data: formData });
      if (res.data.success) {
        toast.success("تمت إضافة العمل بنجاح");
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchWorks();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "فشل الإضافة");
    } finally {
      dispatch(setWorksDetails({loading:true}))
    }
  };

  const handleDeleteWork = async () => {
     try {
      if (!selectedWorkId) return;
      const response = await Axios({
        ...SummaryApi.Work.deleteWork(selectedWorkId),
      });
      if (response.data.success) {
        toast.success("تم حذف الصورة بنجاح");
       dispatch(setWorksDetails({
        works: works.filter((work: any) => work._id !== selectedWorkId),
        loading: false,
      }));
      } else {
        toast.error(response.data.message || "فشل حذف الصورة");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء الحذف");
    } finally {
      setShowConfirm(false);
      setSelectedWorkId(null);
    }
  };
  return (
    <div className="max-w-5xl mx-auto p-6 mt-20" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-[#6b252f]">📁 إدارة الأعمال</h1>

      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="border rounded px-3 py-1 text-sm"
          />
          <button
            onClick={handleAddWork}
            disabled={loading || !selectedFile}
            className={`px-4 py-2 rounded text-white transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#6b252f] hover:bg-[#5a1f28]"
            }`}
          >
            {loading ? "جارٍ الرفع..." : "➕ إضافة"}
          </button>
        </div>
        <Link href="/" className="text-[#6b252f] hover:underline text-sm">
          ← العودة للصفحة الرئيسية
        </Link>
      </div>

      {/* معاينة الصورة */}
      {previewUrl && (
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">📸 معاينة:</p>
          <Image
            src={previewUrl}
            width={200}
            height={200}
            alt="معاينة"
            className="w-48 h-auto rounded border shadow"
          />
        </div>
      )}

      {/* عرض الصور */}
      {works.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          لا توجد أعمال مضافة بعد 📭
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {works.map((work: { _id: string; imageUrl: string }) => (
            <div
              key={work._id}
              className="relative group border rounded shadow hover:shadow-lg transition overflow-hidden"
            >
              <Image
                src={work.imageUrl}
                alt={`صورة العمل ${work._id}`}
                width={400}     // حدد قيمة مناسبة
                height={256}    // أو خليها متناسبة مع التصميم
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => handleDeleteClick(work._id)}
                className="absolute top-2 left-2 bg-yellow-300 backdrop-blur-sm text-red-600 hover:text-red-800 p-1 rounded-full
                hover:scale-105"
                title="حذف"
              >
                <MdDelete size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={showConfirm}
        message="هل أنت متأكد من حذف هذا العمل؟"
        onConfirm={handleDeleteWork}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );

  };

  

export default WorkAdmin;
