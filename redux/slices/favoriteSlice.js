import { toast } from "sonner";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriteItems:
    typeof window !== "undefined" && localStorage.getItem("favoriteItemsYoa")
      ? JSON.parse(localStorage.getItem("favoriteItemsYoa"))
      : [],
};

const favoritesSlice = createSlice({
  name: "favoritesYoa",
  initialState,
  reducers: {
    addToFavorites(state, action) {
      const { _id } = action.payload;
      if (!state.favoriteItems.some((item) => item._id === _id)) {
        state.favoriteItems.push(action.payload);
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "favoriteItemsYoa",
            JSON.stringify(state.favoriteItems)
          );
        }
        toast.success(`${action.payload.name} added to Wishlist`, {
          // description: "Wishlist updated",
          action: {
            label: "View wishlist",
            onClick: () => router.push("/wishlist"),
          },
        });
      }

      // console.log("slice", state.favoriteItems);
    },
    removeFromFavorites(state, action) {
      const nextFavoriteItems = state.favoriteItems.filter(
        (item) => item._id !== action.payload._id
      );

      state.favoriteItems = nextFavoriteItems;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "favoriteItemsYoa",
          JSON.stringify(state.favoriteItems)
        );
      }
      toast.success(`${action.payload.name} removed from Wishlist`, {
        // description: "Wishlist updated",
        action: {
          label: "View wishlist",
          onClick: () => router.push("/wishlist"),
        },
      });
    },
  },
});

export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
