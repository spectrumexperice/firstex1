"use client";
import he from "he"; // npm i he
import { TbArrowBackUpDouble } from "react-icons/tb";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import Axios from "@/app/utilities/axios";
import { toast } from "react-hot-toast";
import SummaryApi from "@/app/common/summaryApi";
import { setProductData ,setLoading } from "@/app/store/productSlice";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
// TipTap imports
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

import Image from "next/image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import fetchCategoies from "@/app/utilities/fetchCategories";
import { setCategoriesDetails } from "@/app/store/category";
import TiptapImage   from "@tiptap/extension-image"; // ← هذا
import fetchProductData from "@/app/utilities/fetchProductData";
interface ImageItem {
  url: string;
  publicId?: string;
  isMain?: boolean;
}
interface Attachment {
  url: string;
  publicId?: string;
  name?: string;
}
interface Spec {
  key: string;
  value: string;
}

interface Product {
  _id?: string;
  name: { ar?: string; en?: string } | any;
  description?: { ar?: string; en?: string } | any;
  shortDescription?: { ar?: string; en?: string } | any;
  category: { ar?: string; en?: string } | any;
  subCategory?: { ar?: string; en?: string } | any;
  images?: ImageItem[];
  attachments?: Attachment[];
  specs?: { ar?: Spec[]; en?: Spec[] } | any;
  tags?: string[];
  active?: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const initialProductState: Partial<Product> & { tagsInput?: string } = {
  name: { ar: "", en: "" },
  description: { ar: "", en: "" },
  shortDescription: { ar: "", en: "" },
  category: { ar: "", en: "" },
  subCategory: { ar: "", en: "" },
  active: true,
  featured: false,
  images: [],
  attachments: [],
  specs: { ar: [], en: [] },
  tags: [],
  tagsInput: "",
};

const ProductAdmin = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(
    (state: RootState) => (state as any).product
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLang, setCurrentLang] = useState<"ar" | "en">("ar"); // language tab in modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState<{ ar: string; en: string }>({
    ar: "",
    en: "",
  });
  const [parentCategory, setParentCategory] = useState<string | null>(null);
  const [categoriesList, setCategoriesList] = useState<
    { _id: string; name: { ar: string; en: string }; parentId?: string }[]
  >([]);
   const [subcategoriesList, setsubCategoriesList] = useState<
    { _id: string; name: { ar: string; en: string }; parentId?: string }[]
  >([]);

  const [formData, setFormData] =
    useState<typeof initialProductState>(initialProductState);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
const handleRemoveExistingImage = (index: number) => {
  setFormData(prev => {
    const imgs = [...(prev.images || [])];
    imgs.splice(index, 1);
    return { ...prev, images: imgs };
  });
};
// تعيين صورة رئيسية من القائمة الموجودة
const handleSetMainExisting = (index: number) => {
  setFormData(prev => {
    const imgs = (prev.images || []).map((im: any, i: number) => ({ ...im, isMain: i === index }));
    return { ...prev, images: imgs };
  });
};

