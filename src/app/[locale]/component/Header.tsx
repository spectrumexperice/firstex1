"use client";
import React, { useEffect, useRef, useState } from "react";
import {useLocale, useTranslations} from 'next-intl';
import { Link } from '@/i18n/navigation';

import Image from "next/image";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { motion } from "framer-motion";
import Logo2 from "@/app/assits/Logo2.png";
import SearchPage from "../search/page";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { GrLanguage } from "react-icons/gr";
import { AnimatePresence } from "framer-motion";
import { useRouter } from 'next/router';
import LanguageSwitcher from "./LanguageSwitcher";

// داخل المكون



const Header = () => {
 // "ar" أو "en"
  const t= useTranslations('header'); // ترجمة عامة أو 'Navbar'
    const locale = useLocale()   
  
  


  const [scrolled, setScrolled] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [openProductsDropdown, setOpenProductsDropdown] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
      
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(e.target as Node)) {
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

 const navLinks = [
  { id: "home", name: t('nav.home'), href: `/Home` },
  { id: "about", name: t('nav.about'), href: `/about` },
  { 
    id: "products",
    name: t('nav.products'),
    dropdown: [
      { name: t('products.speakers'), href: "/products/speakers" },
      { name: t('products.microphones'), href: "/products/microphones" },
      { name: t('products.distributors'), href: "/products/distributors" },
    ],
  },
  {
    id: 'services',
    name: t('nav.services'), 
    href: "/services"
  },
  { 
    id: 'contact',
    name: t('nav.contact'),  
    href: "/ContactForm" 
  },
];

  return (
    <header  dir={locale === 'en' ? 'ltr' : 'rtl'}
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
            {/*  {t("HomePage.subLogo.audioSolutions")} */}
          </span>

          <span className="text-sm ml-1 pt-1 text-yellow-200 dark:text-gray-200 hidden lg:block md:block">
            Audio Solutions
          </span>
        </Link>

        {/* Navigation Links (Desktop) */}
        {/* navigation */}
        <nav className="hidden md:flex space-x-6 ltr:space-x-reverse font-semibold text-gray-100 dark:text-gray-300 md:font-medium md:space-x-4 md:ml-6 gap-1 font-[cairo]">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div
                key={link.id}
                className="relative"
                ref={link.id === "products" ? productsDropdownRef : undefined}
                onMouseEnter={() =>
                  link.id === "products" && setOpenProductsDropdown(true)
                }
                onMouseLeave={() =>
                  link.id === "products" && setOpenProductsDropdown(false)
                }
              >
                <button className="flex items-center gap-1 hover:text-yellow-400 focus:outline-none ">
                  {link.name}
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
                    <motion.ul
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full bg-white shadow-lg rounded-md py-2 w-48 z-50 "
                    >
                      {link.dropdown.map((item, i) => (
                        <li key={i}>
                          <Link
                            href={item.href}
                            className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 "
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.id}
                href={link.href}
                className="hover:text-yellow-400 transition"
              >
                {link.name}
              </Link>
            )
          )}
        </nav>

        {/* Search Bar */}
        <div className=" flex items-center">
          <SearchPage />
        </div>

        {/* User Icons and Mobile Menu */}
        <div className="flex items-center space-x-4 ltr:space-x-reverse text-gray-300 dark:text-gray-300">
          {user?._id ? (
            <div className="relative" ref={menuRef}>
              <div
                onClick={() => setOpenUserMenu((preve) => !preve)}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <p className="text-white hidden lg:block">يا هلا فيك</p>
                {openUserMenu && isAdmin && <GoTriangleUp />}
                {!openUserMenu && isAdmin && <GoTriangleDown />}
                {openUserMenu && isAdmin && (
                  <div className="absolute left-0 top-13">
                    <div className="bg-white rounded-b-2xl p-4 min-w-50 lg:shadow-lg">
                      <UserMenu />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex space-x-2 ltr:space-x-reverse items-center">
              <Link
                href="/login"
                className="text-white hover:text-yellow-300 py-1 rounded md:hidden lg:block"
              >
                <FaUserCircle
                  className={`text-xl hover:text-[#b0b0b0] transition cursor-pointer ${
                    user._id ? "text-yellow-300" : ""
                  }`}
                />
              </Link>
            </div>
          )}

          {!user?._id && (
            <Link href={`/${locale}/login`} className="lg:hidden">
              <FaUserCircle
                className={`text-xl hover:text-[#b0b0b0] transition cursor-pointer ${
                  user._id ? "text-yellow-300" : ""
                }`}
              />
            </Link>
          )}

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
                {navLinks.map((link, idx) =>
                  link.dropdown ? (
                    <details key={idx} className="group" open={false}>
                      <summary className="cursor-pointer list-none flex justify-between items-center px-2 py-1 hover:text-indigo-600">
                        {link.name}
                        <svg
                          className="w-4 h-4 transition-transform group-open:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </summary>
                      <ul className="pl-4 mt-2 flex flex-col space-y-2">
                        {link.dropdown.map((item, i) => (
                          <li key={i}>
                            <Link
                              href={item.href}
                              className="block px-2 py-1 hover:text-indigo-600"
                              onClick={() => setOpenMobileMenu(false)}
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <Link
                      key={idx}
                      href={link.href}
                      className="hover:text-indigo-600"
                      onClick={() => setOpenMobileMenu(false)}
                    >
                      {link.name}
                    </Link>
                  )
                )}

                {/* أضف هنا زر تغيير اللغة في أسفل القائمة */}
                {!isAdmin && (
                  <div className=" p-1 bg-blue-500 flex items-center justify-center">
                    <LanguageSwitcher/>
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