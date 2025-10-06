// app/dashboard/layout.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulation de vérification d'authentification
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        router.push("/login");
        return;
      }

      // Simulation de récupération des données utilisateur\
      // get the profile data :
      const response = await fetch("/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const result = await response.json();
      // log the data 
      console.log(result.data);

      const localuser = JSON.parse(localStorage.getItem("user"));
      const userData =result.data;
      localStorage.setItem("userData",JSON.stringify(userData))

      setUser(userData);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
