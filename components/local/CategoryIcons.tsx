import { Palmtree } from "lucide-react";
import {
  FaAppleAlt,
  FaBroom,
  FaGlassMartiniAlt,
  FaRegSmile,
  FaSchool,
  FaWrench,
} from "react-icons/fa";
import { MdElectricalServices } from "react-icons/md";

export type CategoryNames =
  | "Grocery/Food Items"
  | "Personal care items"
  | "Household items"
  | "Drinks"
  | "Electrical Items"
  | "School Items"
  | "Village Corner"
  | "Tools";

export const categoryIcons: Record<CategoryNames, JSX.Element> = {
  "Grocery/Food Items": (
    <FaAppleAlt className="w-5 h-5 text-ysecondary group-hover:text-white" />
  ),
  "Personal care items": (
    <FaRegSmile className="w-5 h-5 text-ysecondary group-hover:text-white" />
  ),
  "Household items": (
    <FaBroom className="w-5 h-5 text-ysecondary group-hover:text-white" />
  ),
  Drinks: (
    <FaGlassMartiniAlt className="w-5 h-5 text-ysecondary group-hover:text-white" />
  ),

  "Electrical Items": (
    <MdElectricalServices className="w-5 h-5 text-ysecondary group-hover:text-white" />
  ),
  "School Items": (
    <FaSchool className="w-5 h-5 text-ysecondary group-hover:text-white" />
  ),
  "Village Corner": (
    <Palmtree className="w-5 h-5 text-ysecondary group-hover:text-white" />
  ),
  Tools: (
    <FaWrench className="w-5 h-5 text-ysecondary group-hover:text-white" />
  ),
};

export const categoryImages: Record<CategoryNames, string> = {
  "Grocery/Food Items": "/images/1800--700food@2x.jpg",
  "Personal care items": "/images/1800--700careitems@2x.jpg",
  "Household items": "/images/1800--700householditems@2x.jpg",
  Drinks: "/images/1800--700bannercategorydrinks@1,5x.jpg",
  "Electrical Items": "/images/1800--700electricalitems@2x.jpg",
  "School Items": "/images/1800--700schoolitems@2x.jpg",
  "Village Corner": "/images/1800--700garri.jpg",
  Tools: "/images/1800--700tools@2x.jpg",
};

// Function to get the image for a category
export const getCategoryImage = (category: CategoryNames): string => {
  return categoryImages[category];
};
