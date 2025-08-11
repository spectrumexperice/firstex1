"use client";
import { motion } from "framer-motion";
/* import Link from "next/link";
import Image from "next/image"; */
import { useLocale, useTranslations } from "next-intl";
const Hero = () => {
   const t = useTranslations("hero");
   const locale = useLocale() 
  return (
    <section className="relative w-full h-screen overflow-hidden " dir="rtl">
      {/* خلفية الفيديو */}
      <motion.video
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
         viewport={{once:true}}
        autoPlay
        muted
        loop
        preload="none"
        playsInline
        /* poster="/my-audio-company/src/app/assits/fallback.jpeg" */
        aria-label="عرض فيديو تعريفي لحلول الصوت"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
       { <source src="/videos/show.mp4" type="video/mp4" />}
        متصفحك لا يدعم تشغيل الفيديو
      </motion.video>
      {/*  <Image
        src={fallback}
        alt="fallback"
        fill
        className="object-cover absolute inset-0 w-full h-full"
      /> */}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60 backdrop-blur-sm z-10" />

      {/* محتوى القسم */}
    <motion.div
        className="relative z-20 text-center mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl flex flex-col justify-center items-center h-full"
        initial={{ opacity: 0, y: 60 }}
        viewport={{ once: true }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-[Cairo] font-bold mb-4 text-white drop-shadow-lg pb-2"
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {t("title")}
        </motion.h1>
        <motion.h2 className="sr-only">
          {t("subtitle")}
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl mb-8 text-gray-200 drop-shadow-[0_4px_4px_rgba(0,0,0,0.7)]"
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {t("description")}
        </motion.p>

        <motion.a
          href={`/${locale}/services`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-[#c9c8c8] to-[#997e7e]
           hover:from-[#a3a2a2] hover:to-[#776262] text-white px-6 py-3 
           rounded-full font-semibold transition duration-300 shadow-xl"
        >
          {t("cta")}
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Hero;
