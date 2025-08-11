import { FaSearch } from "react-icons/fa";
import { useRouter ,usePathname} from 'next/navigation';
import React, { useState, useEffect } from "react";
const Searchpage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchPage, setIsSearchPage] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(e.target.value);
};
  useEffect(() => {
    setIsSearchPage(pathname === "/search");
  }, [pathname]);
  const redirectToSearchPage = () => {
    if (!isSearchPage) {
      router.push("/search");
    }
  };

  return (
    <div
      dir="rtl"
      className="hidden lg:flex items-center border bg-gray-100 rounded-lg gap-2 px-2 h-10 
      w-[320px] text-neutral-600 dark:text-gray-300 cursor-pointer"
      onClick={redirectToSearchPage}
    >
      
      <FaSearch size={20} className="mr-1" />
      {!isSearchPage ? (
        <span className="select-none w-full">ابحث عن منتج أو خدمة...</span>
      ) : (
        <input
          type="text"
          autoFocus
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="ابحث عن منتج أو خدمة..."
          className="bg-transparent outline-none w-full text-sm dark:text-gray-100"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
};
export default Searchpage;
