"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import SummaryApi from "@/app/common/summaryApi";
import Axios from "@/app/utilities/axios";
import Image from "next/image";
import Head from "next/head";
interface Category {
  _id: string;
  name: { ar: string; en: string };
  slug: string;
  parent?: string | null;
}

interface Product {
  _id: string;
  name: { ar: string; en: string };
  slug: string;
  category: Category;
  subCategory?: Category;
  images?: { url: string; isMain?: boolean }[];
  shortDescription?: { ar?: string; en?: string };
}

export default function CategoryPage() {
  const params = useParams();
  
  const rawCategory = Array.isArray(params.category) ? params.category[0] : params.category || "";
const { slug } = useParams();


  const [categoryMap, setCategoryMap] = useState<{ [key: string]: Category }>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
// تأكد أن slugParam دائمًا string
const slugParam = Array.isArray(slug) ? slug[0] : slug ?? "";

// استخدمه بدل slug مباشرة
const categoryName = categoryMap?.[slugParam]?.name?.ar || slugParam || "الفئات";

 
  // جلب الفئات وبناء الخريطة
  useEffect(() => {
    let mounted = true;
    const fetchAllCategories = async () => {
      try {
        const response = await Axios({ ...SummaryApi.Product.getcategory });
      /*   console.log("Categories response:", response); */
        const categories: Category[] = response?.data?.data || response?.data || [];
        const map: { [key: string]: Category } = {};
        categories.forEach((cat) => {
          // تأكد أن هناك slug، وإلا استخدم _id كـ key احتياطياً
          const key = (cat.slug && String(cat.slug)) || String(cat._id);
          map[key] = cat;
        });
        if (!mounted) return;
        setCategoryMap(map);
      } catch (err) {
        console.error("خطأ في جلب الفئات:", err);
        setStatusMessage("فشل في جلب الفئات");
      }
    };
    fetchAllCategories();
    return () => { mounted = false; };
  }, []);

  // جلب المنتجات عندما تتوفر الفئات أو عندما يتغير الـ slug في الـ URL
  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      // إذا ما في slug، ما نطلب شيء
      if (!slugParam) {
        setProducts([]);
        return;
      }

      // نتحقق إذا نملك record للفئة
      const catRecord = categoryMap[slugParam];
      // لو عندنا record، استخدم _id لطلب أفضل، وإلا أرسل slug كما هو (backend يدعم _id أو slug)
      const categoryParam = catRecord ? catRecord._id : slugParam;

      
     
      setLoading(true);
      setStatusMessage(null);
      try {
        /* console.log("Before Axios call"); */
        const response = await Axios({
          ...SummaryApi.Product.getAll,
          params: categoryParam ? { category: categoryParam } : {},
        });
          /* console.log("Before Axios call"); */

      
        // قد يعود المنتج ضمن response.data.data أو response.data
        const productsData: Product[] = response?.data?.data || response?.data || [];
     

        if (!mounted) return;
        setProducts(productsData);
        if (productsData.length === 0) {
          setStatusMessage("لا توجد منتجات في هذه الفئة");
        }
      } catch (err) {
        console.error("خطأ في جلب المنتجات:", err);
        if (!mounted) return;
        setProducts([]);
        setStatusMessage("فشل في جلب المنتجات");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // اطلب المنتجات فقط إذا خريطة الفئات جاهزة أو نريد الاعتماد على slug مباشرة
    // (نسمح بالطلب حتى لو الخريطة لم تحتوي slug لأن backend يقبل slug)
    if (slugParam) fetchProducts();

    return () => { mounted = false; };
  }, [slugParam, categoryMap]);

  return (
    <>
      <Head>
        <title>{`${categoryName} | سبكتروم`}</title>
        <meta
          name="description"
          content={`اكتشف منتجات سبكتروم ضمن فئة ${categoryName} — حلول صوتية متكاملة تناسب جميع الاستخدامات.`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://s-spectrum.com/category/${slugParam}`}
        />

        {/* وسوم Open Graph لتحسين الظهور على وسائل التواصل */}
        <meta property="og:title" content={`${categoryName} | سبكتروم`} />
        <meta
          property="og:description"
          content={`تصفح أحدث منتجات سبكتروم ضمن فئة ${categoryName}.`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://s-spectrum.com/category/${slugParam}`}
        />
      </Head>
      <div className="p-4 md:p-6 lg:p-8 mt-25 md:mt-20" dir="rtl">
        <noscript>
          <h1>{categoryName} | سبكتروم</h1>
          <p>اكتشف منتجات سبكتروم ضمن فئة {categoryName}</p>
        </noscript>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center md:text-right text-gray-800">
          {categoryName}
        </h1>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border rounded-lg shadow">
                <div className="w-full h-40 bg-gray-200 animate-pulse rounded-t-lg"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-gray-600 text-xl font-semibold">
                  لا توجد منتجات
                </h3>
                <p className="text-gray-500 mt-2">
                  لم يتم العثور على منتجات في هذه الفئة
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {products.map((prod) => {
                  const mainImage =
                    prod.images?.find((i) => i.isMain)?.url ||
                    prod.images?.[0]?.url ||
                    "/placeholder.png";

                  return (
                    <Link
                      key={prod._id}
                      href={`/ProductDetails/${prod.slug}`}
                      className="block border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 group bg-white"
                    >
                      <div className="overflow-hidden">
                        <Image
                          src={mainImage}
                          alt={prod.name?.ar || prod.name?.en || "product"}
                          height={40}
                          width={100}
                          className="w-full h-40 md:h-48 object-cover rounded-t-lg group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.png";
                          }}
                        />
                      </div>
                      <div className="p-3">
                        <h2 className="font-semibold text-center text-gray-800 group-hover:text-blue-600 transition-colors text-sm md:text-base line-clamp-2">
                          {prod.name?.ar || prod.name?.en}
                        </h2>
                        {prod.shortDescription?.ar && (
                          <p className="text-xs text-gray-600 mt-2 line-clamp-2 hidden md:block">
                            {prod.shortDescription.ar}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
