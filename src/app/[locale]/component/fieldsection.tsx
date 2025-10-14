"use client";
import { motion } from "framer-motion";
import { FaTools, FaWaveSquare, FaBuilding, FaBullseye } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";
export default function FieldContent() {
    const t = useTranslations("Ourfields");
  const locale = useLocale();
   const services = [
    {
      icon: <FaWaveSquare className="text-[#28a420] w-10 h-10" />,
      title: t("services.0.title"),
      description: t("services.0.description"),
    },
    {
      icon: <FaTools className="text-[#6b252f] w-10 h-10" />,
      title: t("services.1.title"),
      description: t("services.1.description"),
    },
    {
      icon: <FaBuilding className="text-[#28a420] w-10 h-10" />,
      title: t("services.2.title"),
      description: t("services.2.description"),
    },
    {
      icon: <FaBullseye className="text-[#6b252f] w-10 h-10" />,
      title: t("services.3.title"),
      description: t("services.3.description"),
    },
  ]; 
  return (
     <section
        className="bg-[#b0b0b0] py-20 px-6 font-arabic"
        dir={locale === "ar" ? "rtl" : "ltr"}
        aria-labelledby="fields-title"
      >
        <noscript>
          <h1>{t("title")}</h1>
          <p>{services.map((s) => s.description).join(" ")}</p>
        </noscript>
        <div className="max-w-6xl mx-auto">
          <motion.h2
            id="fields-title"
            className="text-4xl font-[Cairo] font-extrabold mb-12 text-[#6b252f] text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t("title")}
          </motion.h2>
          <div className="space-y-10">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="flex flex-col md:flex-row md:items-start bg-white rounded-lg shadow-md p-6 gap-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="flex-shrink-0">{service.icon}</div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-[#6b252f]">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 max-x-xs leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  )
}