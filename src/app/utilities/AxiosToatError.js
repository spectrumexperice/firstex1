"use client";

import toast from "react-hot-toast";

const AxiosToastError = (error) => {
  toast.error(
    error?.response?.data?.message || "حدث خطأ غير متوقع"
  );
};

export default AxiosToastError;