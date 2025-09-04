"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useState } from "react";

const PartnersSection = () => {
  const { partners, loading } = useSelector((state: RootState) => state.partner);
  const t = useTranslations("OurPartner");

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 4,
      spacing: 15,
    },
    breakpoints: {
      "(max-width: 1024px)": { slides: { perView: 4, spacing: 12 } },
      "(max-width: 768px)": { slides: { perView: 3, spacing: 10 } },
      "(max-width: 480px)": { slides: { perView: 2, spacing: 8 } },
    },
    drag: true,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [activePartner, setActivePartner] = useState<null | typeof partners[0]>(null);

  const openModal = (partner: typeof partners[0]) => {
    setActivePartner(partner);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActivePartner(null);
  };

  return (
    <section
      className="bg-[#f9f9f9] py-4 px-4 lg:px-20"
      aria-labelledby="partners-title"
      dir="rtl"
    >
      <motion.h2
        id="partners-title"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl  font-extrabold mb-12 text-[#6b252f] text-center font-arabic"
      >
        {t("title")}
      </motion.h2>

      {
      loading ? (
        <p className="text-center text-gray-600">{t("loadingPartners")}</p>
      ) : (
        <div className="relative">
          <motion.div
            ref={sliderRef}
            className="keen-slider"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {
            
            partners.map((partner) => (
              <div
                key={partner._id}
                className="keen-slider__slide flex flex-col items-center gap-2 cursor-pointer"
              >
                <div
                  className="bg-white rounded-lg shadow-md p-4 flex justify-center items-center h-28 w-full overflow-hidden relative"
                  onClick={() => openModal(partner)}
                >
                  <Image
                    src={partner.logoUrl}
                    alt={`شعار ${partner.companyName}`}
                    width={120}
                    height={120}
                    className="object-contain max-h-20"
                  />
                </div>
                <button
                  onClick={() => openModal(partner)}
                  className="text-sm text-[#6b252f] hover:underline mt-1"
                >
                  <span className="font-arabic">  {t("look")}</span>
                </button>
              </div>
            ))}


          </motion.div>

          {/* أزرار التحكم */}
          <button
            onClick={() => slider.current?.next()}
            className="absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-[#6b252f] hover:bg-[#8e3d48] text-white p-1 rounded-full ml-2 shadow-md"
            aria-label={t("nextSlider")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 rotate-180"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => slider.current?.prev()}
            className="absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-[#6b252f] hover:bg-[#8e3d48] text-white p-1 rounded-full mr-2 shadow-md"
            aria-label={t("prevSlider")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* النافذة المنبثقة */}
          <AnimatePresence>
            {
            modalOpen && activePartner && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
                onClick={closeModal}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={closeModal}
                    className="absolute top-3 left-3 text-gray-600 hover:text-gray-900 focus:outline-none flex "
                    aria-label={t("closeButtonLabel")}
                  >
                    &#x2715;
                  </button>

                  <h3 className="text-xl font-semibold mb-4 text-[#6b252f]">
                    {t("thankYouMessageTitle", { companyName: activePartner.companyName })}
                  </h3>
                  {activePartner.thankImageUrl && (
                    <Image
                      src={activePartner.thankImageUrl}
                      alt={`رسالة شكر ${activePartner.companyName}`}
                      width={400}
                      height={300}
                      className="object-contain w-full mb-4"
                    />
                  )}
                  <p className="text-gray-700 whitespace-pre-line">
                    {
                      activePartner === null &&(
                        activePartner.thankMessage || t("noThankMessage")
                      )
                   
                    }
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

export default PartnersSection;
