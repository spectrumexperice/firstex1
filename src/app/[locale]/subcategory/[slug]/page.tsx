"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import SummaryApi from "@/app/common/summaryApi";
import Axios from "@/app/utilities/axios";
import Image from "next/image";
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

  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug || "";

  const [categoryMap, setCategoryMap] = useState<{ [key: string]: Category }>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // 1️⃣ جلب كل الفئات (رئيسية + فرعية)
  useEffect(() => {
    let mounted = true;

    const fetchAllCategories = async () => {
      try {
        const response = await Axios(SummaryApi.Product.getcategory);
        const categories: Category[] = response?.data?.data || [];

        const map: { [key: string]: Category } = {};
        categories.forEach((cat) => {
          map[cat.slug] = cat;
          map[cat._id] = cat;
        });

        if (mounted) setCategoryMap(map);
      } catch (err) {
        console.error("خطأ في جلب الفئات:", err);
        if (mounted) setStatusMessage("فشل في جلب الفئات");
      }
    };

    fetchAllCategories();
    return () => {
      mounted = false;
    };
  }, []);

  // 2️⃣ جلب المنتجات حسب الفئة الفرعية (slug)
  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      if (!slug) {
        setProducts([]);
        return;
      }

      const catRecord = categoryMap[slug];
      const subcategoryParam = catRecord ? catRecord._id : slug;

      console.log("طلب منتجات للفئة الفرعية:", subcategoryParam);

      setLoading(true);
      setStatusMessage(null);

      try {
        const response = await Axios({
          ...SummaryApi.Product.getAll,
          params: subcategoryParam ? { subCategory: subcategoryParam } : {},
        });

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

    if (slug) fetchProducts();

    return () => {
      mounted = false;
    };
  }, [slug, categoryMap]);

  return (
    <div className="p-4 md:p-6 lg:p-8 mt-25 md:mt-20" dir="rtl">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center md:text-right text-gray-800">
        {categoryMap[slug]?.name?.ar || slug || "المنتجات"}
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
          {statusMessage && (
            <p className="col-span-full text-center text-gray-500 py-8">{statusMessage}</p>
          )}

          {products.length === 0 && !statusMessage ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-gray-600 text-xl font-semibold">لا توجد منتجات</h3>
              <p className="text-gray-500 mt-2">لم يتم العثور على منتجات في هذه الفئة</p>
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
                        className="w-full h-40 md:h-48 object-cover rounded-t-lg group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.png";
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
  );
}
