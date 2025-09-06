"use client";

import { useEffect, useState } from "react";
import Axios from "../utilities/axios";
import SummaryApi from "../common/summaryApi";
import { toast } from "react-hot-toast";
import { MdDelete, MdOutlineMarkEmailRead, MdContactMail, MdReply, MdFileDownload, MdFilterAlt, MdSearch } from "react-icons/md";
import ConfirmModal from '../ConfirmDelet'
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip ,Legend} from "recharts";

// 1. تعريف نوع الرسالة كاملاً
type Message = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
  createdAt: string;
  type: "simple" | "detailed";
  replied?: boolean;
  replyText?: string;
  company?: string;
  projectName?: string;
  projectStatus?: string;
  projectLocation?: string;
  projectType?: string;
  quantity?: number;
  specifications?: string;
  description?: string;
  attachments?: { filename: string; url: string; publicId?: string }[];
};

// 2. الألوان المخصصة للإحصائيات
const COLORS = ["#6b252f", "#fbbf24", "#10b981", "#3b82f6"];

const MailAdmin = () => {
  // 3. جميع حالات (states) المطلوبة
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"simple" | "detailed" | null>(null);
  const [replyText, setReplyText] = useState("");
  const [stats, setStats] = useState<{ name: string; value: number }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "simple" | "detailed" | "replied" | "unreplied">("all");

  // 4. جلب الرسائل من API
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await Axios({ ...SummaryApi.MsgAdmin.getAll});
      if (response.data.success) {
        setMessages(response.data.messages);
        updateStats(response.data.messages);
        applyFilters(response.data.messages);
      } else {
        toast.error(response.data.message || "فشل في جلب الرسائل");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء جلب الرسائل");
      console.error("Fetching error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 5. تحديث الإحصائيات
  const updateStats = (msgs: Message[]) => {
    const newStats = [
      { name: "رسائل قصيرة", value: msgs.filter(m => m.type === "simple").length },
      { name: "رسائل مفصلة", value: msgs.filter(m => m.type === "detailed").length },
      { name: "بلا رد", value: msgs.filter(m => !m.replied).length },
      { name: "مردود عليها", value: msgs.filter(m => m.replied).length }
    ];
    setStats(newStats);
  };

  // 6. تطبيق الفلاتر والبحث
  const applyFilters = (msgs: Message[]) => {
    let result = [...msgs];

    // تطبيق البحث
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(msg => 
        msg.fullName.toLowerCase().includes(term) ||
        msg.email.toLowerCase().includes(term) ||
        (msg.phone && msg.phone.includes(term)) ||
        (msg.message && msg.message.toLowerCase().includes(term)) ||
        (msg.company && msg.company.toLowerCase().includes(term))
      );
    }

    // تطبيق الفلتر
    switch (filter) {
      case "simple": result = result.filter(m => m.type === "simple"); break;
      case "detailed": result = result.filter(m => m.type === "detailed"); break;
      case "replied": result = result.filter(m => m.replied); break;
      case "unreplied": result = result.filter(m => !m.replied); break;
    }

    setFilteredMessages(result);
  };

  // 7. حذف الرسالة
  const handleDelete = async () => {
    if (!selectedId || !selectedType) return;
    
    try {
      const response = await Axios({
        ...SummaryApi.MsgAdmin.delete(selectedId, selectedType)
      });

      if (response.data.success) {
        toast.success("تم حذف الرسالة بنجاح");
        const updatedMessages = messages.filter(m => m._id !== selectedId);
        setMessages(updatedMessages);
        updateStats(updatedMessages);
        applyFilters(updatedMessages);
      } else {
        toast.error(response.data.message || "فشل في حذف الرسالة");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
      console.error("Deletion error:", error);
    } finally {
      setShowConfirm(false);
    }
  };

  // 8. الرد على الرسالة
  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      const response = await Axios({
        ...SummaryApi.MsgAdmin.replay(selectedMessage._id, selectedMessage.type),
        data: { replyText }
      });

      if (response.data.success) {
        toast.success("تم إرسال الرد بنجاح");
        const updatedMessages = messages.map(m => 
          m._id === selectedMessage._id ? { ...m, replied: true, replyText } : m
        );
        setMessages(updatedMessages);
        updateStats(updatedMessages);
        applyFilters(updatedMessages);
        setSelectedMessage(null);
        setReplyText("");
      } else {
        toast.error(response.data.message || "فشل في إرسال الرد");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الرد");
      console.error("Reply error:", error);
    }
  };

  // 9. تصدير البيانات
  const handleExport = async (format: "csv" | "pdf") => {
    try {
      const response = await Axios({
        ...SummaryApi.MsgAdmin.export( format),
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `messages_${new Date().toISOString()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(`تم التصدير بنجاح كـ ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("فشل في عملية التصدير");
      console.error("Export error:", error);
    }
  };

  // 10. تأثيرات جانبية
  useEffect(() => {
    fetchMessages();
  }, );

  useEffect(() => {
    applyFilters(messages);
  }, );

  // 11. واجهة المستخدم الكاملة
  return (
    <section className="p-6 max-w-7xl mx-auto" dir="rtl">
      <Link
        href="/"
        className="text-[#6b252f] hover:underline mt-2 flex mb-5 justify-end"
      >
        ← العودة للصفحة الرئيسية
      </Link>
      {/* شريط العنوان والأدوات */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#6b252f] font-[Cairo]">
            ✉️ لوحة إدارة الرسائل
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* شريط البحث */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ابحث في الرسائل..."
              className="w-full border rounded-full py-2 px-4 pr-10 focus:ring-2 focus:ring-[#6b252f] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MdSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* فلتر الرسائل */}
          <div className="relative flex-1  ">
            <select
              className="w-full border rounded-full py-2 px-7 pl-10 appearance-none bg-white focus:ring-2 focus:ring-[#6b252f] focus:border-transparent text-gray-600"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">كل الرسائل</option>
              <option value="simple">رسائل قصيرة</option>
              <option value="detailed">رسائل مفصلة</option>
              <option value="unreplied">بلا رد</option>
              <option value="replied">مردود عليها</option>
            </select>
            <MdFilterAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 " />
          </div>

          {/* زر التصدير */}
          <button
            onClick={() => handleExport("csv")}
            className="flex items-center justify-center gap-2 bg-[#6b252f] hover:bg-[#5a1f28] text-white py-2 px-4 rounded-full whitespace-nowrap"
          >
            <MdFileDownload /> تصدير CSV
          </button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-t-4 border-[#6b252f]">
          <p className="text-gray-500 text-sm">إجمالي الرسائل</p>
          <p className="text-2xl font-bold">{messages.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-t-4 border-blue-500">
          <p className="text-gray-500 text-sm">رسائل قصيرة</p>
          <p className="text-2xl font-bold">
            {stats.find((s) => s.name === "رسائل قصيرة")?.value || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-t-4 border-yellow-500">
          <p className="text-gray-500 text-sm">بلا رد</p>
          <p className="text-2xl font-bold">
            {stats.find((s) => s.name === "بلا رد")?.value || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-t-4 border-green-500">
          <p className="text-gray-500 text-sm">مردود عليها</p>
          <p className="text-2xl font-bold">
            {stats.find((s) => s.name === "مردود عليها")?.value || 0}
          </p>
        </div>
      </div>

      {/* قائمة الرسائل */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6b252f] mb-4"></div>
          <p>جارٍ تحميل الرسائل...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-xl">لا توجد رسائل متاحة</p>
          <p className="text-gray-400 mt-2">
            قم بتعديل فلتر البحث أو حاول لاحقًا
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMessages.map((message) => (
            <div
              key={message._id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
                message.type === "detailed"
                  ? "border-blue-500"
                  : "border-green-500"
              } ${!message.replied ? "ring-2 ring-yellow-400/30" : ""}`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {message.type === "simple" ? (
                      <MdContactMail className="text-[#6b252f]" size={20} />
                    ) : (
                      <MdOutlineMarkEmailRead
                        className="text-[#6b252f]"
                        size={20}
                      />
                    )}
                    <h3 className="font-bold truncate max-w-[120px]">
                      {message.fullName}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(message.createdAt).toLocaleDateString("ar-SA")}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <span>📧</span>
                    <span className="truncate">{message.email}</span>
                  </p>
                  {message.phone && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <span>📞</span>
                      <span>{message.phone}</span>
                    </p>
                  )}
                  {message.company && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <span>🏢</span>
                      <span className="truncate">{message.company}</span>
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setSelectedMessage(message)}
                    className="text-sm text-[#6b252f] hover:underline"
                  >
                    عرض التفاصيل
                  </button>
                  <div className="flex items-center gap-2">
                    {message.replied ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        ✓ تم الرد
                      </span>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        يحتاج رد
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedId(message._id);
                    setSelectedType(message.type);
                    setShowConfirm(true);
                  }}
                  className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                >
                  <MdDelete /> حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* نافذة عرض الرسالة */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-[#6b252f] text-white p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  {selectedMessage.fullName}
                </h3>
                <button
                  onClick={() => {
                    setSelectedMessage(null);
                    setReplyText("");
                  }}
                  className="text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm opacity-90">{selectedMessage.email}</p>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm text-gray-500">تاريخ الإرسال</h4>
                  <p>
                    {new Date(selectedMessage.createdAt).toLocaleString(
                      "ar-SA"
                    )}
                  </p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <h4 className="text-sm text-gray-500">رقم الهاتف</h4>
                    <p>{selectedMessage.phone}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm text-gray-500">نوع الرسالة</h4>
                  <p>
                    {selectedMessage.type === "simple"
                      ? "رسالة قصيرة"
                      : "رسالة مفصلة"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">حالة الرد</h4>
                  <p>{selectedMessage.replied ? "تم الرد" : "بلا رد"}</p>
                </div>
              </div>

              {/* Message Content */}
              <div className="mb-6">
                {selectedMessage.type === "simple" ? (
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="font-bold mb-2">نص الرسالة</h4>
                    <p className="whitespace-pre-line">
                      {selectedMessage.message || "لا يوجد نص"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedMessage.company && (
                        <div>
                          <h4 className="text-sm text-gray-500">الشركة</h4>
                          <p>{selectedMessage.company}</p>
                        </div>
                      )}
                      {selectedMessage.projectName && (
                        <div>
                          <h4 className="text-sm text-gray-500">اسم المشروع</h4>
                          <p>{selectedMessage.projectName}</p>
                        </div>
                      )}
                    </div>

                    {selectedMessage.projectLocation && (
                      <div>
                        <h4 className="text-sm text-gray-500">موقع المشروع</h4>
                        <p>{selectedMessage.projectLocation}</p>
                      </div>
                    )}

                    {selectedMessage.specifications && (
                      <div>
                        <h4 className="text-sm text-gray-500">المواصفات</h4>
                        <p className="whitespace-pre-line">
                          {selectedMessage.specifications}
                        </p>
                      </div>
                    )}

                    {selectedMessage.description && (
                      <div>
                        <h4 className="text-sm text-gray-500">وصف إضافي</h4>
                        <p className="whitespace-pre-line">
                          {selectedMessage.description}
                        </p>
                      </div>
                    )}

                    {selectedMessage.attachments?.length > 0 && (
                      <div>
                        <h4 className="text-sm text-gray-500">المرفقات</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedMessage.attachments.map((file, index) => (
                            <a
                              key={index}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
                            >
                              <span>📎</span>
                              <span>{file.filename}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Reply Section */}
              {selectedMessage.replied ? (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
                  <h4 className="font-bold text-green-800 mb-2">الرد المرسل</h4>
                  <p className="whitespace-pre-line">
                    {selectedMessage.replyText}
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <h4 className="font-bold mb-3">إرسال رد</h4>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-[#6b252f] focus:border-transparent"
                    placeholder="اكتب ردك هنا..."
                    rows={5}
                  />
                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleReply}
                      className="px-4 py-2 bg-[#6b252f] text-white rounded hover:bg-[#5a1f28] flex items-center gap-1"
                    >
                      <MdReply /> إرسال الرد
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* نافذة تأكيد الحذف */}
      <ConfirmModal
        open={showConfirm}
        message="هل أنت متأكد من حذف هذه الرسالة؟"
        confirmText="حذف"
        cancelText="إلغاء"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />

      {/* مخطط الإحصائيات */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-[#6b252f]">توزيع الرسائل</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {stats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} رسالة`, "العدد"]}
                labelFormatter={(label) => `نوع: ${label}`}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                layout="horizontal"
                iconType="circle"
                formatter={(value, entry) => (
                  <span className="text-gray-700 font-medium">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default MailAdmin;