"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from "react";
import { FaTools } from "react-icons/fa";
import { useLocale, useTranslations } from 'next-intl';
import Head from "next/head";
import a1 from 'src/assits/pic1.png';
import a2 from 'src/assits/a2.jpg';
import a3 from 'src/assits/a3.jpg';
import a4 from 'src/assits/a4-1.jpg';
import a5 from 'src/assits/a5.jpg';


const ServicesSection = () => {
  const t = useTranslations('services');
  const locale = useLocale();
  
  const [expandedCards, setExpandedCards] = useState<number[]>([]);

  const services = [
    { titleKey: 'service1.title', descKey: 'service1.description', image: a1 },
    { titleKey: 'service2.title', descKey: 'service2.description', image: a2 },
    { titleKey: 'service3.title', descKey: 'service3.description', image: a3 },
    { titleKey: 'service4.title', descKey: 'service4.description', image: a4 },
    { titleKey: 'service5.title', descKey: 'service5.description', image: a5 },
  ];

  const toggleCard = (index: number) => {
    setExpandedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const animationSettings = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <>
      <Head>
        <title>سبكتروم | {t("title")}</title>
        <meta name="description" content={t("subtitle")} />
        <meta
          name="keywords"
          content="حلول صوتية, أنظمة صوتية, استوديوهات, مناسبات, إنتاج صوتي, سبكتروم"
        />
        <meta property="og:title" content={`سبكتروم | ${t("title")}`} />
        <meta property="og:description" content={t("subtitle")} />
        <meta property="og:type" content="website" />
      </Head>
      <section
        className="bg-white font-arabic  pt-30 mt-20 py-10"
        dir={locale === "en" ? "ltr" : "rtl"}
        lang={locale}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#6b252f] mb-4 font-[Cairo]">
              {t("title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-medium text-lg">
              {t("subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                {...animationSettings}
                transition={{
                  ...animationSettings.transition,
                  delay: index * 0.1,
                }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
              >
                <div className="relative w-full aspect-video">
                  <Image
                    src={service.image}
                    alt={t(service.titleKey)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 3} // تحميل أول 3 صور أولاً
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <FaTools className="text-[#28a420] text-xl" />
                    <h3 className="text-xl font-semibold text-[#6b252f]">
                      {t(service.titleKey)}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {expandedCards.includes(index)
                        ? t(service.descKey)
                        : `${t(service.descKey).substring(0, 100)}...`}
                    </p>

                    <button
                      onClick={() => toggleCard(index)}
                      className="text-[#28a420] font-medium hover:underline focus:outline-none"
                      aria-expanded={expandedCards.includes(index)}
                      aria-label={
                        expandedCards.includes(index)
                          ? t("hide")
                          : t("readMore")
                      }
                    >
                      {expandedCards.includes(index)
                        ? t("hide")
                        : t("readMore")}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesSection;