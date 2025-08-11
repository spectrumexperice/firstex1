"use client";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import Axios from "@/app/utilities/axios";
import AxiosToastError from "@/app/utilities/AxiosToatError";
import SummaryApi from "../../common/summaryApi";
import { logoutUser } from "../../store/userSlice";
import toast from "react-hot-toast";

import Link from "next/link";
import { LogOut, Mail, UserCog, Users } from "lucide-react";

const UserMenu = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const handleLogOut = async () => {
    try {
      const response = await Axios({
         ...SummaryApi.logout 
        });
      if (response.data.success) {
        dispatch(logoutUser());
        localStorage.clear();
        toast.success(response.data.message);
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
        <Link href="/dashboard/admin" className="flex items-center gap-2 hover:text-green-600 transition">
          <UserCog size={16} /> لوحة التحكم
        </Link>
        <Link href="/dashboard/partnerAdmin" className="flex items-center gap-2 hover:text-green-600 transition">
          <Users size={16} /> الشركاء
        </Link>
        <Link href="/dashboard/mail" className="flex items-center gap-2 hover:text-green-600 transition">
          <Mail size={16} /> الرسائل
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
