"use client";

import { UserProvider } from "./context/UserContext";
import UserPage from "./components/UserPage";

export default function Page() {
  return (
    <UserProvider>
      <UserPage />
    </UserProvider>
  );
}
