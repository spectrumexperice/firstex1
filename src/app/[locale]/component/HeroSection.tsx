"use client";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import PartnersSection from "./PartnersSection";

export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isRtl = locale === "ar";

  // منطق اختيار الصور بناءً على اللغة (الصور الأساسية للديسكتوب)
  const heroImage = isRtl ? "/video/piccc2.png" : "/video/piccc1.png";
  // منطق اختيار صور الموبايل
  const mobileImage = "/video/pic.png" 

  return (
    
     <section
      className="relative w-full h-screen overflow-hidden mt-2 mb-7"
      dir={isRtl ? "rtl" : "ltr"}
    >
    
      <noscript>
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
      </noscript>

      {/* خلفية الصورة للديسكتوب (تظهر من md فأعلى) */}
      <motion.img
        key={`desktop-${heroImage}`}
        src={heroImage}
        alt={t("title")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden md:block absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* خلفية الصورة للموبايل (تظهر فقط في sm وتختفي في md) */}
      <motion.img
        key={`mobile-${mobileImage}`}
        src={mobileImage}
        alt={t("title")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="block md:hidden absolute inset-0 w-full h-full object-cover z-0  "
      />

      {/* Overlay خفيف */}
      {/* <div className="absolute inset-0 bg-white/20 z-10" /> */}

      {/* محتوى القسم */}
      <div className="relative z-20 h-full container mx-auto px-6 md:flex items-center hidden">
        <motion.div
          // في الموبايل: سنترنا كل شيء (items-center text-center)
          // في md فأعلى: النص يروح "Start" (يمين للعربي، يسار للإنجليزي)
          className="flex flex-col w-full items-center text-center md:items-start md:text-start"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.2, duration: 0.8 },
            },
          }}
        >
      
          <div className="flex justify-center items-center gap-1  ">
            <motion.h1
              className="text-2xl lg:text-6xl md:text-4xl pl-1 my-2 bg-[#6b252f]  text-white font-extrabold p-2   font-[cairo]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {t("title")}
            </motion.h1>
            <span className="font-bold">...</span>
            <motion.h1
              className="text-2xl lg:text-4xl pl-4  my-2 border-l-4   font-bold border-teal-400   font-[cairo]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {t("title2")}
            </motion.h1>
          </div>
          {/* الوصف: حجم مريح في الموبايل وضخم في الكبير */}
          <motion.p
            className=" hidden lg:block   text-xl  text-gray-400 mb-8  
            drop-shadow-lg font-bold mt-6 "
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            {t("description")}
          </motion.p>
          <motion.p
            className=" lg:hidden mt-6 font-bold md:text-xl text-2xl text-gray-400 mb-8 max-w-sm md:max-w-xl lg:max-w-2xl drop-shadow-lg"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            {t("subtitle")}
          </motion.p>

          <motion.a
            href={`/${locale}/services`}
            className="bg-gray-300 text-[#6b252f] px-8  py-3 md:px-14 md:py-4 rounded-full   hover:bg-gray-200 transition-all shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="p-4  text-lg font-bold">{t("cta")}</span>
          </motion.a>
          
        </motion.div>
       
      </div>
      
      {/* 📱 Mobile Hero Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end px-6 pb-10 md:hidden">
        <motion.div
          className="flex flex-col items-center text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.2, duration: 0.8 },
            },
          }}
        >
          {/* العنوان */}
             <motion.h2
              className="text-xl mt-2 font-bold bg-[#6b252f] px-auto w-full p-2 text-white
            mb-2 pb-2 font-[cairo]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {t("title4")}
            </motion.h2>
          <div className="mb-20 flex items-center justify-center gap-6">
            <span className="h-px flex-1 max-w-[140px] bg-black">-----</span>
 
            <motion.h2
              className="text-xl mt-2 font-bold text-[#6b252f]  border-b-2
            mb-1 border-teal-400 pb-2 font-[cairo]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {t("title3")}
            </motion.h2>

            <span className="h-px flex-1 max-w-[140px] bg-[#6b252f]">
              -----
            </span>
          </div>

          {/* الوصف */}
          <motion.p
            className="mt-4 font-bold text-gray-400 max-w-xs"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            {t("subtitle")}
          </motion.p>

          {/* الزر */}
          <motion.a
            href={`/${locale}/services`}
            className="mt-6 bg-gray-200 text-[#6b252f] px-6 py-3 rounded-full font-bold text-sm shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("cta")}
          </motion.a>
        </motion.div>
         
      </div>
      

      
    </section>
      
    
   
  );
}