"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/local/ProductCard";
import { MobileFilterSidebar } from "@/components/local/MobileFilterSidebar";
import PaginationComponent from "@/components/local/PaginationComponent";
import {
  useGetAllCategoryQuery,
  useGetAllProductQuery,
  useLazySearchQuery,
} from "@/redux/appData";
import { Category, Product } from "@/lib/types";
import CustomLoader from "@/components/local/CustomLoader";
import Filter from "./Filter";
import { useSearchParams } from "next/navigation";
import {
  CategoryNames,
  getCategoryImage,
} from "@/components/local/CategoryIcons";
import NoItemFound from "@/components/local/NoItemFound";

type SelectedRange = {
  min: number;
  max: number;
};

export default function Store() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [category, setCategory] = useState<string[]>([]);
  const [min, setMin] = useState<number | undefined>(undefined);
  const [max, setMax] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<string | undefined>("newest");
  const [inStock, setInStock] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);

  const handleStockChange = (status: string) => {
    if (status === "inStock") {
      setInStock((prev) => !prev);
    } else if (status === "outOfStock") {
      setOutOfStock((prev) => !prev);
    }
  };

  // The function to handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setCategory((prev) => {
      // Check if the categoryId is already in the array
      if (prev.includes(categoryId)) {
        // Remove the categoryId if it's already selected
        return prev.filter((id) => id !== categoryId);
      } else {
        // Add the categoryId if it's not already selected
        return [...prev, categoryId];
      }
    });
  };

  React.useEffect(() => {
    // This will run every time the 'category' state changes

    // Create a new instance of URLSearchParams from the current URL
    const params = new URLSearchParams(window.location.search);

    // Update the 'category' parameter in the URL with the updated 'category' state
    params.set("category", category.join(","));

    // Construct the new URL with updated parameters
    const newUrl = `${window.location.pathname}?${params.toString()}`;

    // Update the browser's URL without reloading the page
    window.history.pushState(null, "", newUrl);
  }, [category]); // This hook depends on 'category' state

  // const queryCategory = category.length > 0 ? category : categorySearch;
  // const queryCategory = category.length > 0 ? category.join(",") : category;

  const { data, isLoading, error } = useGetAllProductQuery(
    {
      page,
      limit,
      category,
      min,
      max,
      sort,
      inStock,
      outOfStock,
    },
    { refetchOnMountOrArgChange: true }
  );

  const products: Product[] = data ? data.products : [];
  const [searchTitle, setSearchTitle] = useState<string>("");

  // Use useSearchParams hook to get the search query from URL
  const searchParams = useSearchParams();
  const searchQueryFromUrl = searchParams.get("search") || "";

  React.useEffect(() => {
    // Sync the state with the URL search parameter
    setSearchTitle(searchQueryFromUrl);

    const categoryQueryFromUrl = searchParams.get("category");
    if (categoryQueryFromUrl) {
      const categoriesFromUrl = categoryQueryFromUrl.split(",");
      setCategory(categoriesFromUrl); // Set categories from the URL
    }
  }, [searchParams, searchQueryFromUrl]);

  // React.useEffect(() => {
  //   const categoryQueryFromUrl = searchParams.get("category") || "";
  //   const categoryQueryFromUrlArray = categoryQueryFromUrl
  //     ? [categoryQueryFromUrl]
  //     : [];

  //   setCategorySearch(categoryQueryFromUrlArray);
  // }, [searchParams]);

  // React.useEffect(() => {
  //   // Sync the state with the URL search parameter
  //   setSearchTitle(searchQueryFromUrl);
  // }, [searchQueryFromUrl]);
  const [search, { data: searchData, isLoading: searchIsLoading }] =
    useLazySearchQuery();

  React.useEffect(() => {
    if (searchQueryFromUrl) {
      search({ title: searchQueryFromUrl, page, limit });
    }
  }, [search, searchQueryFromUrl, page, limit]);

  const searchResults: Product[] = searchData?.products;

  const productsToDisplay = searchQueryFromUrl ? searchResults : products;
  const totalPages = searchQueryFromUrl
    ? searchData?.pagination?.totalPages
    : data && data.pagination.totalPages;

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const highestPrice = 20000;

  const [range, setRange] = useState<[number, number]>([0, highestPrice]);

  const handleFilter = (selectedRange: SelectedRange) => {
    setRange([0, selectedRange.max]);
    setMin(selectedRange.min);
    setMax(selectedRange.max);
  };

  const handleSortChange = (value: string) => {
    setSort(value); // Update sort state directly
  };

  const [isLoadingData, setIsLoadingData] = useState(false);

  React.useEffect(() => {
    setIsLoadingData(true);
    const timer = setTimeout(() => setIsLoadingData(false), 500); // Simulate a delay
    return () => clearTimeout(timer);
  }, [category, sort, min, max, inStock, outOfStock]);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    // error: errorCategories,
  } = useGetAllCategoryQuery(undefined);
  // console.log(data && data);
  // Shuffle data and pick the first 9 categories
  const categoryData: Category[] = categories ? categories.category : [];
  const isAnyLoading =
    isLoadingData || isLoading || searchIsLoading || isLoadingCategories;

  const getCategoryName = (id: string): string | undefined => {
    const category = categoryData.find((cat) => cat._id === id);
    return category?.name;
  };

  const getCategoryContent = (categoryName: string | undefined) => {
    switch (categoryName) {
      case "Grocery/Food Items":
        return {
          subTitle: "Fresh and Affordable",
          title: "Get the Best Groceries",
          highlight: "Shop Fresh, Eat Fresh",
        };
      case "Personal care items":
        return {
          subTitle: "Care for Yourself",
          title: "Top Personal Care Products",
          highlight: "Look Good, Feel Great",
        };
      case "Household items":
        return {
          subTitle: "Essentials for Your Home",
          title: "Household Goods You Need",
          highlight: "Make Your Home Shine",
        };
      case "Drinks":
        return {
          subTitle: "Refreshing and Delicious",
          title: "Your Favorite Beverages",
          highlight: "Drink, Chill, Repeat",
        };
      case "Electrical Items":
        return {
          subTitle: "Power Up Your Life",
          title: "Top Electrical Products",
          highlight: "Efficiency at Its Best",
        };
      case "School Items":
        return {
          subTitle: "Back to School",
          title: "Supplies for Every Student",
          highlight: "Learn and Grow",
        };
        case "Village Corner":
          return {
            subTitle: "Authentic Traditional Goods",
            title: "Savor the Taste of Home",
            highlight: "Shop Local, Relive Traditions",
          }
      case "Tools":
        return {
          subTitle: "Build with Confidence",
          title: "Reliable Tools for All",
          highlight: "Get the Job Done",
        };
      default:
        return {
          subTitle: "Discover Yoamart",
          title: "All Your Favorite Products in One Place",
          highlight: "Shop, Save, Repeat",
        };
    }
  };

  const categoryName = getCategoryName(category[0]); // Assuming category is an array of IDs
  const content = getCategoryContent(categoryName);

  return (
    <div className="px-2 lg:px-10 flex gap-5 w-full">
      {/* Left Section */}
      <div className="min-h-20 hidden md:block md:w-[320px] space-y-10">
        <Filter
          category={categoryData}
          handleFilter={handleFilter}
          highestPrice={highestPrice}
          range={range}
          isLoading={isLoadingCategories}
          onStockChange={handleStockChange}
          onCategoryChange={handleCategorySelect}
          selectedCategory={category}
        />
      </div>

      {/* Main Section */}
      <div className="w-full md:w-[calc(100vw-320px)] flex flex-col gap-5">
        <section className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
          {/* Background Image */}
          <div className="relative">
            <Image
              src={
                category.length === 1
                  ? getCategoryImage(
                      (getCategoryName(category[0]) ||
                        "Grocery/Food Items") as CategoryNames
                    )
                  : "/images/store.jpg"
              }
              alt="banner"
              width={600}
              height={230}
              className="w-full h-full object-cover rounded-lg filter brightness-90 blur-[0.1px] "
            />
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div> */}
          </div>

          {/* Text Content */}
          <div className="absolute top-1/2 transform -translate-y-1/2  text-center -translate-x-1/2 left-1/2">
            <p className="text-xs text-white tracking-wide uppercase">
              {content.subTitle}
            </p>
            <h2 className="md:text-lg font-medium text-white">
              {content.title}
            </h2>
            <h1 className="md:text-2xl font-bold text-white">
              {content.highlight}
            </h1>
          </div>
        </section>
        {searchQueryFromUrl && (
          <p className="">showing search results for: {searchTitle}</p>
        )}

        {/* <div className="grid grid-cols-5 lg:grid-cols-10 gap-2">
          {Array.from({length: 20}).map((_, index)=>(
          <p key={index} className="flex items-center gap-2 border p-2 rounded-[30px] justify-center">
            Food <X className="w-4 h-4" />
          </p>))}
        </div> */}
        <div className="flex items-center justify-between w-full bg-[#f7f8fd] h-10 rounded-lg p-2">
          <div className="md:hidden">
            <MobileFilterSidebar
              category={categoryData}
              handleFilter={handleFilter}
              highestPrice={highestPrice}
              range={range}
              isLoading={isLoadingCategories}
              onStockChange={handleStockChange}
              onCategoryChange={handleCategorySelect}
              selectedCategory={category}
            />{" "}
          </div>
          <div className="flex items-center gap-3 md:justify-end md:w-full">
            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[100px] md:w-[180px] border-none bg-transparent">
                <SelectValue placeholder={`Sort by`} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="newest">Sort by Newest</SelectItem>
                  <SelectItem value="alphabetical">
                    Sort by Alphabetical
                  </SelectItem>
                  <SelectItem value="price-low-high">
                    Sort by Price (Low to High)
                  </SelectItem>
                  <SelectItem value="price-high-low">
                    Sort by Price (High to Low)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>{" "}
        </div>
        {isAnyLoading ? (
          <div className="w-full rounded-lg border h-[70vh] flex items-center justify-center">
            <CustomLoader />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[283px]">
            <p className="text-red-500">Failed to load All products.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 border rounded-lg mb-10">
            {productsToDisplay.length > 0 ? (
              productsToDisplay.map((data, index) => (
                <ProductCard key={index} data={data} />
              ))
            ) : (
              <div className="col-span-2 lg:col-span-4 flex justify-center items-center h-full">
                <NoItemFound title1="No products found" title2="" />
              </div>
            )}
          </div>
        )}
        <PaginationComponent
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          onPageChange={handlePageChange}
          currentPage={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
