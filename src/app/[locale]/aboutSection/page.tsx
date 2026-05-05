"use client";
import { useState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useScroll, useSpring, useInView } from "framer-motion";
import Image from "next/image";

import teamImage from "src/assits/who3.jpg";
import mission from "src/assits/who4.jpg";
import visionImage from "src/assits/success.webp";
import valuesImage from "src/assits/Business-Values.jpg";
import {
  FaCheckCircle,
  FaLightbulb,
  FaBullseye,
  FaBalanceScale,
  FaChartLine,
} from "react-icons/fa";

export default function AboutContent() {
  const t = useTranslations("about");
  const locale = useLocale();

  // 1. مؤشر تقدم القراءة (نسخة مطورة بـ Spring ليكون النزول ناعماً جداً)
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const valuesData = [
    { icon: FaCheckCircle, key: "professionalism", color: "#6b252f" },
    { icon: FaLightbulb, key: "innovation", color: "#8B2F3D" },
    { icon: FaBalanceScale, key: "transparency", color: "#4A1520" },
    { icon: FaChartLine, key: "continuousImprovement", color: "#6b252f" },
    { icon: FaBullseye, key: "integrity", color: "#8B2F3D" },
  ];

  const sections = [
    { key: "whoWeAre", img: teamImage, color: "bg-[#6b252f]" },
    { key: "ourMission", img: mission, color: "bg-[#8B2F3D]" },
    { key: "ourVision", img: visionImage, color: "bg-[#4A1520]" },
  ];

  return (
    <div className="relative bg-white  " dir={locale === "en" ? "ltr" : "rtl"}>
      {/*  <Image
            src={teamImage}
            alt="Hero"
            fill
            className="object-cover grayscale"
          /> */}
      {/* مؤشر التقدم العلوي (Premium Progress Bar) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#6b252f] origin-[0%] z-[100] "
        style={{ scaleX }}
      />

      {/* --- HERO SECTION: بتأثير القناع (Masking) --- */}
      <section className="relative h-[90vh] flex items-center justify-center bg-[#1a0a0e] overflow-hidden mt-20 ">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={valuesImage}
            alt="Hero"
            fill
            className="object-cover grayscale"
          />
        </motion.div>

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white font-[Cairo] tracking-tighter drop-shadow-lg">
              {t("whoWeAre.title")}
            </h1>
            <div className="mt-6 flex justify-center gap-4">
              <span className="h-1 w-20 bg-[#8B2F3D] rounded-full"></span>

              <span className="h-1 w-20 bg-[#8B2F3D] rounded-full"></span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- MAIN CONTENT: نظام الطبقات المتناوبة --- */}
      <div className="container mx-auto px-6 lg:px-20  relative z-20  ">
        {sections.map((section, idx) => (
          <Section key={section.key} section={section} idx={idx} t={t} />
        ))}
      </div>

      {/* --- VALUES: نظام البطاقات الزجاجية (Glassmorphism) --- */}
      <section className="py-32  relative ">
        <div className="container mx-auto px-6 lg:px-20 ">
          <div className="mb-20 flex items-center justify-center gap-6">
            <span className="h-px flex-1 max-w-[140px] bg-black"></span>

            <h2 className="text-4xl lg:text-6xl font-bold text-[#8B2F3D] font-[Cairo] whitespace-nowrap mb-5">
              {t("ourValues.title")}
            </h2>

            <span className="h-px flex-1 max-w-[140px] bg-black"></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {valuesData.map((item, i) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 110,
                    damping: 15,
                  }}
                  whileHover={{
                    y: -6,
                    scale: 1.03,
                  }}
                  className="relative group "
                >
                  {/* CARD - نفس أسلوب دليل المدينة */}
                  <div className="relative overflow-hidden rounded-2xl  p-6 bg-white border border-gray-100 shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                    {/* hover glow (نفس الفكرة الأصلية) */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-[#6b252f]/10 via-transparent to-[#6b252f]/5" />

                    {/* icon box (نفس أسلوب الكروت الاحترافية) */}
                    <div className="relative z-10 w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center bg-[#6b252f] shadow-md">
                      <Icon className="text-white text-xl" />
                    </div>

                    {/* title */}
                    <h3 className="relative z-10 text-center text-xl font-bold text-[#1a0a0e] font-[Cairo]">
                      {t(`ourValues.valuesList.${item.key}.title`)}
                    </h3>

                    {/* description */}
                    <p className="relative z-10 mt-2 text-center text-gray-600 text-sm leading-loose">
                      {t(`ourValues.valuesList.${item.key}.description`)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

// مكون القسم الفرعي لتحسين الأداء (Component Memoization concept)
function Section({ section, idx, t }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const [expanded, setExpanded] = useState(false);
  const text = t(`${section.key}.text`);
  const isLong = text.length > 180;
  const isEnglish = typeof window !== "undefined" && document.dir === "ltr";
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        setMouse({ x, y });
      }}
      onMouseLeave={() => setMouse({ x: 0, y: 0 })}
      className={`relative rounded-3xl overflow-hidden mb-40 shadow-[0_40px_120px_rgba(0,0,0,0.15)]   ${
        idx % 2 !== 0 ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* المحتوى فوق الصورة */}
      <div className="relative z-10 container mx-auto px-6 lg:px-20 py-10 lg:py-24 ">
        <div
          className={`flex flex-col lg:flex-row items-center gap-10  ${
            idx % 2 !== 0 ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* النص - خلفية زجاجية */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
            animate={{
              opacity: isInView ? 1 : 0,
              x: isInView ? mouse.x * 10 : 0,
              y: isInView ? mouse.y * 10 : 0,
            }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          >
            <div className="backdrop-blur-md bg-[#6b252f]  rounded-2xl p-8 lg:p-12 border border-yellow-300  z-[9999]">
              <div className="relative">
                <h3 className="relative z-10 text-4xl lg:text-6xl font-black text-yellow-300 font-[Cairo] mb-2">
                  {t(`${section.key}.title`)}
                </h3>
                

                
                <p
                  className="text-lg md:text-xl text-white leading-relaxed font-medium max-w-prose
  bg-black/40 backdrop-blur-sm rounded-xl
  py-5 pr-5 pl-8
  border-l-4 border-white/50"
                >
                  {isLong
                    ? expanded
                      ? text
                      : text.slice(0, 180) + "..."
                    : text}
                </p>

                {isLong && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-6 flex items-center gap-3 text-yellow-300 font-bold group"
                  >
                    <span className="h-px w-8 bg-white group-hover:w-12 transition-all duration-300" />
                    <span>
                      {expanded
                        ? isEnglish
                          ? "Show less"
                          : "إخفاء"
                        : isEnglish
                          ? "Discover more"
                          : "اكتشف المزيد"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
