"use client";
import { motion } from "framer-motion";

import teamImage from 'src/assits/who3.jpg'
import mission from "src/assits/who4.jpg";
import Image from "next/image";
import visionImage from "src/assits/success.webp";
import valuesImage from 'src/assits/Business-Values.jpg';
import { FaCheckCircle, FaLightbulb, FaBullseye, FaBalanceScale, FaChartLine } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";

const AboutPage = () => {
  const t = useTranslations("about");
  const locale = useLocale();
  
  // إعدادات الحركة المشتركة
  const animationSettings = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  // بيانات القيم لتحسين التنظيم
  const valuesData = [
    { icon: FaCheckCircle, key: "professionalism" },
    { icon: FaLightbulb, key: "innovation" },
    { icon: FaBalanceScale, key: "transparency" },
    { icon: FaChartLine, key: "continuousImprovement" },
    { icon: FaBullseye, key: "integrity" }
  ];

  return (
    <section 
      className="bg-white font-arabic pt-30 pb-10"
      dir={locale === 'en' ? 'ltr' : 'rtl'}
      lang={locale} // إضافة سمة اللغة لتحسين إمكانية الوصول
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* تحسين الهوامش */}
        
        {/* قسم من نحن */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12 lg:mb-16"
          {...animationSettings}
        >
          <div>
            <h3 
              className="text-2xl md:text-3xl font-extrabold text-[#6b252f] font-[Cairo] pb-3"
              dir={locale === 'en' ? 'ltr' : 'rtl'}
              style={{ fontFeatureSettings: "'pnum'" }}
            >
              {t("whoWeAre.title")}
            </h3>
            <p 
              className="font-medium text-[#6b252f] leading-relaxed text-justify text-base md:text-lg"
              dir={locale === 'en' ? 'ltr' : 'rtl'}
            >
              {t("whoWeAre.text")}
            </p>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={teamImage}
              alt="فريق سبكتروم"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              priority // تحميل الصورة الأولى أولاً
              sizes="(max-width: 768px) 100vw, 50vw" // تحسين أداء الصور
            />
          </div>
        </motion.div>

        {/* مهمتنا */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12 lg:mb-16"
          {...animationSettings}
          transition={{ ...animationSettings.transition, delay: 0.2 }}
        >
          <div className="md:order-1">
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#6b252f] font-[Cairo] pb-3">
              {t("ourMission.title")}
            </h3>
            <p className="font-medium text-[#6b252f] leading-relaxed text-justify text-base md:text-lg">
              {t("ourMission.text")}
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={mission}
              alt="مهمتنا"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>

        {/* الرؤية */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12 lg:mb-16"
          {...animationSettings}
          transition={{ ...animationSettings.transition, delay: 0.4 }}
        >
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#6b252f] font-[Cairo] pb-3">
              {t("ourVision.title")}
            </h3>
            <p className="font-medium text-[#6b252f] leading-relaxed text-justify text-base md:text-lg">
              {t("ourVision.text")}
            </p>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={visionImage}
              alt="الرؤية"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>

        {/* قيمنا */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          {...animationSettings}
          transition={{ ...animationSettings.transition, delay: 0.6 }}
        >
          <div className="hidden md:block rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={valuesImage}
              alt="قيمنا"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#6b252f] font-[Cairo] pb-3">
              {t("ourValues.title")}
            </h3>
            
            <ul className="space-y-4">
              {valuesData.map(({icon: Icon, key}) => (
                <li key={key} className="flex items-start gap-3">
                  <Icon 
                    className="text-green-700 mt-1 flex-shrink-0" 
                    aria-hidden="true" 
                  />
                  <span className="text-base md:text-lg">
                    <span className="font-semibold text-green-700">
                      {t(`ourValues.valuesList.${key}.title`)}
                    </span>{" "}
                    {t(`ourValues.valuesList.${key}.description`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* للهواتف فقط */}
          <div className="md:hidden rounded-2xl overflow-hidden shadow-lg mt-6">
            <Image
              src={valuesImage}
              alt="قيمنا"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              sizes="100vw"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutPage;