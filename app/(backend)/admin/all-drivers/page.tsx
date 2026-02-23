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
import { useGetDriversQuery } from "@/redux/appData";
import { Category, Driver, Product } from "@/lib/types";
import CustomLoader from "@/components/local/CustomLoader";
import { CustomDialog } from "@/components/local/inventory/CustomDialog";

export default function AllDrivers() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<Category | Product | Driver>();
  const [type, setType] = useState<string>("delete");

  const { data, isLoading } = useGetDriversQuery(undefined);

  const isAnyLoading = isLoading;
  const drivers: Driver[] = data?.drivers;
  // console.log("Ggg", drivers);

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
            <span className="hidden md:block"> Add Driver</span> <Plus />
          </Button>
        </div>
      </div>
      {isAnyLoading ? (
        <CustomLoader />
      ) : (
        <div className="overflow-x-auto w-full bg-white rounded-lg shadow-md p-3">
          <Table>
            <TableCaption>A list of all your drivers.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {drivers && drivers.length > 0  ? 
                drivers.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item?.name}</TableCell>
                    <TableCell>{item?.phone}</TableCell>

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
                )):
              <div className="">No drivers Found</div>
              }
            </TableBody>
          </Table>
        </div>
      )}

      <CustomDialog
        open={isDialogOpen}
        onOpenChange={(open: boolean) => setDialogOpen(open)}
        title={"driver"}
        type={type}
        data={dialogData}
      />
    </>
  );
}
