"use client";
import { useEffect, useRef, useState } from "react";
import { setWorksDetails } from "@/app/store/workSlice";
import fetchworksDetails from "@/app/utilities/fetchWorksDetails";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCube, Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
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
const slider = useRef<SwiperType | null>(null);
  const t = useTranslations("OurWork");
  const [currentSlide, setCurrentSlide] = useState(0);
  const { works, loading } = useSelector((state: RootState) => state.works) as {
    works: Work[];
    loading: boolean;
  };
  const isRTL = locale !== "en";
  const dispatch = useDispatch();
/*   const [sliderRef, slider] = useKeenSlider(
    {
      loop: true,
      rtl: isRTL,
      defaultAnimation: {
        duration: 400,
        easing: (t: number) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      },
      renderMode: "performance",
      slides: { perView: 1, spacing: 20 }, // مبدئياً شريحة واحدة ونصف
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
        let timeout: ReturnType<typeof setTimeout>;
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
    ],
  ); */
  useEffect(() => {
    async function fetchWorks() {
      try {
        dispatch(setWorksDetails({ loading: true }));
        const response = await fetchworksDetails();
        dispatch(setWorksDetails({ works: response.data, loading: false }));
      } catch (error) {
        dispatch(setWorksDetails({ error: "فشل تحميل العمل", loading: false }));
      }
    }
    fetchWorks();
  }, [dispatch]); // ⚠️ أضف dispatch كمصفوفة تبعيات

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % works.length);
  }, 2500);

  return () => clearInterval(interval);
}, [works.length]);
  return (
    
    
  <section className=" mt-10 mb-20 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 " dir={isRTL ? "rtl" : "ltr"}>
      
      <noscript>
       

             <h2 className="text-3xl md:text-4xl font-bold text-[#6b252f]  font-[Cairo]">
             {t("title")}
           </h2>

         
      
        <p>
          اكتشف أعمال سبكتروم في مجال الصوتيات — مشاريع احترافية وابتكار مستمر.
        </p>
      </noscript>
       <div className="mb-8 flex items-center justify-center gap-6">
           <span className="h-px flex-1 max-w-[140px] bg-[#6b252f]"></span>
          <motion.h2
        className="text-4xl font-[Cairo] font-extrabold text-[#6b252f] text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {t("title")}
      </motion.h2>
          <span className="h-px flex-1 max-w-[140px] bg-[#6b252f]"></span>
       </div>
     
     

      {loading ? (
        <div className="text-center text-gray-500">جاري التحميل...</div>
      ) : works.length === 0 ? (
        <div className="text-center text-gray-500">لا توجد أعمال متاحة</div>
      ) : (
        <>
          <div className="hidden lg:block relative max-w-6xl mx-auto ">

  <div className="flex items-center justify-center gap-4">

    {works.map((work, index) => {
      const offset = index - currentSlide;

      // نخلي فقط 3 عناصر حول المركز
      if (Math.abs(offset) > 4) return null;

      const isCenter = offset === 0;

      return (
        <div
          key={work._id}
          className="transition-all duration-500 ease-out flex-shrink-0"
          style={{
            transform: isCenter
              ? "scale(1.15)"
              : `scale(${0.9 - Math.abs(offset) * 0.05})`,

            opacity: isCenter ? 1 : 0.4,
            filter: isCenter ? "blur(0px)" : "blur(2px)",
            zIndex: isCenter ? 10 : 5 - Math.abs(offset),
          }}
        >
          <div className="w-[320px] h-[420px] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={work.imageUrl}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      );
    })}

  </div>
  
</div>


{/**sm-md section */}
<div className="block lg:hidden relative max-w-xl mx-auto">

  <Swiper
    modules={[Navigation, Autoplay]}
    slidesPerView={1.2}
    centeredSlides={true}
    spaceBetween={16}
    loop={true}
    autoplay={{
      delay: 2500,
      disableOnInteraction: false,
    }}
    onSwiper={(swiper) => (slider.current = swiper)}
  >
    {works.map((work) => (
      <SwiperSlide key={work._id}>
        <div className="w-full h-[300px] bg-black rounded-2xl overflow-hidden">
          <img
            src={work.imageUrl}
            className="w-full h-full object-cover block"
            alt="work"
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>

  {/* زر السابق */}
  <button
    onClick={() => slider?.current?.slidePrev()}
    className="absolute top-1/2 left-2 -translate-y-1/2 z-10
    text-white p-2 rounded-full
    bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
  >
    <IoIosArrowDropleftCircle size={28} />
  </button>

  {/* زر التالي */}
  <button
    onClick={() => slider?.current?.slideNext()}
    className="absolute top-1/2 right-2 -translate-y-1/2 z-10
    text-white p-2 rounded-full
    bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
  >
    <IoIosArrowDroprightCircle size={28} />
  </button>

</div>
        </>
      )}
    </section>
  );
}
