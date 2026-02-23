import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState = {
  cartItems:
    typeof window !== "undefined" && localStorage.getItem("cartItemsYoa")
      ? JSON.parse(localStorage.getItem("cartItemsYoa"))
      : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

const cartSlice = createSlice({
  name: "cartYoa",
  initialState,
  reducers: {
    

    addToCart(state, action) {
      const { datas, quantity = 1, router } = action.payload;
    
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === datas._id
      );
    
      if (itemIndex >= 0) {
        // Check if adding the quantity exceeds available stock
        const currentQuantity = state.cartItems[itemIndex].cartQuantity;
        const newQuantity = currentQuantity + quantity;
    
        if (newQuantity > datas.quantity) {
          // Show error toast
          toast.error(`Maximum quantity of ${datas.name} reached`, {
            description: `You can only add up to ${datas.quantity} items.`,
            action: {
              label: "View cart",
              onClick: () => router.push("/cart"),
            },
          });
          return;
        }
    
        // Update quantity if item exists
        state.cartItems[itemIndex].cartQuantity = newQuantity;
    
        toast.success(`${newQuantity} x ${datas.name}`, {
          description: "Cart updated",
          action: {
            label: "View cart",
            onClick: () => router.push("/cart"),
          },
        });
      } else {
        // Check if the initial quantity exceeds available stock
        if (quantity > datas.quantity) {
          toast.error(`Cannot add more than ${datas.quantity} of ${datas.name}`, {
            description: `Only ${datas.quantity} items available.`,
            action: {
              label: "View cart",
              onClick: () => router.push("/cart"),
            },
          });
          return;
        }
    
        // Add new item if not found in cart
        const tempProduct = { ...datas, cartQuantity: quantity };
        state.cartItems.push(tempProduct);
    
        toast.success(`${datas.name} added to Cart`, {
          action: {
            label: "View cart",
            onClick: () => router.push("/cart"),
          },
        });
      }
    
      // Update cart totals
      state.cartTotalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.cartQuantity,
        0
      );
    
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItemsYoa", JSON.stringify(state.cartItems));
      }
    },
    
    removeFromCart(state, action) {
      const nextCartItems = state.cartItems.filter(
        (cartItem) => cartItem._id !== action.payload._id
      );

      state.cartItems = nextCartItems;

      // Recalculate totals
      state.cartTotalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.cartQuantity,
        0
      );

      toast.error(`${action.payload.name} removed from Cart`);

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItemsYoa", JSON.stringify(state.cartItems));
      }
    },

    decreaseCartQuantity(state, action) {
      const { router } = action.payload;

      const itemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem._id === action.payload._id
      );

      if (itemIndex >= 0) {
        if (state.cartItems[itemIndex].cartQuantity > 1) {
          // Decrease the quantity
          state.cartItems[itemIndex].cartQuantity -= 1;

          const updatedQuantity = state.cartItems[itemIndex].cartQuantity;

          toast.success(
            `${updatedQuantity} x ${state.cartItems[itemIndex].name}`,
            {
              description: "Cart updated",
              action: {
                label: "View cart",
                onClick: () => router.push("/cart"),
              },
            }
          );
        } else {
          // Remove the item if quantity is 1
          state.cartItems = state.cartItems.filter(
            (cartItem) => cartItem._id !== action.payload._id
          );

          toast.error(`${action.payload.name} removed from Cart`);
        }
      }

      // Update cart totals
      state.cartTotalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.cartQuantity,
        0
      );

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItemsYoa", JSON.stringify(state.cartItems));
      }
    },

    clearCart(state) {
      state.cartItems = [];
      state.cartTotalAmount = 0;
      state.cartTotalQuantity = 0;

      // toast.success("Cart cleared");

      if (typeof window !== "undefined") {
        localStorage.setItem("cartItemsYoa", JSON.stringify(state.cartItems));
      }
    },

    getTotals(state) {
      const { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, cartQuantity } = cartItem;
          const itemTotal = price * cartQuantity;

          cartTotal.total += itemTotal;
          cartTotal.quantity += cartQuantity;

          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );

      state.cartTotalAmount = total;
      state.cartTotalQuantity = quantity;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  decreaseCartQuantity,
  clearCart,
  getTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
