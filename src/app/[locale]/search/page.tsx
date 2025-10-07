"use client";

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import {useTranslations} from 'next-intl';
import Head from "next/head";
const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا تضيف منطق البحث عند الضغط على زر البحث أو Enter
    
  };
   const t= useTranslations('search');
  return (
    <>
      <Head>
        <title>سبكتروم | ابحث الان عن العزل الصوتي</title>
        <meta name="description" content="ابحث عن منتجات العزل الصوتي والخدمات التي نقدمها   " />
        <meta name="keywords" content="سبكتروم, ابحث عن الحلول الصوتيه" />
        <meta name="robots" content="index, follow" />
      </Head>
      <form
        onSubmit={handleSubmit}
        className=" items-center bg-white bg-opacity-20 backdrop-blur-md rounded-full px-4 py-2 max-w-md w-full shadow-md hidden lg:block"
      >
        <input
          type="text"
          placeholder={t("box")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow bg-transparent text-black placeholder-black focus:outline-none px-2 py-1 text-sm"
          aria-label="Search"
        />
        <button
          type="submit"
          className=" bg-yellow-400 hover:bg-yellow-500 transition rounded-full p-2 text-white shadow-md"
          aria-label="Search button"
        >
          <FaSearch />
        </button>
      </form>
    </>
  );
};

export default SearchBar;
