'use client';

import { useState } from 'react';
import { Menu, User, Settings, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

interface AppBarProps {
  title: string;
  onMenuToggle: () => void;
}

export default function AppBar({ title, onMenuToggle }: AppBarProps) {
  const [online, setOnline] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuth();

  const handleStatusToggle = () => setOnline(!online);
  const handleSignOut = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between px-6 shadow-lg lg:pl-24">
      <div className="flex items-center space-x-3">
        <Menu 
          className="w-6 h-6 cursor-pointer lg:hidden" 
          onClick={onMenuToggle}
        />
        <span className="text-lg font-semibold">{title}</span>
      </div>

      <div className="flex items-center space-x-4 relative">
        <div
          onClick={handleStatusToggle}
          className={`cursor-pointer px-2 py-1 rounded-full text-xs font-medium ${
            online ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {online ? 'Online' : 'Offline'}
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
