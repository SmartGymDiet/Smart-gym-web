"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL, ROUTES } from "@/routes/routes";
import { toast } from "react-toastify";
import {
  Headset,
  Mail,
  Lock,
  Eye,
  LogIn,
  ShieldCheck,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const images = ["/images/logo.png", "/images/logo.png", "/images/logo.png"];

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${ROUTES.API.AUTH}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.name);
        router.push(ROUTES.HOME);
        toast.success(`${data.message} !`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
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
            <p className="text-gray-500">Faça login para acessar sua conta</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
                    <EyeOff className="h-5 w-5 text-gray-400 cursor-pointer" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 cursor-pointer" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`cursor-pointer w-full flex justify-center items-center py-2.5 px-4 rounded-md text-white ${
                loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : (
                <LogIn className="h-5 w-5 mr-2" />
              )}
              {loading ? "Carregando..." : "Entrar"}
            </button>
          </form>

          {/* <p className="mt-6 text-center text-sm text-gray-500">
            Não tem uma conta?{" "}
            <Link
              href={ROUTES.REGISTER}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Cadastre-se gratuitamente
            </Link>
          </p> */}

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
            alt="Login showcase"
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
