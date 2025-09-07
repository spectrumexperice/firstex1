"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Axios from "@/app/utilities/axios";
import SummaryApi from "@/app/common/summaryApi";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import he from "he";
import Image from "next/image";
// ===== Types =====
interface Product {
  _id: string;
  name: { ar: string; en: string };
  slug: string;
  category: { ar: string; en: string };
  subCategory?: { ar: string; en: string };
  description?: { ar: string; en: string };
  shortDescription?: { ar: string; en: string };
  tags?: string[];
  specs?: {
    ar: { key: string; value: string }[];
    en: { key: string; value: string }[];
  };
  images?: { url: string; isMain: boolean }[];
  attachments?: { url: string; name: string }[];
  relatedProducts?: {
    _id: string;
    name: { ar: string; en: string };
    slug: string;
    images?: { url: string; isMain: boolean }[];
  }[];
  featured?: boolean;
  active?: boolean;
}


export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "attachments"
  >("description");

  const t = useTranslations("ProductDetail");
const locale = useLocale() as 'en' | 'ar';
  const router = useRouter();
  const { slug } = useParams(); // assumed URL: /products/[category]/[subCategory]/[slug]

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await Axios(SummaryApi.Product.getone(slug));
        if (data.success) setProduct(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <p className="p-6">{t("loading")}</p>;
  if (!product) return <p className="p-6">{t("notFound")}</p>;

  return (
    <div
      className="p-6 mt-24 container px-4 py-8 mx-auto"
      dir={locale === "en" ? "ltr" : "rtl"}
    >
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-500">
        <Link href="/ProductsPage" className="hover:underline">
          {t("allProducts")}
        </Link>{" "}
        &gt; {product.category[locale]} &gt; {product.subCategory?.[locale]}{" "}
        &gt; {product.name[locale]}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Images Slider */}
<div className="flex flex-col space-y-3">
  <div className="relative w-full h-96 border rounded-lg overflow-hidden flex items-center justify-center">
    {product.images?.[activeImage] ? (
      <Image
        src={product.images[activeImage].url}
        alt={product.name[locale]}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-contain"
      />
    ) : (
      <div className="text-gray-400">{t("noImage")}</div>
    )}
  </div>
  <div className="flex space-x-2 ltr:space-x-reverse overflow-x-auto">
    {product.images?.map((img, idx) => (
      <div
        key={idx}
        className={`relative w-20 h-20 rounded border cursor-pointer ${
          activeImage === idx ? "border-blue-500 border-2" : "border-gray-300"
        }`}
        onClick={() => setActiveImage(idx)}
      >
        <Image
          src={img.url}
          alt={product.name[locale]}
          fill
          sizes="80px"
          className="object-cover rounded"
        />
      </div>
    ))}
  </div>
</div>
        {/* Product Details */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">{product.name[locale]}</h1>
          <p className="text-gray-500">{product.shortDescription?.[locale]}</p>

          {/* Stats */}
          <div className="flex items-center space-x-4 ltr:space-x-reverse text-gray-600">
            <span>
              {t("category")}: {product.category[locale]}
            </span>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mt-6">
            <nav className="flex space-x-8 ">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "description"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("description")}
              >
                {t("description")}
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "specs"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("specs")}
              >
                {t("specs")}
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "attachments"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("attachments")}
              >
                {t("attachments")}
              </button>
            </nav>
          </div>

          {/* محتوى التبويب */}
          <div className="mt-6">
            {activeTab === "description" && (
              <div
                className={`prose prose-lg prose-slate max-w-none mt-3 ${
                  locale === "ar" ? "rtl" : "ltr"
                }`}
                dangerouslySetInnerHTML={{
                  __html: he.decode(
                    typeof product.description === "string"
                      ? product.description
                      : product.description?.[locale] || "<p>No description</p>"
                  ),
                }}
              />
            )}

            {activeTab === "specs" && (
              <div className="overflow-x-auto rounded-lg shadow-sm">
                <table
                  className="table-auto border-collapse border w-full "
                  dir={locale === "en" ? "ltr" : "rtl"}
                >
                  <tbody>
                    {product.specs?.[locale]?.map((spec, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="px-2 py-1 font-semibold">{spec.key}</td>
                        <td className="px-2 py-1">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "attachments" && (
              <ul className="space-y-2">
                {product.attachments?.map((att, idx) => (
                  <li key={idx} className="flex items-center">
                    <svg
                      className="w-5 h-5 ml-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {att.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">{t("relatedProducts")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((rp) => (
              <Link key={rp._id} href={`/products/${rp.slug}`}>
                <div className="border rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                  <Image
                    src={
                      rp.images?.find((i) => i.isMain)?.url ||
                      "/placeholder.png"
                    }
                    alt={rp.name[locale]}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold">{rp.name[locale]}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
