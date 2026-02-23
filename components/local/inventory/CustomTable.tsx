// "use client";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "../../ui/input";
// import { Button } from "../../ui/button";
// import { FaFileExport } from "react-icons/fa6";
// import { Download, Loader2, Pencil, Plus, Search, Trash } from "lucide-react";
// import PaginationComponent from "../PaginationComponent";
// import { useEffect, useState } from "react";
// import {
//   useBestSellerMutation,
//   useGetAllProductQuery,
//   useIsHotMutation,
//   useLazySearchQuery,
//   useToggleStockMutation,
// } from "@/redux/appData";
// import { Product } from "@/lib/types";
// import { useSearchParams } from "next/navigation";
// import Image from "next/image";
// import { Switch } from "../../ui/switch";
// import { Label } from "../../ui/label";
// import { toast } from "sonner";
// import CustomLoader from "../CustomLoader";
// import { Checkbox } from "../../ui/checkbox";
// import { CustomDialog } from "./CustomDialog";
// import debounce from "@/hooks/use-debounce";

// export function CustomTable() {
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [category, setCategory] = useState<string[]>([]);
//   const [min, setMin] = useState<number | undefined>(undefined);
//   const [max, setMax] = useState<number | undefined>(undefined);
//   const [sort, setSort] = useState<string | undefined>("newest");
//   const [inStock, setInStock] = useState(false);
//   const [outOfStock, setOutOfStock] = useState(false);
//   const [isDialogOpen, setDialogOpen] = useState(false);
//   const [dialogData, setDialogData] = useState<Product>();
//   const [type, setType] = useState<string>("delete");

//   const [searchTitle, setSearchTitle] = useState<string>("");
//   const [search, { data: searchResultss, isLoading: isLoadingSearch }] =
//     useLazySearchQuery();
//   const searchResults: Product[] = searchResultss?.products;

//   const { debounced: debouncedSearch, clear: clearSearch } = debounce(
//     (title: string) => {
//       if (title.length >= 3) {
//         search({ title, page, limit });
//       }
//     },
//     300
//   );

//   useEffect(() => {
//     if (searchTitle) {
//       debouncedSearch(searchTitle);
//     }

//     return () => {
//       clearSearch();
//     };
//   }, [searchTitle, debouncedSearch, clearSearch]);

//   const { data, isLoading, error } = useGetAllProductQuery(
//     {
//       page,
//       limit,
//       category,
//       min,
//       max,
//       sort,
//       inStock,
//       outOfStock,
//     },
//     { refetchOnMountOrArgChange: true }
//   );

//   const products: Product[] = data ? data.products : [];

//   const productsToDisplay = searchTitle ? searchResults : products;
//   const totalPages = searchTitle
//     ? searchResultss?.pagination?.totalPages
//     : data && data.pagination.totalPages;

//   const handleNextPage = () => setPage((prev) => prev + 1);
//   const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

//   const handlePageChange = (page: number) => {
//     setPage(page);
//   };

//   const [isLoadingData, setIsLoadingData] = useState(false);

//   useEffect(() => {
//     setIsLoadingData(true);
//     const timer = setTimeout(() => setIsLoadingData(false), 500); // Simulate a delay
//     return () => clearTimeout(timer);
//   }, [category, sort, min, max, inStock, outOfStock]);

//   const [toggleStock, { isLoading: isLoadingToggle }] =
//     useToggleStockMutation();

//   const [bestSeller, { isLoading: isLoadingBestSeller }] =
//     useBestSellerMutation();

//   const [isHot, { isLoading: isLoadingHot }] = useIsHotMutation();

//   const isAnyLoading =
//     isLoadingData ||
//     isLoading ||
//     isLoadingToggle ||
//     isLoadingHot ||
//     isLoadingBestSeller;

//   console.log(productsToDisplay);

//   const handleToggleChange = async (item: Product, checked: boolean) => {
//     const updatedItem = { ...item, inStock: checked }; // Update the item locally for UI responsiveness
//     try {
//       // Make the API call to toggle the status
//       const response = await toggleStock({ productId: item._id });
//       console.log(response);
//       // Optionally handle the response from the server if needed
//       if (response?.data) {
//         toast.success("Status updated successfully");
//       } else {
//         toast.error("Error updating status");
//         // console.error("Error updating status");
//       }
//     } catch (error) {
//       // console.error("API call failed", error);
//       // Revert the toggle if the API call fails
//       updatedItem.inStock = !checked;
//     }
//   };

//   const handleBestSeller = async (item: Product, checked: boolean) => {
//     const updatedItem = { ...item, isFeatured: checked }; // Update the item locally for UI responsiveness
//     try {
//       // Make the API call to toggle the status
//       const response = await bestSeller({ productId: item._id });
//       console.log(response);
//       // Optionally handle the response from the server if needed
//       if (response?.data) {
//         toast.success(response?.data?.message || "Success");
//       } else {
//         toast.error("Error updating status");
//         // console.error("Error updating status");
//       }
//     } catch (error) {
//       // console.error("API call failed", error);
//       // Revert the toggle if the API call fails
//       updatedItem.isFeatured = !checked;
//     }
//   };

