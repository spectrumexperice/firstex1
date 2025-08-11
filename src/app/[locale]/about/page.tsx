"use client";
import { motion } from "framer-motion";
import teamImage from "@/app/assits/who3.jpg";
import mission from "@/app/assits/who4.jpg";
import Image from "next/image";
import visionImage from "@/app/assits/success.webp"
import valuesImage from '@/app/assits/Business-Values.jpg'
import { FaCheckCircle, FaLightbulb, FaBullseye, FaBalanceScale, FaChartLine } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";
const AboutPage = () => {
  const t = useTranslations("about");
  const locale = useLocale()   
  return (
    <section className="bg-white font-arabic pt-30" dir={locale === 'en' ? 'ltr' : 'rtl'}>
      <div className="container mx-auto px-4">
        {/** قسم من نحن */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center mb-5 lg:mb-10"
          initial={{ opacity: 1, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
           viewport={{once:true}}
          transition={{ duration: 0.8 }}
        >
          <div>
            <h3 className="text-3xl font-extrabold relative inline-block text-[#6b252f] font-[Cairo] pb-3"
               dir={locale === 'en' ? 'ltr' : 'rtl'}
              style={{ fontFeatureSettings: "'pnum'" }}>{t("whoWeAre.title")}</h3>
            <p  dir={locale === 'en' ? 'ltr' : 'rtl'}
            className="font-medium text-[#6b252f] leading-relaxed text-justify">
              {t("whoWeAre.text")}
            </p>
          </div>
          {/**الصورة */}
          <div>
            <Image
              src={teamImage}
              alt="فريق سبكتروم"
              width={800}
              height={600}
              className="rounded-2xl w-full object-cover shadow-lg"
            />
          </div>
        </motion.div>

        {/**مهمتنا */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center  mb-5 lg:mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
           viewport={{once:true}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* النص */}
          <div className="md:order-1 ">
            <h3 className="text-3xl font-extrabold relative inline-block text-[#6b252f] font-[Cairo] pb-3"
              style={{ fontFeatureSettings: "'pnum'" }}>{t("ourMission.title")}</h3>
            <p className="font-medium text-[#6b252f] leading-relaxed mb-5 text-justify">
              {t("ourMission.text")}
            </p>
          </div>

          {/* الصورة */}
          <div className="rounded-2xl overflow-hidden">
            <Image
              src={mission}
              alt="مهمتنا"
              width={800}
              height={600}
              className="rounded-2xl w-full object-cover shadow-lg"
            />
          </div>
        </motion.div>

        {/* الرؤية */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center  mb-5 lg:mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
           viewport={{once:true}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div>
            <h3 className="text-3xl font-extrabold relative inline-block text-[#6b252f] font-[Cairo] pb-3"
              style={{ fontFeatureSettings: "'pnum'" }}>   {t("ourVision.title")}
              
            </h3>
            
            
            <p className="font-medium text-[#6b252f] leading-relaxed text-justify">
            {t("ourVision.text")}
            </p>
          </div>
          <div>
            <Image
              src={visionImage}
              alt="الرؤية"
              width={800}
              height={600}
              className="rounded-2xl w-full object-cover shadow-lg"
            />
          </div>
        </motion.div>
        {/* قيمنا */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
           viewport={{once:true}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* الصورة أولاً */}
          <div className="rounded-2xl overflow-hidden md:order-1 hidden lg:block md:block">
            <Image
              src={valuesImage}
              alt="قيمنا"
              width={800}
              height={600}
              className="rounded-2xl w-full object-cover shadow-lg"
            />
          </div>

          {/* النص */}
          <div className="md:order-2">
            <h3 className="text-3xl font-extrabold relative inline-block text-[#6b252f] font-[Cairo] pb-3"
              style={{ fontFeatureSettings: "'pnum'" }}> {t("ourValues.title")}</h3>
            <ul className="font-medium text-[#6b252f] leading-relaxed space-y-4 max-w-[680px] text-justify">
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-green-700 mt-1" />
                <span>
                  <span className="font-semibold text-green-700">
                  {t("ourValues.valuesList.professionalism.title")}
                  </span>{" "}
                  {t("ourValues.valuesList.professionalism.description")}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FaLightbulb className="text-green-700 mt-1" />
                <span>
                  <span className="font-semibold text-green-700">
                  {t("ourValues.valuesList.innovation.title")}
                  </span>{" "}
                    {t("ourValues.valuesList.innovation.description")}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FaBalanceScale className="text-green-700 mt-1" />
                <span>
                  <span className="font-semibold text-green-700">
                   {t("ourValues.valuesList.transparency.title")}
                  </span>{" "}
               {t("ourValues.valuesList.transparency.description")}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FaChartLine className="text-green-700 mt-1" />
                <span>
                  <span className="font-semibold text-green-700">
                  {t("ourValues.valuesList.continuousImprovement.title")}
                  </span>{" "}
                  {t("ourValues.valuesList.continuousImprovement.description")}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FaBullseye className="text-green-700 mt-1" />
                <span>
                  <span className="font-semibold text-green-700">  
                     {t("ourValues.valuesList.integrity.title")}
                    </span>{" "}
                  {t("ourValues.valuesList.integrity.description")}
                </span>
              </li>
            </ul>
          </div>
          {/**phone only */}
          <div className="rounded-2xl overflow-hidden md:order-1  lg:hidden md:block">
            <Image
              src={valuesImage}
              alt="قيمنا"
              width={800}
              height={600}
              className="rounded-2xl w-full object-cover shadow-lg"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default AboutPage;