/* // عند اختيار ملفات جديدة
const handleNewImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  setImageFiles(files); // هذه ترسل لاحقاً للـ backend كـ ملفات
  // لو تريد preview محلي:
  // يمكنك عمل state previews: setNewImagePreviews(files.map(f => URL.createObjectURL(f)))
}; */
  // ================== جلب المنتجات ==================
  
 useEffect(() => {
  const fetchCategories = async () => {
    try {
      const { data } = await Axios({
        ...SummaryApi.Product.getcategory,
      });
      dispatch(setCategoriesDetails(data.data));

      if (data?.success && Array.isArray(data?.data)) {
        setCategoriesList(data.data);
      } else {
        console.error("البيانات ليست مصفوفة:", data);
        setCategoriesList([]);
      }
    } catch (err) {
      toast.error("فشل جلب الفئات");
      setCategoriesList([]);
    }
  };

  fetchCategories();
}, [dispatch]);

 

 useEffect(() => {
  const fetchProducts = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await Axios({
        ...SummaryApi.Product.getAll,
        params: { page: currentPage, search: searchTerm },
      });
      dispatch(setProductData(data.data));
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("فشل في جلب البيانات");
    } finally {
      dispatch(setLoading(false));
    }
  };

  fetchProducts();
}, [currentPage, searchTerm, dispatch]);


  // ================== TipTap editor setup ==================
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TiptapImage ,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: formData.description?.[currentLang] || "",
    editorProps: {
      attributes: {
        class: "border rounded p-2 min-h-[150px] w-full prose",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData((prev) => ({
        ...prev,
        description: { ...(prev.description || {}), [currentLang]: html },
      }));
    },
    immediatelyRender: false,
  });

  // Sync editor content when currentLang or formData.description changes
  useEffect(() => {
    if (!editor) return;
    const content =
      (formData.description && (formData.description as any)[currentLang]) ||
      "";
    // only set content if different to avoid cursor reset
    try {
      if (editor.getHTML() !== content)
        editor.commands.setContent(content || "");
    } catch (e) {
      /* ignore */
    }
  }, [currentLang, formData.description, editor]);

  // ================== Input helpers ==================
  const handleLangInput = (
    field: keyof Product,
    lang: "ar" | "en",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...((prev as any)[field] || {}), [lang]: value },
    }));
  };

  // generic for non-language fields (price, etc)
  /* const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name === "price") {
      setFormData(prev => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
 */
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // ================== Specs management per language ==================
  const handleSpecChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    setFormData((prev) => {
      const specs = { ...(prev.specs || { ar: [], en: [] }) };
      const arr = [...(specs as any)[currentLang]];
      arr[index] = { ...(arr[index] || {}), [field]: value };
      (specs as any)[currentLang] = arr;
      return { ...prev, specs };
    });
  };

  const addSpec = () => {
    setFormData((prev) => {
      const specs = { ...(prev.specs || { ar: [], en: [] }) };
      (specs as any)[currentLang] = [
        ...((specs as any)[currentLang] || []),
        { key: "", value: "" },
      ];
      return { ...prev, specs };
    });
  };

  const removeSpec = (index: number) => {
    setFormData((prev) => {
      const specs = { ...(prev.specs || { ar: [], en: [] }) };
      const arr = [...((specs as any)[currentLang] || [])];
      arr.splice(index, 1);
      (specs as any)[currentLang] = arr;
      return { ...prev, specs };
    });
  };

  // ================== Tags helper ==================
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, tagsInput: e.target.value }));
  };

  /*  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }; */

  // ================== فتح/إضافة/تعديل ==================
  const handleEdit = (product: Product) => {
    // Normalize incoming product to our form shape. Keep existing non-language fields as-is.
    const normalized: any = {
      ...initialProductState,
      ...product,
      name: product.name || { ar: "", en: "" },
      description: product.description || { ar: "", en: "" },
      shortDescription: product.shortDescription || { ar: "", en: "" },
      category: product.category?._id || product.category || "",
      subCategory: product.subCategory?._id || product.subCategory || "",
      specs: product.specs || { ar: [], en: [] },
      images: product.images || [],
      attachments: product.attachments || [],
      tagsInput: (product.tags || []).join(","),
      active: product.active ?? true,
      featured: product.featured ?? false,
    };

    setFormData(normalized);
    // set editor content for current language
    const htmlContent =
      (normalized.description &&
        (normalized.description as any)[currentLang]) ||
      "";
    if (editor) editor.commands.setContent(htmlContent);
    setImageFiles([]);
    setAttachmentFiles([]);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setFormData(initialProductState);
    setImageFiles([]);
    setAttachmentFiles([]);
    setIsEditing(false);
    setIsModalOpen(true);
    if (editor) editor.commands.setContent("");
  };

  // ================== إرسال النموذج ==================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // basic validation: require Arabic name and Arabic category (as per your backend slug generator)
    if (typeof formData.category === 'object') {
    toast.error("خطأ في بيانات الفئة");
    return;
  }
    if (
      !formData.name?.ar ||
      !formData.category ||
      (!isEditing && imageFiles.length === 0)
    ) {
      toast.error("الاسم (العربية) والفئة (العربية) وصورة رئيسية مطلوبة");
      return;
    }

    // ensure description from editor is saved (already handled in onUpdate, but ensure)
    const htmlDescription = editor?.getHTML() || "";
    setFormData((prev) => ({
      ...prev,
      description: {
        ...(prev.description || {}),
        [currentLang]: htmlDescription,
      },
    }));

    const formPayload = new FormData();

    // Send language fields as JSON strings
    formPayload.append(
      "name",
      JSON.stringify(formData.name || { ar: "", en: "" })
    );
    formPayload.append(
      "category",
      (formData.category as string)
    );
    if (formData.subCategory)
      formPayload.append("subCategory", formData.subCategory as string);
    if (formData.description)
      formPayload.append("description", JSON.stringify(formData.description));
    if (formData.shortDescription)
      formPayload.append(
        "shortDescription",
        JSON.stringify(formData.shortDescription)
      );
    formPayload.append("specs", JSON.stringify(formData.specs));

    // non-language fields
    if ((formData as any).price !== undefined)
      formPayload.append("price", String((formData as any).price));
    formPayload.append("active", String(formData.active ? "true" : "false"));
    formPayload.append(
      "featured",
      String(formData.featured ? "true" : "false")
    );

    // tags
    const tagsArray = formData.tagsInput
      ?.split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    if (tagsArray) formPayload.append("tags", JSON.stringify(tagsArray));

    // files
    imageFiles.forEach((file) => formPayload.append("images", file));
    attachmentFiles.forEach((file) => formPayload.append("attachments", file));

    if (isEditing && formData._id) {
      formPayload.append(
        "existingImages",
        JSON.stringify(formData.images || [])
      );
      formPayload.append(
        "existingAttachments",
        JSON.stringify(formData.attachments || [])
      );
    }

    try {
      dispatch(setLoading(true));
      const response = await Axios({
        ...(isEditing && formData._id
          ? SummaryApi.Product.update(formData._id as string)
          : SummaryApi.Product.add),
        data: formPayload,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        toast.success(isEditing ? "تم تحديث المنتج" : "تمت إضافة المنتج");
        fetchProductData();
        setIsModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "فشل العملية");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      await Axios({ ...SummaryApi.Product.delete(id) });
      toast.success("تم الحذف بنجاح");
      fetchProductData();
    } catch (error) {
      toast.error("فشل في الحذف");
    }
  };

  // Helper to display name/category with fallback
  const displayLang = (obj: any, lang = "ar") => {
    if (!obj) return "";
    return obj[lang] || obj.en || obj.ar || obj || "";
  };
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");