//   const handleIsHot = async (item: Product, checked: boolean) => {
//     const updatedItem = { ...item, isHot: checked }; // Update the item locally for UI responsiveness
//     try {
//       // Make the API call to toggle the status
//       const response = await isHot({ productId: item._id });
//       console.log(response);
//       // Optionally handle the response from the server if needed
//       if (response?.data) {
//         toast.success(response?.data?.message || "Success");
//       } else {
//         toast.error("Error updating status");
//         // console.error("Error updating status");
//       }
//     } catch (error) {
//       // console.error("API call failed", error);
//       // Revert the toggle if the API call fails
//       updatedItem.isHot = !checked;
//     }
//   };

//   return (
//     <>
//       <div className="flex items-center justify-between mb-4">
//         <div className="relative lg:w-[300px]">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//             }}
//           >
//             <Input
//               type="search"
//               autoComplete="off"
//               value={searchTitle}
//               onChange={(e) => setSearchTitle(e.target.value)}
//               required
//               placeholder="Search for products..."
//               className="bg-[#f3f4f7] p-2 w-full h-full "
//             />
//             <button
//               type="submit"
//               className="absolute top-1/2 right-3 transform -translate-y-1/2"
//             >
//               {isLoadingSearch ? (
//                 <Loader2 className="animate-spin w-4 h-4" />
//               ) : (
//                 <Search className="w-4 h-4" />
//               )}
//             </button>
//           </form>
//         </div>

//         <div className="flex items-center gap-4">
//           <Button>
//             <span className="hidden md:block"> Add Product</span> <Plus />
//           </Button>
//           <Button>
//             <span className="hidden md:block"> Excel</span>
//             <Download />
//           </Button>
//         </div>
//       </div>
//       {isAnyLoading ? (
//         <CustomLoader />
//       ) : (
//         <div className="overflow-x-auto w-full">
//           <Table>
//             <TableCaption>A list of all your products.</TableCaption>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-[60px]"></TableHead>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Category</TableHead>
//                 <TableHead className="">Price</TableHead>
//                 <TableHead className="">Best Sellers</TableHead>
//                 <TableHead className="">Hot Product</TableHead>
//                 <TableHead className="">Status</TableHead>
//                 <TableHead className="w-12"></TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {productsToDisplay.length > 0 &&
//                 productsToDisplay.map((item, index) => (
//                   <TableRow key={index}>
//                     <TableCell className="">
//                       <Image
//                         src={item?.image[0]}
//                         alt="product"
//                         width={60}
//                         height={60}
//                         className="rounded-lg bg-gray-400"
//                       />
//                     </TableCell>
//                     <TableCell>{item?.name}</TableCell>
//                     <TableCell>{item?.categoryId?.name}</TableCell>
//                     <TableCell className="">
//                       {new Intl.NumberFormat("en-NG", {
//                         style: "currency",
//                         currency: "NGN",
//                       }).format(item?.price)}
//                     </TableCell>
//                     <TableCell className="text-center w-12">
//                       <Checkbox
//                         checked={item?.isFeatured}
//                         onClick={(e) =>
//                           handleBestSeller(
//                             item,
//                             (e.target as HTMLInputElement).checked
//                           )
//                         }
//                       />
//                     </TableCell>
//                     <TableCell className="text-center w-12">
//                       <input
//                         type="radio"
//                         className="h-3 w-3"
//                         checked={item?.isHot}
//                         onChange={(e) =>
//                           handleIsHot(
//                             item,
//                             (e.target as HTMLInputElement).checked
//                           )
//                         }
//                       />
//                     </TableCell>
//                     <TableCell className="">
//                       <div className="flex items-center space-x-2">
//                         <Switch
//                           id="in-stock"
//                           checked={item?.inStock}
//                           onClick={(e) =>
//                             handleToggleChange(
//                               item,
//                               (e.target as HTMLInputElement).checked
//                             )
//                           }
//                         />

//                         <Label htmlFor="in-stock" className="text-xs">
//                           In stock
//                         </Label>
//                       </div>
//                     </TableCell>
//                     <TableCell className="space-y-5 w-12">
//                       <Pencil
//                         onClick={() => {
//                           setDialogData(item);
//                           setDialogOpen(true);
//                           setType("edit");
//                         }}
//                         className="w-4 h-4 cursor-pointer"
//                       />
//                       <Trash
//                         onClick={() => {
//                           setDialogData(item);
//                           setDialogOpen(true);
//                           setType("delete");
//                         }}
//                         className="w-5 h-5 cursor-pointer text-red-500"
//                       />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//             </TableBody>
//           </Table>
//         </div>
//       )}
//       <PaginationComponent
//         handleNextPage={handleNextPage}
//         handlePrevPage={handlePrevPage}
//         onPageChange={handlePageChange}
//         currentPage={page}
//         totalPages={totalPages}
//       />{" "}
//       <CustomDialog
//         open={isDialogOpen}
//         onOpenChange={(open: boolean) => setDialogOpen(open)}
//         title={"product"}
//         type={type}
//         data={dialogData}
//       />
//     </>
//   );
// }

import React from 'react'

export default function CustomTable() {
  return (
    <div>CustomTable</div>
  )
}

