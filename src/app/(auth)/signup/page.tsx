"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL, ROUTES } from "@/routes/routes";
import { toast } from "react-toastify";
import {
  Eye,
  EyeOff,
  Headset,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="12"
    height="12"
    viewBox="0 0 32 32"
  >
    <path d="M 16.003906 14.0625 L 16.003906 18.265625 L 21.992188 18.265625 C 21.210938 20.8125 19.082031 22.636719 16.003906 22.636719 C 12.339844 22.636719 9.367188 19.664063 9.367188 16 C 9.367188 12.335938 12.335938 9.363281 16.003906 9.363281 C 17.652344 9.363281 19.15625 9.96875 20.316406 10.964844 L 23.410156 7.867188 C 21.457031 6.085938 18.855469 5 16.003906 5 C 9.925781 5 5 9.925781 5 16 C 5 22.074219 9.925781 27 16.003906 27 C 25.238281 27 27.277344 18.363281 26.371094 14.078125 Z"></path>
  </svg>
);

const MicrosoftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M11.5 21.5h-11v-11h11v11zm-10-1h9v-9h-9v9zm11.5-10.5h-11v-11h11v11zm-10-1h9v-9h-9v9zm10.5-10.5h11v11h-11v-11zm1 1h9v9h-9v-9zm-1 10.5h11v11h-11v-11zm1 1h9v9h-9v-9z" />
  </svg>
);

const images = ["/images/logo.png", "/images/logo.png", "/images/logo.png"];

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch(`${ROUTES.API.AUTH}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(ROUTES.LOGIN);
        toast.success(data.message);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((err: any) => {
            toast.error(`${err.message}`);
          });
        }
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor");
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LADO ESQUERDO - FORM */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-indigo-600 rounded-lg p-3 mb-4">
              <Headset className="text-white h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Smart Chamado</h1>
            <p className="text-gray-500">Crie sua conta</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Nome
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome"
                  className="pl-10 p-2 block w-full rounded-md text-gray-900 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                E-mail
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10 p-2 block w-full rounded-md text-gray-900 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="pl-10 p-2 block w-full rounded-md text-gray-900 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full flex justify-center items-center bg-indigo-600 text-white py-2.5 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Criar
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                ou cadastrar com:
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="cursor-pointer w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              <GoogleIcon />
              <span className="ml-2">Google</span>
            </button>
            <button className="cursor-pointer w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              <MicrosoftIcon />
              <span className="ml-2">Microsoft</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Já tem uma conta?{" "}
            <Link
              href={ROUTES.LOGIN}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Entrar
            </Link>
          </p>

          <div className="mt-6 flex justify-center items-center text-sm text-gray-500">
            <ShieldCheck className="h-5 w-5 mr-2 text-green-600" />
            <span>Dados protegidos com criptografia SSL</span>
          </div>
        </div>
      </div>

      {/* LADO DIREITO - SLIDESHOW */}
      <div className="relative hidden md:flex items-center justify-center bg-gray-100 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={images[index]}
            alt="Signup showcase"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
            className="absolute w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-indigo-900/40" />
        <h2 className="absolute bottom-10 left-10 text-white text-sm font-semibold drop-shadow-lg">
          "Não basta conquistar a sabedoria, é preciso usá-la." 💡
        </h2>
      </div>
    </div>
  );
}
