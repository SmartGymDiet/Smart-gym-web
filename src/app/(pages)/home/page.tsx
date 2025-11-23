"use client";

import HeaderTop from "@/app/components/headerTop";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderTop />
      <div className="px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Olá</h1>
            <p className="text-gray-600 text-sm">
              Banco de imagens
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
