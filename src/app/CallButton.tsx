// CallButton.tsx
"use client";
import { Phone } from "lucide-react";

export default function CallButton() {
  return (
    <a
      href="tel:+966 59 710 6802" // ضع رقم الهاتف الصحيح هنا
      className=" bg-blue-600 text-white rounded-full p-2 shadow-xl hover:bg-blue-700 transition"
      aria-label="Call us"
    >
      <Phone className="w-5 h-5" />
    </a>
  );
}
