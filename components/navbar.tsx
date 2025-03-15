"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Search,
  Bell,
  User as UserIcon,
  ChevronDown,
  Film,
  Tv,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [user, setUser] = useState<{ nome: string; url_avatar: string } | null>(
    null
  );
  const router = useRouter();
  const baseUrl = "https://api.streamhivex.icu";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Recupera os dados do usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Gera a URL completa do avatar
  const avatarUrl =
    user && user.url_avatar
      ? user.url_avatar.startsWith("http")
        ? user.url_avatar
        : `${baseUrl}/${user.url_avatar.replace(/^\//, "")}`
      : "";

  const handleSair = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-green-500">
                Streamify
              </h1>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="hover:bg-white/10">
                <Film className="w-4 h-4 mr-2" /> Filmes
              </Button>
              <Button variant="ghost" className="hover:bg-white/10">
                <Tv className="w-4 h-4 mr-2" /> Séries de TV
              </Button>
              <Button variant="ghost" className="hover:bg-white/10">
                <Trophy className="w-4 h-4 mr-2" /> Premiações
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    type="text"
                    placeholder="Pesquisar..."
                    className="bg-transparent border-b border-gray-300 focus:outline-none text-white mr-2"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen((prev) => !prev)}
                className="hover:bg-white/10"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="hover:bg-white/10">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setIsProfilePopupOpen((prev) => !prev)}
                className="hover:bg-white/10 flex items-center gap-2"
              >
                {user && avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.nome}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">
                  {user ? user.nome : "Perfil"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              <AnimatePresence>
                {isProfilePopupOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-background p-4 rounded shadow-lg z-50"
                  >
                    <p className="text-sm text-gray-200">
                      {user ? user.nome : "Usuário"}
                    </p>
                    <Link
                      href="/account"
                      className="block text-sm mt-2 hover:underline"
                      onClick={() => setIsProfilePopupOpen(false)}
                    >
                      Minha Conta
                    </Link>
                    <button
                      className="text-sm mt-2 hover:underline"
                      onClick={handleSair}
                    >
                      Sair
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
