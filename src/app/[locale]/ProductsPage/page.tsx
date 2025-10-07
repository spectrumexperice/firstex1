"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Axios from "../../utilities/axios";
import SummaryApi from "../../common/summaryApi";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation"; 
import Image from "next/image";
import Head from "next/head";

interface Product {
  _id: string;
  name: { ar: string; en: string };
  slug: string;
  category: { ar: string; en: string };
  subCategory: { ar: string; en: string };
  shortDescription?: { ar: string; en: string };
  images: { url: string; isMain: boolean }[];
}
interface Category {
  _id: string;
  name: { ar: string; en: string };
}

export default function AdvancedProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const t = useTranslations("ProductsPage");
 const locale = useLocale() as 'en' | 'ar';

 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await Axios(SummaryApi.Product.getcategory);
        if (data.success) setCategories(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  // --- Fetch SubCategories ---
 // --- Fetch SubCategories ---
useEffect(() => {
  const fetchSubCategories = async () => {
    try {
      if (!activeCategory) return; // نتأكد من وجود parentId
      const { data } = await Axios({
        ...SummaryApi.Product.subcategory,
        params: { parentId: activeCategory },
      });
      if (data.success) setSubCategories(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchSubCategories();
}, [activeCategory]);



  // --- Fetch Products (Filtered & Search & Pagination) ---
  useEffect(() => {
    const fetchProducts = async () => {
  setLoading(true);
  try {
    let data;
    const params: any = { page };
    if (activeCategory) params.category = activeCategory;
    if (activeSubCategory) params.subCategory = activeSubCategory;

    if (search) {
      // استدعاء البحث
      const res = await Axios({
        ...SummaryApi.Product.search,
        params: { ...params, q: search }
      });
      data = res.data;
    } else {
      // استدعاء كل المنتجات
      const res = await Axios({
        ...SummaryApi.Product.getAll,
        params
      });
      data = res.data;
    }

    if (data.success) {
      setProducts(data.data);
      setTotalPages(data.totalPages || 1);
    }
  } finally {
    setLoading(false);
  }
};

    fetchProducts();
  }, [activeCategory, activeSubCategory, search, page]);
  
  return (
    <>
        <Head>
        <title>منتجاتنا | Spectrum</title>
        <meta name="description" content="تصفح أحدث المنتجات المتوفرة لدينا." />
        <meta name="keywords" content="منتجات عوازل صوتيه" />
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="p-6 mt-25" dir={locale === "en" ? "ltr" : "rtl"}>
       <noscript>
          <div>
            <h1>{t("title")}</h1>
           
          </div>
        </noscript>
        <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

        {/* --- Search --- */}
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* --- Categories Slider --- */}
        <div className="flex space-x-3 overflow-x-auto mb-4 py-2">
          <button
            onClick={() => {
              setActiveCategory(null);
              setActiveSubCategory(null);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg border ${
              !activeCategory ? "bg-blue-500 text-white" : ""
            }`}
          >
            {t("title")}
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                setActiveCategory(cat._id);
                setActiveSubCategory(null);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg border ${
                activeCategory === cat._id ? "bg-blue-500 text-white" : ""
              }`}
            >
              {cat.name[locale]}
            </button>
          ))}
        </div>

        {/* --- SubCategories Slider --- */}
        {activeCategory && (
          <div className="flex space-x-3 overflow-x-auto mb-6 py-2">
            {/* <button
            onClick={() => {
              setActiveSubCategory(null);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg border ${
              !activeSubCategory ? "bg-blue-400 text-white" : ""
            }`}
          >
            {t("allSub")}
          </button> */}

            {subCategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => {
                  setActiveSubCategory(sub._id);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg border ${
                  activeSubCategory === sub._id ? "bg-blue-500 text-white" : ""
                }`}
              >
                {sub.name[locale]}
              </button>
            ))}
          </div>
        )}

        {/* --- Products Grid --- */}
        {loading ? (
          <p>{t("loading")}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <Link key={prod._id} href={`/ProductDetails/${prod.slug}`}>
                <div className="border rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                  <div className="relative w-full h-40 rounded-t-lg overflow-hidden">
                    <Image
                      src={
                        prod.images?.find((i) => i.isMain)?.url ||
                        "/placeholder.png"
                      }
                      alt={
                        typeof prod.name === "string"
                          ? prod.name
                          : prod.name[locale]
                      }
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h2 className="font-semibold">
                      {typeof prod.name === "string"
                        ? prod.name
                        : prod.name[locale]}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {typeof prod.shortDescription === "string"
                        ? prod.shortDescription
                        : prod.shortDescription?.[locale]}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* --- Pagination --- */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded-lg border ${
                  page === p ? "bg-blue-500 text-white" : ""
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
