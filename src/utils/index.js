const routeMap = {
  Home: "/",
  Catalog: "/catalog",
  ProductDetail: "/product",
  Search: "/search",
  Cart: "/cart",
  Checkout: "/checkout",
  OrderConfirmation: "/order-confirmation",
  About: "/about",
  Contact: "/contact",
  CGV: "/cgv",
  Shipping: "/shipping",
  Returns: "/returns",
  AdminDashboard: "/admin",
  AdminProducts: "/admin/products",
  AdminOrders: "/admin/orders",
  AdminSettings: "/admin/settings",
};

export function createPageUrl(identifier = "Home") {
  if (identifier.startsWith("/")) {
    return identifier;
  }

  const [key, query] = identifier.split("?");
  const basePath = routeMap[key] ?? "/";
  return query ? `${basePath}?${query}` : basePath;
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export { routeMap };

