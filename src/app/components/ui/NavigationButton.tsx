'use client'

import { useRouter } from "next/navigation"
import { ROUTES } from "@/routes/routes"

export default function NavigationButton() {
  const router = useRouter()

  return (
    <button 
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800" 
      onClick={() => router.push(ROUTES.DASHBOARD)}
    >
      Ir para Dashboard
    </button>
  )
}
