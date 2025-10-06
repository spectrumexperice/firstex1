"use client";
import Head from "next/head";
import { motion } from "framer-motion";
import { FaCheckCircle, FaShieldAlt, FaClock, FaThumbsUp } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
const WhyChooseUs = () => {
  const t = useTranslations("whyChooseUs");
const locale = useLocale() 
  const features = [
    {
      icon: <FaCheckCircle className="text-[#28a420] w-12 h-12" />,
      title: t("features.0.title"),
      description: t("features.0.description"),
    },
    {
      icon: <FaShieldAlt className="text-[#6b252f] w-12 h-12" />,
      title: t("features.1.title"),
      description: t("features.1.description"),
    },
    {
      icon: <FaClock className="text-[#28a420] w-12 h-12" />,
      title: t("features.2.title"),
      description: t("features.2.description"),
    },
    {
      icon: <FaThumbsUp className="text-[#6b252f] w-12 h-12" />,
      title: t("features.3.title"),
      description: t("features.3.description"),
    },
  ];
  // دمج جميع العناوين والوصف لأغراض SEO
  const description = t("features.0.description") + " " +
                      t("features.1.description") + " " +
                      t("features.2.description") + " " +
                      t("features.3.description");

  return (
    <>
      <Head>
        <title>سبكتروم | {t("title")}</title>
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content="جودة صوت, موثوقية, سرعة التنفيذ, خدمة عملاء, حلول صوتية, سبكتروم"
        />
        <meta property="og:title" content={`سبكتروم | ${t("title")}`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
      </Head>
      <section
        aria-labelledby="why-choose-us-title"
        className="bg-white py-20 px-6 font-arabic"
        dir="rtl"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            id="why-choose-us-title"
            className="text-4xl font-[Cairo] font-extrabold mb-8 text-[#6b252f]"
            initial={{ opacity: 0, y: 20 }}
            dir={locale === "en" ? "ltr" : "rtl"}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t("title")}
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
            {features.map(({ icon, title, description }, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-default"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                aria-label={title}
                role="article"
              >
                <div className="mb-4">{icon}</div>
                <h3
                  className="text-xl font-medium mb-2 text-[#6b252f]"
                  dir={locale === "en" ? "ltr" : "rtl"}
                >
                  {title}
                </h3>
                <p
                  className="text-gray-700 max-w-xs "
                  dir={locale === "en" ? "ltr" : "rtl"}
                >
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyChooseUs;
