import { ROUTES } from "@/routes/routes";
import {
  CodeXml,
  ImageIcon,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function HeaderTop() {
  const pathname = usePathname();
  const [online, setOnline] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleStatusToggle = () => setOnline(!online);

  const menuItems = [
    { icon: ImageIcon, href: ROUTES.HOME, label: "Imagens" },
  ];

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2">
        <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
        <span className="font-bold text-lg">Smart Gym</span>
      </div>
      <nav className="flex gap-8 text-gray-700 font-medium">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href="#"
              className={`transition-colors px-1
              ${
                isActive
                  ? "text-indigo-700 font-bold border-b-2 border-indigo-700"
                  : "hover:text-indigo-500"
              }
            `}
            >
              <div className="flex flex-row gap-1">
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center space-x-4 relative">
        <div
          onClick={handleStatusToggle}
          className={`cursor-pointer px-2 py-1 rounded-full text-xs font-medium ${
            online ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {online ? "Online" : "Offline"}
        </div>

        <div className="relative">
          <Image
            src="https://github.com/joaoliotti.png"
            alt="Foto"
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-md z-10 animate-fade-in">
              <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100">
                <User className="w-4 h-4 mr-2" /> Perfil
              </button>
              <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100">
                <Settings className="w-4 h-4 mr-2" /> Configurações
              </button>
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                onClick={() => {}}
              >
                <LogOut className="w-4 h-4 mr-2" /> Sair
              </button>
              <div className="border-t border-gray-200 my-2 flex items-center flex-row justify-center">
                <CodeXml size={20}/>
                <p className="ml-2 mt-2 mb-2 text-sm text-center">Versão 1.0.0</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
