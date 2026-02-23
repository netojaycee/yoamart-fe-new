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
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useGetAllCategoryQuery } from "@/redux/appData";
import { Category, Product } from "@/lib/types";
import Image from "next/image";
import CustomLoader from "@/components/local/CustomLoader";
import { CustomDialog } from "@/components/local/inventory/CustomDialog";

export default function AllCategories() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<Category | Product>();
  const [type, setType] = useState<string>("delete");

  const { data, isLoading } = useGetAllCategoryQuery(undefined);
  const categoryToDisplay: Category[] = data ? data.category : [];

  const isAnyLoading = isLoading;

  // console.log(categoryToDisplay);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 justify-end w-full">
          <Button
            onClick={() => {
              setDialogOpen(true);
              setType("add");
            }}
          >
            <span className="hidden md:block"> Add Category</span> <Plus />
          </Button>
        </div>
      </div>
      {isAnyLoading ? (
        <CustomLoader />
      ) : (
        <div className="overflow-x-auto w-full bg-white rounded-lg shadow-md p-3">
          <Table>
            <TableCaption>A list of all your categories.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {categoryToDisplay.length > 0 &&
                categoryToDisplay.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="">
                      <Image
                        src={item?.image}
                        alt="product"
                        width={60}
                        height={60}
                        className="rounded-lg bg-gray-400"
                      />
                    </TableCell>
                    <TableCell>{item?.name}</TableCell>

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

      <CustomDialog
        open={isDialogOpen}
        onOpenChange={(open: boolean) => setDialogOpen(open)}
        title={"category"}
        type={type}
        data={dialogData}
      />
    </>
  );
}
