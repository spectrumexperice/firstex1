"use client";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Axios from "../utilities/axios";
import AxiosToastError from "../utilities/AxiosToatError";
import SummaryApi from "../common/summaryApi";
import { logoutUser } from "../store/userSlice";
import toast from "react-hot-toast";
import { AiOutlineProduct } from "react-icons/ai";
import { Link } from "@/src/i18n/navigation";
import { LogOut, Mail, Users,Library  } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

const UserMenu = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
const router = useRouter(); 
const locale = useLocale()  
  const handleLogOut = async () => {
    try {
      const response = await Axios({
         ...SummaryApi.logout 
        });
      if (response.data.success) {
        dispatch(logoutUser());
        localStorage.clear();
        toast.success(response.data.message);
         router.push(`/${locale}/`);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  if (user.role !== "ADMIN") return null;

  return (
    <div className="text-[#6b252f] w-48">
      <div className="font-bold mb-1">حسابي <span className="bg-yellow-300 text-xs ml-2 px-2 py-0.5 rounded-full text-gray-800">مدير النظام</span></div>
      <div className="text-sm mb-3 truncate text-gray-700">{user.name}</div>
      <hr className="mb-2" />

      <div className="grid gap-2 text-sm">
        <Link href="admin" className="flex items-center gap-2 hover:text-green-600 transition">
          <Library size={16} /> أعمالنا
        </Link>
        <Link href="partnerAdmin" className="flex items-center gap-2 hover:text-green-600 transition">
          <Users size={16} /> الشركاء
        </Link>
        <Link href="/mail" className="flex items-center gap-2 hover:text-green-600 transition">
          <Mail size={16} /> الرسائل
        </Link>
        <Link href="/ProductAdmin" className="flex items-center gap-2 hover:text-green-600 transition">
          <AiOutlineProduct size={16} /> ادارة المنتجات
        </Link>
        <button
          onClick={handleLogOut}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 transition mt-2"
        >
          <LogOut size={16} /> تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
