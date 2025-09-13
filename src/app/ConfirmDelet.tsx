// components/ConfirmModal.tsx
"use client";

import { Button } from "../components/ui/button";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title = "تأكيد",
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-md text-center" dir="rtl">
        <h2 className="text-xl font-bold mb-4 text-[#6b252f]">{title}</h2>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={onConfirm} className="bg-red-600 text-white hover:bg-red-700">
            تأكيد الحذف
          </Button>
          <Button onClick={onCancel} variant="outline">
            إلغاء
          </Button>
        </div>
      </div>
    </div>
  );
}
