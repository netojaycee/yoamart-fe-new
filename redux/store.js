// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { productsApi } from "./appData";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import favoritesReducer from "./slices/favoriteSlice";


const persistConfig = {
  key: "authYoa",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    auth: persistedAuthReducer,
    // user: userReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(productsApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
