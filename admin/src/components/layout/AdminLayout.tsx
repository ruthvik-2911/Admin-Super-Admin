import * as React from "react"
import { Outlet, useLocation } from "react-router-dom"
import DashboardLayout from "./DashboardLayout"

const routeMap: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/ads": "Ads Manager",
  "/admin/publishers": "Publishers",
  "/admin/analytics": "Analytics",
  "/admin/tickets": "Support Hub",
  "/admin/payments": "Payments",
};

export default function AdminLayout() {
  const location = useLocation();
  
  // Determine active item from the route map
  let activeItem = "Dashboard";
  
  // Sort paths by length descending to match the most specific path first
  const sortedPaths = Object.keys(routeMap).sort((a, b) => b.length - a.length);
  for (const path of sortedPaths) {
    if (location.pathname.startsWith(path)) {
      activeItem = routeMap[path];
      break;
    }
  }

  return (
    <DashboardLayout activeItem={activeItem}>
      {/* We add w-full to ensure Outlet takes full width of the container */}
      <div className="w-full">
        <Outlet />
      </div>
    </DashboardLayout>
  )
}
