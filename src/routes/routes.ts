export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3333/api"
    : process.env.API_BASE_URL || "http://localhost:3333/api/v1";

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
  API: {
    AUTH: `${API_BASE_URL}/auth`,
    TICKETS: `${API_BASE_URL}/calleds`,
    CUSTOMERS: `${API_BASE_URL}/customers`,
    STOCK: `${API_BASE_URL}/stock`,
    USERS: `${API_BASE_URL}/users`,
    CHATS: `${API_BASE_URL}/chats`,
    NEWS: `${API_BASE_URL}/news`,
  },
} as const;

export type AppRoutes = typeof ROUTES;
export type FrontendRoutes = keyof Omit<typeof ROUTES, "API">;
export type APIRoutes = keyof typeof ROUTES.API;
