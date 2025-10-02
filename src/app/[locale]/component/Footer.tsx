"use client";

import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import ScrollToTopButton from "../../ScrollToTopButton";
import CallButton from "@/app/CallButton";
import WhatsAppButton from "@/app/WhatsAppButton";
import { useLocale, useTranslations } from "next-intl";
import NewsletterForm from "./NewsletterForm";

const Footer = () => {
  const t = useTranslations("footer");
  const locale = useLocale() 
  return (
    <>
      <footer
        className="bg-[#6b252f] text-white py-12 px-6 font-arabic"
        dir={locale === "en" ? "ltr" : "rtl"}
      >
        <div
          dir={locale === "en" ? "ltr" : "rtl"}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {/* قسم نبذة عن الشركة */}
          <div>
            <h3
              dir={locale === "en" ? "ltr" : "rtl"}
              className="text-xl font-semibold mb-4"
            >
              {t("aboutCompanyTitle")}
            </h3>
            <p
              dir={locale === "en" ? "ltr" : "rtl"}
              className="text-gray-300 leading-relaxed text-sm"
            >
              {t("aboutCompanyDescription")}
            </p>
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {t("quickLinksTitle")}
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link
                  href={`/${locale}/Home`}
                  className="hover:text-yellow-400 transition"
                >
                  {t("links.home")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="hover:text-yellow-400 transition"
                >
                  {t("links.about")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/services`}
                  className="hover:text-yellow-400 transition"
                >
                  {t("links.services")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/Contactform`}
                  className="hover:text-yellow-400 transition"
                >
                  {t("links.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* تواصل معنا */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {t("contactUsTitle")}
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-center gap-2">
                <FaPhoneAlt />{" "}
                <span dir={locale === "en" ? "ltr" : "rtl"}>
                  {t("contactDetails.phone1")}
                </span>
                <FaPhoneAlt />{" "}
                <span dir={locale === "en" ? "ltr" : "rtl"}>
                  {t("contactDetails.phone2")}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope />{" "}
                <span dir={locale === "en" ? "ltr" : "rtl"}>
                  {t("contactDetails.email1")}
                </span>
                <FaEnvelope />{" "}
                <span dir={locale === "en" ? "ltr" : "rtl"}>
                  {t("contactDetails.email2")}
                </span>
              </li>
            </ul>
            <div
              dir={locale === "en" ? "ltr" : "rtl"}
              className="flex space-x-4 space-x-reverse mt-4"
            >
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-yellow-400 transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-yellow-400 transition"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-yellow-400 transition"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="hover:text-yellow-400 transition "
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

         {/*  <div>
            <h3 className="text-xl font-semibold mb-4">
              {t("newsletterTitle")}
            </h3>
            <p
              dir={locale === "en" ? "ltr" : "rtl"}
              className="text-gray-300 mb-4 text-sm"
            >
              {t("newsletterDescription")}
            </p>
            <NewsletterForm />
          </div> */}
        </div>

        <div
          dir={locale === "en" ? "ltr" : "rtl"}
          className="text-center mt-10 text-gray-400 text-xs "
        >
        {t("copyright")}   &copy; {new Date().getFullYear()} 
        </div>
      </footer>
      <div className=" fixed bottom-6 left-6 z-50 flex flex-col gap-2 ">
        <ScrollToTopButton />
        <CallButton />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Footer;
