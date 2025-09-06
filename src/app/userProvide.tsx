"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserDetails, logoutUser } from "@/app/store/userSlice";

import fetchUserDetails from "@/app/utilities/fetchUserDetails";

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetchUserDetails();
        dispatch(setUserDetails(res.data));
      } catch {
        dispatch(logoutUser());
      }
    };
   
    getUser();
   
  }, );

  return <>{children}</>;
}
