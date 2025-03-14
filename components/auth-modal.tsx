"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simula chamada à API
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success(isLogin ? "Bem-vindo de volta!" : "Conta criada com sucesso!");
    setLoading(false);
    onClose();
    router.push("/dashboard");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="glass rounded-xl p-8 shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-green-500">
                {isLogin ? "Bem-vindo de volta" : "Criar Conta"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Nome de usuário"
                      className="pl-10 glass border-0"
                      required
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="pl-10 glass border-0"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Senha"
                    className="pl-10 glass border-0"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full glow-effect bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={loading}
                >
                  {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar Conta"}
                </Button>
              </form>
              <p className="text-center mt-4 text-sm text-gray-400">
                {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1 text-blue-500 hover:text-blue-400"
                >
                  {isLogin ? "Registrar" : "Entrar"}
                </button>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
