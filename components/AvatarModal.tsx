"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const baseUrl = "https://api.streamhivex.icu";
const PAGE_SIZE = 10;

interface AvatarsData {
  perfil: string[];
  perfix: string[];
}

interface AvatarModalProps {
  onSelect: (avatarPath: string) => void;
  onClose: () => void;
}

export function AvatarModal({ onSelect, onClose }: AvatarModalProps) {
  const [avatars, setAvatars] = useState<AvatarsData | null>(null);
  const [perfilPage, setPerfilPage] = useState(1);
  const [perfixPage, setPerfixPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAvatars() {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/auth/avatars`);
        if (res.ok) {
          const data = await res.json();
          // Considerando que a resposta vem em { status: 200, data: { perfil: [...], perfix: [...] } }
          setAvatars(data.data || data);
        } else {
          toast.error("Erro ao carregar avatares");
        }
      } catch (error) {
        console.error("Erro ao buscar avatares:", error);
        toast.error("Erro na conexão com o servidor");
      }
      setLoading(false);
    }
    fetchAvatars();
  }, []);

  // Gera a URL completa para o avatar de acordo com sua categoria.
  const getAvatarUrl = (filename: string, category: "perfil" | "perfix") => {
    // Para "perfil", usamos a pasta "assets/perfil" e para "perfix" a pasta "assets/perfilx"
    const folder = category === "perfix" ? "perfilx" : "perfil";
    return `${baseUrl}/assets/${folder}/${filename}`;
  };

  // Paginação: exibe os itens até PAGE_SIZE * page
  const perfilAvatars = avatars?.perfil?.slice(0, perfilPage * PAGE_SIZE) || [];
  const perfixAvatars = avatars?.perfix?.slice(0, perfixPage * PAGE_SIZE) || [];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-background p-6 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Escolha seu Avatar</h2>
            <button onClick={onClose} className="text-white hover:underline">
              Fechar
            </button>
          </div>
          {loading && <p className="text-gray-300">Carregando avatares...</p>}
          {!loading && avatars && (
            <div className="space-y-6">
              {/* Seção Perfil */}
              <div>
                <h3 className="text-lg text-gray-200 mb-2">Perfil</h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                  {perfilAvatars.map((avatar) => {
                    const url = getAvatarUrl(avatar, "perfil");
                    return (
                      <img
                        key={avatar}
                        src={url}
                        alt="Avatar"
                        onClick={() =>
                          // Monta a _path_ relativa para armazenar: "assets/perfil/filename.png"
                          onSelect(`assets/perfil/${avatar}`)
                        }
                        className="cursor-pointer w-16 h-16 rounded-full object-cover border-2 border-transparent hover:border-blue-500"
                      />
                    );
                  })}
                </div>
                {avatars.perfil.length > perfilAvatars.length && (
                  <button
                    onClick={() => setPerfilPage(perfilPage + 1)}
                    className="mt-2 text-blue-400 hover:underline"
                  >
                    Carregar mais
                  </button>
                )}
              </div>
              {/* Seção Perfix */}
              <div>
                <h3 className="text-lg text-gray-200 mb-2">PerfilX</h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                  {perfixAvatars.map((avatar) => {
                    const url = getAvatarUrl(avatar, "perfix");
                    return (
                      <img
                        key={avatar}
                        src={url}
                        alt="Avatar"
                        onClick={() =>
                          // Monta a _path_ relativa para armazenar: "assets/perfilx/filename.png"
                          onSelect(`assets/perfilx/${avatar}`)
                        }
                        className="cursor-pointer w-16 h-16 rounded-full object-cover border-2 border-transparent hover:border-blue-500"
                      />
                    );
                  })}
                </div>
                {avatars.perfix.length > perfixAvatars.length && (
                  <button
                    onClick={() => setPerfixPage(perfixPage + 1)}
                    className="mt-2 text-blue-400 hover:underline"
                  >
                    Carregar mais
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
