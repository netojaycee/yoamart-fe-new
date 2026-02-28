"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Plus, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useGetAllProductQuery,
  useLazySearchQuery,
} from "@/redux/appData";
import { Category, Product } from "@/lib/types";
import Image from "next/image";
import debounce from "@/hooks/use-debounce";
import CustomLoader from "@/components/local/CustomLoader";
import PaginationComponent from "@/components/local/PaginationComponent";
import { CustomDialog } from "@/components/local/inventory/CustomDialog";

export default function PerishableProducts() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<Product | Category>();
  const [type, setType] = useState<string>("delete");

  const [searchTitle, setSearchTitle] = useState<string>("");
  const [search, { data: searchResultss, isLoading: isLoadingSearch }] =
    useLazySearchQuery();
  const searchResults: Product[] = searchResultss?.products;

  const { debounced: debouncedSearch, clear: clearSearch } = debounce(
    (title: string) => {
      if (title.length >= 3) {
        search({ title, page, limit });
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

  const { data, isLoading } = useGetAllProductQuery(
    {
      page,
      limit,
      type: "perishable",
    },
    { refetchOnMountOrArgChange: true }
  );

  const products: Product[] = data ? data.products : [];

  const productsToDisplay = searchTitle ? searchResults : products;
  const totalPages = searchTitle
    ? searchResultss?.pagination?.totalPages
    : data && data.pagination.totalPages;

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const isAnyLoading = isLoading;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative lg:w-[300px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Input
              type="search"
              autoComplete="off"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              required
              placeholder="Search for perishable products..."
              className="bg-[#f3f4f7] p-2 w-full h-full "
            />
            <button
              type="submit"
              className="absolute top-1/2 right-3 transform -translate-y-1/2"
            >
              {isLoadingSearch ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              setDialogOpen(true);
              setType("add");
            }}
          >
            <span className="hidden md:block"> Add Perishable Product</span> <Plus />
          </Button>
        </div>
      </div>
      {isAnyLoading ? (
        <CustomLoader />
      ) : (
        <div className="overflow-x-auto w-full bg-white rounded-lg shadow-md p-3">
          <Table>
            <TableCaption>A list of all your perishable products.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="">Price</TableHead>
                <TableHead className="">Description</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {productsToDisplay.length > 0 &&
                productsToDisplay.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="">
                      <Image
                        src={item?.image[0]}
                        alt="product"
                        width={60}
                        height={60}
                        className="rounded-lg bg-gray-400"
                      />
                    </TableCell>
                    <TableCell>{item?.name}</TableCell>
                    <TableCell className="">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(item?.price)}
                    </TableCell>
                    <TableCell className="text-sm truncate max-w-xs">
                      {item?.description}
                    </TableCell>
                    <TableCell className="space-y-5 w-12">
                      <Pencil
                        onClick={() => {
                          setDialogData(item);
                          setDialogOpen(true);
                          setType("edit");
                        }}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <Trash
                        onClick={() => {
                          setDialogData(item);
                          setDialogOpen(true);
                          setType("delete");
                        }}
                        className="w-5 h-5 cursor-pointer text-red-500"
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
      <PaginationComponent
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        onPageChange={handlePageChange}
        currentPage={page}
        totalPages={totalPages}
      />
      <CustomDialog
        open={isDialogOpen}
        onOpenChange={(open: boolean) => setDialogOpen(open)}
        title={"perishable_product"}
        type={type}
        data={dialogData}
      />
    </>
  );
}
