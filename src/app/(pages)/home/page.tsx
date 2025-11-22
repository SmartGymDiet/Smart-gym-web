"use client";

import { useEffect, useState } from "react";
import HeaderTop from "@/app/components/headerTop";
import { ROUTES } from "@/routes/routes";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const { getToken, getUser } = useAuth();

  useEffect(() => {
    const userId = getUser();
    if (userId) {
      setUserId(userId);
    }

    async function getNameUser() {
      try {
        const token = getToken();
        if (!token) return;

        const userId = localStorage.getItem("userId")
        const response = await fetch(`${ROUTES.API.USERS}/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();

        const name =
          data?.user?.name ||
          data?.name ||
          (Array.isArray(data) ? data[0]?.name : undefined);

        if (name) setUserName(name);
      } catch {
        //sem condição
      }
    }
    getNameUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderTop />
      <div className="px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Olá, {userName}</h1>
            <p className="text-gray-600 text-sm">
              Para acessar os contadores de tickets é só expandir os indicadores
              que deseja visualizar e utilizar normalmente
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img className="w-64 h-64" src="/images/mascot-feliz.png" alt="Logo" />
          <img className="w-64 h-64" src="/images/mascot-triste.png" alt="Logo" />
        </div>
      </div>
    </div>
  );
}
