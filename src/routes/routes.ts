export const ROUTES = {
  HOME: "/home",
  LOGIN: "/signin",
  REGISTER: "/signup",
  DASHBOARD: "/dashboard",
  TICKETS: "/tickets",
  CUSTOMERS: "/customers",
  STOCK: "/stock",
  NEW_CUSTOMER: "/customers/new",
  CHAT: "/chat",
  REPORTS: "/reports",
  SETTINGS: "/settings",
  PROFILE: "/profile",
} as const;

export type AppRoutes = typeof ROUTES;