"use client";

import { AdminProvider } from "./context/AdminContext";
import AdminPage from "./components/AdminPage";

export default function Page() {
  return (
    <AdminProvider>
      <AdminPage />
    </AdminProvider>
  );
}
