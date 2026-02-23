// SearchBar.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLazySearchQuery } from "@/redux/appData";
import { useRouter } from "next/navigation";
import SearchResultItem from "./header/SearchResultItem";
import { Product } from "@/lib/types";

function debounce<T extends (...args: string[]) => void>(
  func: T,
  delay: number
): { debounced: (...args: Parameters<T>) => void; clear: () => void } {
  let timer: ReturnType<typeof setTimeout>;
  return {
    debounced: (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    },
    clear: () => clearTimeout(timer),
  };
}

export default function SearchBar() {
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [search, { data, isLoading }] = useLazySearchQuery();
  const router = useRouter();
  const searchResults: Product[] = data?.products;

  const { debounced: debouncedSearch, clear: clearSearch } = debounce(
    (title: string) => {
      if (title.length >= 3) {
        search({ title, page: 1, limit: 10 });
      }
    },
    300
  );

  useEffect(() => {
    if (searchTitle) {
      debouncedSearch(searchTitle);
    }

    return () => {
      clearSearch(); 
    };
  }, [searchTitle, debouncedSearch, clearSearch]);

  const handleClickSearchButton = () => {
    if (searchTitle) {
      router.push(`/store?search=${searchTitle}`);
    }
  };

  return (
    <div className="relative flex-grow">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleClickSearchButton();
        }}
      >
        <Input
          type="search"
          autoComplete="off"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          required
          placeholder="Search for products..."
          className="bg-[#f3f4f7] p-5 w-full h-full "
        />
        <button
          type="submit"
          className="absolute top-1/2 right-3 transform -translate-y-1/2"
        >
          {isLoading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </button>
      </form>
      {searchTitle && searchResults && searchResults.length > 1 && (
        <div className="z-[9999] absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg rounded-b-md">
          <ul>
            {searchResults.map((searchResult, index) => (
              <SearchResultItem key={index} searchResult={searchResult} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
