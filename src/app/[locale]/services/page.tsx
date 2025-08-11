
"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from "react";
import { FaTools } from "react-icons/fa";
import { useLocale, useTranslations } from 'next-intl'; // <-- استيراد hook الترجمة

import a1 from '@/app/assits/pic1.png';
import a2 from '@/app/assits/a2.jpg';
import a3 from '@/app/assits/a3.jpg';
import a4 from '@/app/assits/a4-1.jpg';
import a5 from '@/app/assits/a5.jpg';

const ServicesSection = () => {
  const t = useTranslations('services'); // مفتاح الترجمة الجذري لخدماتنا
  const locale = useLocale() 
  // بيانات الخدمات بدون نصوص، فقط مفاتيح الترجمة
  const services = [
    {
      titleKey: 'service1.title',
      descKey: 'service1.description',
      image: a1,
    },
    {
      titleKey: 'service2.title',
      descKey: 'service2.description',
      image: a2,
    },
    {
      titleKey: 'service3.title',
      descKey: 'service3.description',
      image: a3,
    },
    {
      titleKey: 'service4.title',
      descKey: 'service4.description',
      image: a4,
    },
    {
      titleKey: 'service5.title',
      descKey: 'service5.description',
      image: a5,
    },
  ];

  const [expandedCards, setExpandedCards] = useState<{ [key: number]: boolean }>({});

  const toggleCard = (index: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section className="bg-white font-arabic pt-25" dir="rtl">
      <div className="container mx-auto px-4"   dir={locale === 'en' ? 'ltr' : 'rtl'}>
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-arabic font-bold text-center text-[#6b252f] mb-4"
        >
          <span className="text-3xl font-extrabold relative inline-block text-[#6b252f] font-[Cairo]"
            style={{ fontFeatureSettings: "'pnum'" }}>
            {t('title')}
          </span>
        </motion.h2>

        <motion.p
          className="text-center text-gray-600 max-w-2xl mx-auto mb-5 font-medium"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t('subtitle')}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((s, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 1, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gray-50 rounded-xl shadow hover:shadow-lg overflow-hidden transition-all"
            >
              <div className="relative w-full aspect-[1000/536] bg-[#b0b0b0] overflow-hidden">
                <Image
                  src={s.image}
                  alt={t(s.titleKey)}
                  width={1000}
                  height={536}
                  className="rounded-2xl w-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-2xl flex gap-2 items-center font-semibold mb-2 text-[#6b252f] font-[Cairo]" style={{ fontFeatureSettings: "'pnum'" }}>
                  <FaTools className="text-[#28a420]" />
                  {t(s.titleKey)}
                </h3>
                <p className="font-medium text-gray-700 leading-relaxed mt-2 ">
                  {expandedCards[index]
                    ? t(s.descKey)
                    : t(s.descKey).slice(0, 100) + "..."}
                  <button
                    onClick={() => toggleCard(index)}
                    className="text-[#28a420] ml-2 underline"
                  >
                    {expandedCards[index] ? t('hide') : t('readMore')}
                  </button>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
