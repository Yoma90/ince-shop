import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Pages/Home";
import Catalog from "./Pages/Catalog";
import ProductDetail from "./Pages/ProductDetail";
import Search from "./Pages/Search";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import OrderConfirmation from "./Pages/OrderConfirmation";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import CGV from "./Pages/CGV";
import Shipping from "./Pages/Shipping";
import Returns from "./Pages/Returns";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminProducts from "./Pages/AdminProducts";
import AdminOrders from "./Pages/AdminOrders";
import AdminSettings from "./Pages/AdminSettings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "catalog", element: <Catalog /> },
      { path: "product", element: <ProductDetail /> },
      { path: "search", element: <Search /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "order-confirmation", element: <OrderConfirmation /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "cgv", element: <CGV /> },
      { path: "shipping", element: <Shipping /> },
      { path: "returns", element: <Returns /> },
      {
        path: "admin",
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "products", element: <AdminProducts /> },
          { path: "orders", element: <AdminOrders /> },
          { path: "settings", element: <AdminSettings /> },
        ],
      },
    ],
  },
]);

export default router;