// عند التعديل
useEffect(() => {
  if (formData.category) {
    setSelectedCategoryId(
      typeof formData.category === 'string' 
        ? formData.category 
        : formData.category._id || ""
    );
  }
  if (formData.subCategory) {
    setSelectedSubCategoryId(
      typeof formData.subCategory === 'string'
        ? formData.subCategory
        : formData.subCategory._id || ""
    );
  }
}, [formData]);

  return (
    <div dir="rtl" className="p-6">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold">إدارة المنتجات</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center">
          <input
            type="text"
            placeholder="بحث..."
            className="px-4 py-2 border rounded flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
          >
            إضافة منتج جديد
          </button>
          <button
            type="button"
            onClick={() => (setIsCategoryModalOpen(true), fetchCategoies())}
            className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500"
          >
            إدارة الفئات
          </button>

          <Link href="/" className=" text-red-600 hover:underline">
            <FaHome size={35} />
          </Link>
        </div>
      </div>

      {/* جدول المنتجات */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">الصورة الرئيسية</th>
              <th className="px-4 py-2">الاسم</th>
              <th className="px-4 py-2">الفئة</th>
              <th className="px-4 py-2">الحالة</th>
              <th className="px-4 py-2">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  جاري التحميل...
                </td>
              </tr>
            ) : (
              (products || []).map((product: any) => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {product.images?.find((img: any) => img.isMain) ? (
                      <Image alt="productImage"
                        src={product.images.find((img: any) => img.isMain)!.url}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">لا توجد صورة رئيسية</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {displayLang(product.name, "ar")}
                  </td>
                  <td className="px-4 py-2">
                    {product.category?.name?.[currentLang] ||
                      product.category?.name?.ar ||
                      ""}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.active ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(product._id!)}
                      className="text-red-600 hover:text-red-800"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ترحيل الصفحات */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 flex-wrap gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal إضافة/تعديل المنتج */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}
            </h2>

            {/* language tabs */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setCurrentLang("ar")}
                className={`px-3 py-1 rounded ${
                  currentLang === "ar"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setCurrentLang("en")}
                className={`px-3 py-1 rounded ${
                  currentLang === "en"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                English
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* الحقول الأساسية (لغوية) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={(formData.name as any)?.[currentLang] || ""}
                  onChange={(e) =>
                    handleLangInput("name" as any, currentLang, e.target.value)
                  }
                  placeholder={
                    currentLang === "ar"
                      ? "اسم المنتج بالعربية"
                      : "Product name (English)"
                  }
                  className="p-2 border rounded"
                  required={currentLang === "ar"} // require Arabic name as main
                />

                {/* فئة رئيسية */}
                <div>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => {
                      setSelectedCategoryId(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value, // تخزين ID فقط
                      }));
                      setSelectedSubCategoryId(""); // reset الفئة الفرعية
                    }}
                    className="p-2 border rounded w-full"
                    required={currentLang === "ar"}
                  >
                    <option value="">اختيار الفئة الرئيسية</option>

                    {categoriesList
                      .filter((cat) => !cat.parentId) // فئات بدون parent هي الفئات الرئيسية
                      .map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name?.[currentLang] || cat.name?.ar || ""}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* subCategory (lang) */}
              {/* فئة فرعية */}

              <div>
                <select
                  value={selectedSubCategoryId}
                  onChange={(e) => {
                    setSelectedSubCategoryId(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      subCategory: e.target.value, // تخزين ID فقط
                    }));
                  }}
                  className="p-2 border rounded w-full"
                  disabled={!selectedCategoryId} // تعطيل الخيار إذا لم يتم اختيار فئة رئيسية
                >
                  <option value="">اختيار الفئة الفرعية</option>
                  {selectedCategoryId &&
                    categoriesList
                      .filter((cat) => cat.parentId === selectedCategoryId)
                      .map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name?.[currentLang] || cat.name?.ar || ""}
                        </option>
                      ))}
                </select>
              </div>

              {/* الوصف الكامل باستخدام TipTap */}
              <div dir="ltr">
                <label className="block mb-1 font-semibold">
                  {currentLang === "ar"
                    ? "الوصف الكامل للمنتج (العربية)"
                    : "Full description (English)"}
                </label>
                <EditorContent editor={editor} />
              </div>

              {/* الوصف المختصر */}
              <div>
                <textarea
                  value={
                    (formData.shortDescription as any)?.[currentLang] || ""
                  }
                  onChange={(e) =>
                    handleLangInput(
                      "shortDescription" as any,
                      currentLang,
                      e.target.value
                    )
                  }
                  placeholder={
                    currentLang === "ar"
                      ? "الوصف المختصر بالعربية"
                      : "Short description (English)"
                  }
                  className="w-full p-2 border rounded"
                  rows={2}
                />
              </div>

              {/* الوسوم (غير لغوية) */}
              <input
                type="text"
                placeholder="الوسوم (افصل بفواصل)"
                value={formData.tagsInput || ""}
                onChange={handleTagsChange}
                className="w-full p-2 border rounded"
              />

              {/* المواصفات الفنية - تعمل على اللغة الحالية */}
              <div>
                <h3 className="font-semibold mb-2">
                  {currentLang === "ar"
                    ? "المواصفات الفنية (العربية)"
                    : "Specifications (English)"}
                </h3>
                {((formData.specs as any)?.[currentLang] || []).map(
                  (spec: Spec, idx: number) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder={currentLang === "ar" ? "المفتاح" : "Key"}
                        value={spec.key}
                        onChange={(e) =>
                          handleSpecChange(idx, "key", e.target.value)
                        }
                        className="p-2 border rounded flex-1"
                      />
                      <input
                        type="text"
                        placeholder={currentLang === "ar" ? "القيمة" : "Value"}
                        value={spec.value}
                        onChange={(e) =>
                          handleSpecChange(idx, "value", e.target.value)
                        }
                        className="p-2 border rounded flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpec(idx)}
                        className="px-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        حذف
                      </button>
                    </div>
                  )
                )}
                <button
                  type="button"
                  onClick={addSpec}
                  className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  إضافة مواصفة
                </button>
              </div>

              {/* الصور والمرفقات */}
              <div>
                <label className="block mb-1">
                  رفع الصور (اختر الصورة الرئيسية بعلامة)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setImageFiles(Array.from(e.target.files || []))
                  }
                />
                {(formData.images || []).map((img: any, idx: number) => (
                  <div
                    key={img.publicId || img.url || idx}
                    className="flex items-center gap-2 mt-2"
                  >
                    <Image
                      src={img.url}
                      alt=""
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex flex-col">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="mainImage"
                          checked={!!img.isMain}
                          onChange={() => handleSetMainExisting(idx)}
                        />
                        <span className="text-sm">صورة رئيسية</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(idx)}
                        className="text-sm text-red-600 mt-1"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block mb-1">رفع المرفقات (PDF, DOC)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={(e) =>
                    setAttachmentFiles(Array.from(e.target.files || []))
                  }
                />
              </div>

              {/* خيارات */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="active"
                    checked={Boolean(formData.active)}
                    onChange={handleCheckboxChange}
                  />{" "}
                  نشط
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={Boolean(formData.featured)}
                    onChange={handleCheckboxChange}
                  />{" "}
                  مميز
                </label>
              </div>

              {/* الأزرار */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* خلفية شفافة */}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>

          {/* النافذة الرئيسية */}
          <div className="relative bg-white rounded-lg shadow-lg w-96 p-6 z-50">
            <h2 className="text-lg font-bold mb-4">إضافة فئة جديدة</h2>

            <input
              type="text"
              placeholder="اسم الفئة بالعربية"
              value={categoryName.ar}
              onChange={(e) =>
                setCategoryName((prev) => ({ ...prev, ar: e.target.value }))
              }
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="اسم الفئة بالإنجليزية"
              value={categoryName.en}
              onChange={(e) =>
                setCategoryName((prev) => ({ ...prev, en: e.target.value }))
              }
              className="w-full p-2 border rounded mb-2"
            />

            <select
              value={parentCategory || ""}
              onChange={(e) => setParentCategory(e.target.value || null)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">فئة رئيسية</option>
              {Array.isArray(categoriesList) && categoriesList.length > 0 ? (
                categoriesList.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name.ar}
                  </option>
                ))
              ) : (
                <option disabled>لا توجد فئات</option>
              )}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                إلغاء
              </button>
              <button
                onClick={async () => {
                  if (!categoryName.ar)
                    return toast.error("الاسم بالعربية مطلوب");
                  try {
                    await Axios({
                      ...SummaryApi.Product.addCategory,
                      data: {
                        name: categoryName,
                        parentId: parentCategory,
                      },
                    });
                    toast.success("تمت إضافة الفئة");
                    setCategoryName({ ar: "", en: "" });
                    setParentCategory(null);
                    setIsCategoryModalOpen(false);
                    // تحديث قائمة الفئات مباشرة

                    fetchCategoies();
                  } catch (err: any) {
                    toast.error(err?.response?.data?.message || "فشل الإضافة");
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
      {imageFiles.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
         
        </div>
      )}
    </div>
  );
};

export default ProductAdmin;
