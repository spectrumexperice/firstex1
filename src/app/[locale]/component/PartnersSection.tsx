"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const PartnersSection = () => {
  const { partners, loading } = useSelector(
    (state: RootState) => state.partner
  );
  const t = useTranslations("OurPartner");
  return (
    <section
      className="bg-[#f9f9f9] py-16 px-4 lg:px-20"
      aria-labelledby="partners-title"
      dir="rtl"
    >
      <motion.h2
        id="partners-title"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-[Cairo] font-extrabold mb-12 text-[#6b252f] text-center"
      >
         {t("title")}
      </motion.h2>

      {loading ? (
        <p className="text-center text-gray-600">جاري تحميل الشركاء...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-center">
          {partners.map((partner, index) => (
            <motion.div
              key={partner._id}
              className="bg-white rounded-lg shadow-md p-4 flex justify-center items-center h-28"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Image
                src={partner.logoUrl}
                alt={`شعار ${partner.companyName}`}
                width={100}
                height={100}
                className="object-contain max-h-20"
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PartnersSection;
