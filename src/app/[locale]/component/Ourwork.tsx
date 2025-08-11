"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useKeenSlider, KeenSliderPlugin } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useTranslations } from "next-intl";

import work1 from "@/app/assits/w1-1.png";
import work2 from "@/app/assits/w2.png";
import work3 from "@/app/assits/w3.jpg";
import work4 from "@/app/assits/w4.jpg";
import work5 from "@/app/assits/w5.jpg";
import work6 from "@/app/assits/w6.jpg";
import work7 from "@/app/assits/w7.jpg";
import work8 from "@/app/assits/w8.jpg";
import work9 from "@/app/assits/w9.png";
import work10 from "@/app/assits/w10.png";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";
const works = [
  work1,
  work2,
  work3,
  work4,
  work5,
  work6,
  work7,
  work8,
  work9,
  work10,
];

const Ourwork = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = useTranslations("OurWork");

  const DotPlugin: KeenSliderPlugin = (slider) => {
    const update = () => {
      setCurrentSlide(slider.track.details.rel);
    };

    slider.on("created", update);
    slider.on("slideChanged", update);
  };
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [refCallback, slider] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      mode: "free-snap",
      renderMode: "performance",
      slides: {
        perView: 3,
        spacing: 20,
      },

      breakpoints: {
        "(max-width: 768px)": {
          slides: { perView: 1, spacing: 10 },
        },
        "(min-width: 769px) and (max-width: 1024px)": {
          slides: { perView: 2, spacing: 15 },
        },
      },
      created: (instance) => {
        intervalRef.current = setInterval(() => {
          instance.next();
        }, 2500);
      },
    },
    [DotPlugin]
  );

  // تنظيف الـ interval عند إزالة الكومبوننت
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section
      className="py-16 px-4 lg:px-20 sm:px-10 bg-gray-50"
      aria-labelledby="our-work-title"
      dir="rtl"
    >
      <motion.h2
        id="our-work-title"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-[Cairo] font-extrabold mb-12 text-[#6b252f] text-center"
      >
        {t("title")}
      </motion.h2>

      <div className="relative">
        <motion.div
          ref={refCallback}
          className="keen-slider"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {works.map((image, index) => (
            <div
              key={index}
              className="keen-slider__slide rounded-2xl overflow-hidden shadow-md"
            >
              <div className="w-full h-72 overflow-hidden group">
                <Image
                  src={image}
                  alt={`صورة عمل رقم ${index + 1}`}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-100"
                />
              </div>
            </div>
          ))}
          {/* أسهم التنقل على الجوانب داخل relative container */}
          <button
            onClick={() => slider?.current?.next()}
            className="absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-[#6b252f]  hover:bg-bg-[#9f8e8e] text-white p-3 rounded-full ml-2"
          >
            <IoIosArrowDropleftCircle />
          </button>
          <button
            onClick={() => slider?.current?.prev()}
            className="absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-[#6b252f] hover:bg-bg-[#9f8e8e] text-white p-3 rounded-full mr-2"
          >
            <IoIosArrowDroprightCircle />
          </button>
        </motion.div>
      </div>

      {/**------------------------------ */}

      <div className="flex justify-center mt-6 space-x-2">
        {works.map((_, idx) => (
          <button
            key={idx}
            onClick={() => slider?.current?.moveToIdx(idx)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === idx ? "bg-[#6b252f]" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Ourwork;
