"use client";

import { useState } from "react";
import Axios from "@/app/utilities/axios";
import toast from "react-hot-toast";

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await Axios.post("/api/newsletter/subscribe", { email });
      if (res.data.success) {
        toast.success(res.data.message);
        setEmail("");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الاشتراك، حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#6b252f] py-10 px-4 rounded-lg max-w-md mx-auto text-center text-white" dir="rtl">
      <h3 className="text-2xl font-semibold mb-4">اشترك في نشرتنا البريدية</h3>
      <p className="mb-6 text-gray-300">
        كن أول من يحصل على أحدث العروض والتحديثات الخاصة بنا.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-3 justify-center">
        <input
          type="email"
          name="email"
          required
          placeholder="أدخل بريدك الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-l-lg p-3 flex-grow focus:outline-none text-black"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 rounded-r-lg transition"
        >
          {loading ? "جارٍ الاشتراك..." : "اشترك"}
        </button>
      </form>
    </section>
  );
}
