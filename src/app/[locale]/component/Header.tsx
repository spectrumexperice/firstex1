"use client";
import React, { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import fetchUserDetails from "@/app/utilities/fetchUserDetails";
import Image from "next/image";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Logo2 from "@/app/assits/Logo2.png";
import SearchPage from "../search/page";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "@/app/UserMenu/UserMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import SummaryApi from "@/app/common/summaryApi";
import Axios from "@/app/utilities/axios";
import { setUserDetails } from "@/app/store/userSlice";

// ===== Types خاصة بالتصنيفات =====
interface Product {
  _id: string;
  name: Record<string,string>;
  slug: string;
}
interface SubCategory {
  name: Record<string,string>;
  slug: string;
  products: Product[];
}

interface Category {
  name: Record<string,string>;
   slug: string;
  subCategories: SubCategory[];
}

const ProductsDropdown = ({ categories }: { categories: Category[] }) => {
  const locale = useLocale();
  const t = useTranslations("header");
 
  return (
    <ul className="relative space-y-1">
      <li role="none">
        <Link
          href="/ProductsPage"
          className="block px-4 py-2 bg-gray-100 hover:bg-amber-50 text-gray-800 rounded-lg"
          role="menuitem"
        >
         {t("nav.AllProducts")}
        </Link>
      </li>
      {
      categories.map((cat) => (
        <li key={cat.slug} className="relative group" role="none">
          {/* Category Item */}
          <Link  href={ `/category/${cat.slug}`}
            className="flex items-center justify-between px-4 py-2 bg-white hover:bg-amber-50 cursor-pointer transition-colors duration-200 rounded-lg border border-gray-100"
            role="menuitem"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span className="font-medium text-gray-800">
              {cat.name?.[locale] || cat.name?.ar || cat.name?.en || ""}
</span>

            {
            cat.subCategories?.length > 0 && (
              <svg
                className={`w-4 h-4 text-gray-500 transform transition-transform ${
                  locale === "en" ? "rotate-0" : "rotate-180"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </Link>

          {/* Subcategories Dropdown */}
          {
          cat.subCategories?.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-0 ${
                locale === "en" ? "left-full ml-1" : "right-full mr-1"
              } hidden group-hover:block min-w-[250px] bg-white shadow-xl p-2 border border-gray-200 z-50`}
              role="menu"
            >
              {cat.subCategories.map((sub) => (
                <li key={sub.slug} className="relative group/sub" role="none">
                  {/* Subcategory Item */}
                  <Link href={ `/subcategory/${sub.slug}`}  className="flex items-center justify-between px-3 py-2 hover:bg-amber-100 cursor-pointer transition-colors duration-200 rounded-md">
                    <span className="text-gray-700">
                      {sub.name?.[locale] || sub.name?.ar || sub.name?.en || ""}
</span>

                    {
                    sub.products?.length > 0 && (
                      <svg
                        className={`w-4 h-4 text-gray-400 transform transition-transform ${
                          locale === "en" ? "rotate-0" : "rotate-180"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </Link>

                  {/* Products Dropdown */}
                  {
                  sub.products?.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, x: locale === "en" ? -10 : 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: locale === "en" ? -10 : 10 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute top-0 ${
                        locale === "en" ? "left-full ml-1" : "right-full mr-1"
                      } hidden group-hover/sub:block min-w-[220px] bg-gray-50 shadow-lg  p-2 border border-gray-200 z-50`}
                      role="menu"
                    >
                      {
                      sub.products.map((prod) => (
                        <li key={prod._id} role="none">
                          <Link
                            href={ `/ProductDetails/${prod.slug}`}
                            className="block px-3 py-2 text-gray-600 hover:bg-amber-200 hover:text-gray-900 transition-colors duration-200 rounded-md"
                            role="menuitem"
                          >
                            {prod.name?.[locale] || prod.name?.ar || prod.name?.en || ""}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </li>
              ))}
            </motion.ul>
          )}
        </li>
      ))}
    </ul>
  );
};

const Header = () => {
  // "ar" أو "en"
  const t = useTranslations("header");
  const locale = useLocale();

  const [loading, setLoading] = useState(true);

  // ===== الحالة الخاصة بالتصنيفات (موحّدة وبهيكل هرمي) =====
  const [categories, setCategories] = useState<Category[]>([]);

  const [scrolled, setScrolled] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [openProductsDropdown, setOpenProductsDropdown] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const isAdmin = user?.role === "ADMIN";

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setOpenUserMenu(false);
      }
      if (
        productsDropdownRef.current &&
        !productsDropdownRef.current.contains(e.target as Node)
      ) {
        setOpenProductsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpenMobileMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user (بدون تغيير)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user?._id) {
          const userData = await fetchUserDetails();
          if (userData) {
            dispatch(setUserDetails(userData));
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [dispatch, user?._id]);

  // ===== جلب التصنيفات بهيكل هرمي من getGroup فقط =====
useEffect(() => {
  const fetchData = async () => {
    try {
      const { data } = await Axios(SummaryApi.Product.getGroup);
      // الباك يرجع بالهيكل النهائي جاهز:
      const categoriesArray: Category[] = (data?.data || []).map((cat: any) => ({
          slug: cat.slug,
        name: { ar: cat?.name?.ar || "", en: cat?.name?.en || cat?.name?.ar || "" },
        subCategories: (cat?.subCategories || []).map((sub: any) => ({
          name: { ar: sub?.name?.ar || "", en: sub?.name?.en || sub?.name?.ar || "" },
          slug: sub.slug,
          products: (sub?.products || []).map((p: any) => ({
            _id: p._id,
            slug: p.slug,
            name: { ar: p?.name?.ar || "", en: p?.name?.en || p?.name?.ar || "" },
          })),
        })),
      }));

      setCategories(categoriesArray);
    } catch (error) {
      console.error("Failed to fetch grouped products:", error);
    }
  };
  fetchData();
}, []);

  // ================================================

  // navLinks: فقط نحتاج وجود dropdown = true
  const navLinks = [
    { id: "home", name: t("nav.home"), href: `/Home` },
    { id: "about", name: t("nav.about"), href: `/about` },
    { id: "services", name: t("nav.services"), href: "/services" },
    {
      id: "products",
      name: t("nav.products"),
     
      dropdown: true, // وجوده يكفي لإظهار الـ ProductsDropdown
    },
    { id: "contact", name: t("nav.contact"), href: "/ContactForm" },
  ];

  return (
    <header
      dir={locale === "en" ? "ltr" : "rtl"}
      className={`fixed top-4 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#6b252f] shadow-md" : "bg-[#6b252f] shadow-md"
      } font-arabic`}
    >
      <div className="container mx-auto flex items-center justify-between h-20 px-4 lg:px-8">
        {/* Logo */}
        <Link
          href="/Home"
          className="flex flex-col items-center ltr:space-x-reverse cursor-pointer pr-3"
        >
          <Image
            src={Logo2}
            alt="شعار الشركة"
            width={140}
            height={70}
            className="object-contain hidden lg:block"
          />
          <Image
            src={Logo2}
            alt="شعار الشركة"
            width={110}
            height={70}
            className="object-contain lg:hidden"
          />
          <span className="text-sm ml-1 pt-1 text-yellow-200 dark:text-gray-200 hidden lg:block md:block">
            {t("nav.subLogo")}
          </span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex space-x-6 ltr:space-x-reverse font-semibold text-gray-100 dark:text-gray-300 md:font-medium md:space-x-4 md:ml-6 gap-1 font-[cairo]">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div
                key={link.id}
                className="relative"
                onMouseEnter={() => setOpenProductsDropdown(true)}
                onMouseLeave={() => setOpenProductsDropdown(false)}
                ref={productsDropdownRef}
              >
                <button className="flex items-center gap-1 hover:text-yellow-400" >
                  {t("nav.products")}
                  <svg
                    className="w-4 h-4 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>

                <AnimatePresence>
                  {openProductsDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 top-full bg-white shadow-lg p-4 min-w-[200px] z-50 text-[#6b252f]"
                    >
                      <ProductsDropdown categories={categories} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.id}
                 href={{ pathname: link.href }}
                className="hover:text-yellow-400 transition"
              >
                {link.name}
              </Link>
            )
          )}
        </nav>

        {/* Search Bar */}
       {/*  <div className=" flex items-center">
          <SearchPage />
        </div>
 */}
        {/* User Icons and Mobile Menu */}
        <div className="flex items-center space-x-4 ltr:space-x-reverse text-gray-300 dark:text-gray-300">
          {/* User menu (كما هو) */}
          <div className="relative" ref={menuRef}>
            {user?._id && (
              <>
                <div
                  onClick={() => isAdmin && setOpenUserMenu((prev) => !prev)}
                  className={`flex items-center gap-2 ${
                    isAdmin ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <p className="text-white hidden lg:block">{t("nav.welcome")}</p>
                  {isAdmin &&
                    (openUserMenu ? <GoTriangleUp /> : <GoTriangleDown />)}
                </div>

                {isAdmin && (
                  <AnimatePresence>
                    {openUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 top-full mt-2"
                      >
                        <div className="bg-white rounded-lg p-4 min-w-50 shadow-lg">
                          <UserMenu />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </>
            )}

            {!user?._id && (
              <Link href={`/login`}>
                <FaUserCircle
                  className={`text-xl hover:text-[#b0b0b0] transition cursor-pointer ${
                    user._id ? "text-yellow-300" : ""
                  }`}
                />
              </Link>
            )}
          </div>

          {!isAdmin && (
            <div className="hidden md:flex items-center space-x-6 ltr:space-x-reverse text-yellow-400">
              <LanguageSwitcher />
            </div>
          )}

        


          {/* Mobile Menu Hamburger */}
          <Sheet open={openMobileMenu} onOpenChange={setOpenMobileMenu}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="md:hidden text-yellow-400 text-2xl ml-2"
              >
                <FaBars />
              </button>
            </SheetTrigger>

            <SheetContent side="left" className="w-64 p-6">
              <nav className="flex flex-col space-y-4 font-semibold text-gray-700">
                {navLinks.map((link, idx) => {
                  if (link.dropdown) {
                    return (
                      <details key={idx} className="group" open={false}>
                        <summary className="cursor-pointer list-none flex justify-between items-center px-2 py-1 hover:text-indigo-600">
                          {link.name}
                          <svg
                            className="w-4 h-4 transition-transform group-open:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </summary>

                        {/* نفس هيكل الدروب داون: Category -> Sub -> Products */}
                        <ul className="pl-4 mt-2 flex flex-col space-y-2">
                          <li>
                            <Link
                              href="/ProductsPage"
                              className="block px-2 py-1 bg-gray-100 hover:bg-yellow-200 rounded"
                              onClick={() => setOpenMobileMenu(false)}
                            >
                              {t("nav.AllProducts")}
                            </Link>
                          </li>
                          {categories.map((cat) => (
                            <details key={cat.name[locale]} className="group" open={false}>
                              <summary className="cursor-pointer px-2 py-1 bg-gray-100 hover:bg-yellow-200 rounded">
                             {cat.name?.[locale] || cat.name?.ar || cat.name?.en || ""}
                              </summary>

                              <ul className="pl-4 mt-1 flex flex-col space-y-1">
                                {cat.subCategories?.map((sub) => (
                                  <details key={sub.name[locale]} className="group" open={false}>
                                    <summary className="cursor-pointer px-2 py-1 bg-gray-50 hover:bg-yellow-100 rounded">
                                    {sub.name?.[locale] || sub.name?.ar || sub.name?.en || ""}
                                    </summary>

                                    <ul className="pl-4 mt-1 flex flex-col space-y-1">
                                      {sub.products?.map((prod) => (
                                        <li key={prod._id}>
                                          <Link
                                           href={ `/ProductDetails/${prod.slug}`}
                                            className="block px-2 py-1 hover:bg-yellow-100 rounded"
                                            onClick={() => setOpenMobileMenu(false)}
                                          >
                                         {prod.name?.[locale] || prod.name?.ar || prod.name?.en || ""}
                                         
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </details>
                                ))}
                              </ul>
                            </details>
                          ))}
                        </ul>
                      </details>
                    );
                  }

                  return (
                    <Link
                      key={idx}
                      href={{ pathname: link.href }}
                      className="hover:text-indigo-600"
                      onClick={() => setOpenMobileMenu(false)}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                {/* زر تغيير اللغة */}
                {!isAdmin && (
                  <div className="p-1 bg-blue-500 flex items-center justify-center mt-4 rounded">
                    <LanguageSwitcher />
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
