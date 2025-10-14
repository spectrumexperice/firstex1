"use client";
import { useEffect, useState } from "react";
import { setWorksDetails } from "@/app/store/workSlice";
import fetchworksDetails from "@/app/utilities/fetchWorksDetails";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
export interface Work {
  _id: string;
  imageUrl: string;
  publicId: string;

}
export default function OurWorkSection() {
    const locale = useLocale();

  const t = useTranslations("OurWork");
    const [currentSlide, setCurrentSlide] = useState(0);
     const { works, loading } = useSelector((state: RootState) => state.works) as {
      works: Work[];
      loading: boolean;
    };
      const isRTL = locale !== "en";
       const dispatch=useDispatch()
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    rtl:isRTL,
    defaultAnimation:{
        duration:400,
       easing: (t: number) => (t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2)
    },
    renderMode:"performance",
    slides: { perView: 1, spacing: 16 }, // مبدئياً شريحة واحدة ونصف
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2, spacing: 20 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 24 },
      },
      "(min-width: 1440px)": {
        slides: { perView: 4, spacing: 24 },
      },
    },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  },
    [
    // Autoplay plugin
    (slider) => {
      let timeout : ReturnType<typeof setTimeout>;
      let mouseOver = false;
      function clearNextTimeout() {
        clearTimeout(timeout);
      }
      function nextTimeout() {
        clearTimeout(timeout);
        if (mouseOver) return;
        timeout = setTimeout(() => slider.next(), 2000); // كل ثانيتين
      }
      slider.on("created", () => {
        slider.container.addEventListener("mouseover", () => {
          mouseOver = true;
          clearNextTimeout();
        });
        slider.container.addEventListener("mouseout", () => {
          mouseOver = false;
          nextTimeout();
        });
        nextTimeout();
      });
      slider.on("dragStarted", clearNextTimeout);
      slider.on("animationEnded", nextTimeout);
      slider.on("updated", nextTimeout);
    },
  ]
);
 useEffect(() => {
  async function fetchWorks() {
    try {
      dispatch(setWorksDetails({ loading: true }));
      const response = await fetchworksDetails();
      dispatch(setWorksDetails({ works: response.data, loading: false }));
    } catch (error) {
      dispatch(setWorksDetails({ error: 'فشل تحميل العمل', loading: false }));
    }
  }
  fetchWorks();
}, [dispatch]); // ⚠️ أضف dispatch كمصفوفة تبعيات
    return(
         <section className="py-16 px-4 bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
        <noscript>
          <h1>{t("title")}</h1>
          <p>
            اكتشف أعمال سبكتروم في مجال الصوتيات — مشاريع احترافية وابتكار
            مستمر.
          </p>
        </noscript>
        <motion.h2
          className="text-4xl font-[Cairo] font-extrabold mb-8 text-[#6b252f] text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t("title")}
        </motion.h2>

        {loading ? (
          <div className="text-center text-gray-500">جاري التحميل...</div>
        ) : works.length === 0 ? (
          <div className="text-center text-gray-500">لا توجد أعمال متاحة</div>
        ) : (
          <div className="relative">
            <div ref={sliderRef} className="keen-slider">
              {works.map((work, index) => (
                <div key={work._id} className="keen-slider__slide">
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl shadow-md group ">
                    <Image
                      src={work.imageUrl}
                      alt={`عمل ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="100vw"
                      priority={index < 2}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Arrows */}
            <button
              onClick={() => slider?.current?.prev()}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-[#6b252f] text-white p-2 rounded-full"
            >
              <IoIosArrowDroprightCircle size={24} />
            </button>
            <button
              onClick={() => slider?.current?.next()}
              className="  absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-[#6b252f] text-white p-2 rounded-full"
            >
              <IoIosArrowDropleftCircle size={24} />
            </button>

            {/* Dots */}
            <div className="flex justify-center mt-7 gap-2">
              {works.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full cursor-pointer ${
                    currentSlide === idx ? "bg-[#6b252f]" : "bg-gray-300"
                  }`}
                  onClick={() => slider?.current?.moveToIdx(idx)}
                ></div>
              ))}
            </div>
          </div>
        )}
      </section>
    )
}