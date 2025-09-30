// WhatsAppButton.tsx
"use client";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/966597106802" // ضع رقم الشركة هنا بدون الصفر
      target="_blank"
      rel="noopener noreferrer"
      className=" bg-green-500 text-white rounded-full p-2 shadow-xl hover:bg-green-600 transition"
      aria-label="WhatsApp"
    >
      <FaWhatsapp className="w-5 h-5" />
    </a>
  );
}
