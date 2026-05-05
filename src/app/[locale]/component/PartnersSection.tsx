"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import { useState, useEffect } from "react";
import Head from "next/head";

interface Partner {
  _id: string;
  companyName: string;
  logoUrl: string;
  publicId: string;
  thankImageUrl?: string | null;
  thankMessage?: string | null;
}

const PartnersSection = () => {
  const partners: Partner[] = useSelector(
    (state: RootState) => state.partner.partners || [],
  );

  const loading = useSelector((state: RootState) => state.partner.loading);
  const t = useTranslations("OurPartner");

  // ✅ autoplay plugin
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slides: {
        perView: 5,
        spacing: 10,
      },
     slideChanged(slider) {
  const slides = slider.slides;

  slides.forEach((slide) => {
    slide.classList.remove("scale-110");
  });

  const activeIndex = slider.track.details.abs;
  const slide = slider.slides[activeIndex % slides.length];

  slide?.classList.add("scale-110");
},
      breakpoints: {
        "(max-width: 1024px)": {
          slides: { perView: 3, spacing: 12 },
        },
        "(max-width: 640px)": {
          slides: { perView: 2, spacing: 10 },
        },
      },
    },
    [
      (slider) => {
        let timeout: any;

        const clearNextTimeout = () => {
          clearTimeout(timeout);
        };

        const nextTimeout = () => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            slider.next();
          }, 2500); // سرعة الحركة
        };

        slider.on("created", () => {
          nextTimeout();
        });

        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
        slider.on("mouseover", () => clearTimeout(timeout));
        slider.on("mouseout", nextTimeout);
      },
    ],
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [activePartner, setActivePartner] = useState<Partner | null>(null);

  const openModal = (partner: Partner) => {
    setActivePartner(partner);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActivePartner(null);
  };

  return (
    <>
      <Head>
        <title>سبكتروم | {t("title")}</title>
      </Head>

      <section className="px-4 mt-12 lg:px-20 mb-8" dir="rtl">
        {loading ? (
          <p className="text-center text-gray-600">{t("loadingPartners")}</p>
        ) : (
          <div className="relative">
            {/* Gradient edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* Slider */}
            <div ref={sliderRef} className="keen-slider">
              {partners.map((partner) => (
                <div
                  key={partner._id}
                  className="keen-slider__slide flex justify-center"
                >
                  <div
                    onClick={() => openModal(partner)}
                    className="
                    w-full
                    h-24 sm:h-28 md:h-32
                    flex items-center justify-center
                    bg-white border border-gray-200 rounded-xl
                    transition-all duration-300
                    hover:scale-105 hover:shadow-lg
                    cursor-pointer
                  "
                  >
                    <Image
                      src={partner.logoUrl}
                      alt={partner.companyName}
                      width={120}
                      height={120}
                      className="object-contain max-h-full max-w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default PartnersSection;
