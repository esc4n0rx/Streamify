"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const baseUrl = "https://api.streamhivex.icu";

interface Perfil {
  id: number;
  nome: string;
  avatar: string;
  pin?: string; // Pode vir vazio ou nulo se não houver PIN
}

interface ProfileSelectorProps {
  onSelect: (perfil: Perfil) => void;
  user: { nome: string; url_avatar: string };
}


export function ProfileSelector({ onSelect }: ProfileSelectorProps) {
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(false);

  // Busca a lista de perfis
  useEffect(() => {
    async function fetchPerfis() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/api/perfis`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        // Supondo que a resposta retorne um array de perfis
        if (Array.isArray(data)) {
          setPerfis(data);
        } else {
          // Se os perfis estiverem aninhados em uma propriedade, ajuste aqui
          setPerfis(data.perfis || []);
        }
      } catch (error) {
        console.error("Erro ao buscar perfis:", error);
        toast.error("Erro ao carregar perfis");
      }
      setLoading(false);
    }
    fetchPerfis();
  }, []);

  // Monta a URL completa do avatar (caso não seja uma URL absoluta)
  const getAvatarUrl = (avatar: string) => {
    return avatar.startsWith("http")
      ? avatar
      : `${baseUrl}/assets/perfis/${avatar.replace(/^\//, "")}`;
  };

  // Função para lidar com a seleção do perfil
  const handleSelectPerfil = async (perfil: Perfil) => {
    // Se o perfil possuir um PIN definido, solicita a validação
    if (perfil.pin && perfil.pin.trim() !== "") {
      const enteredPin = window.prompt("Digite o PIN para este perfil:");
      if (!enteredPin) {
        toast.error("PIN não informado");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/api/perfis/validar-pin/${perfil.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ pin: enteredPin }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "PIN inválido");
          return;
        }
      } catch (error) {
        console.error("Erro na validação do PIN:", error);
        toast.error("Erro ao validar o PIN");
        return;
      }
    }
    // Se a validação passou (ou não há PIN), chama o callback com o perfil selecionado
    onSelect(perfil);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6">Selecione seu Perfil</h2>
        {loading ? (
          <p className="text-white">Carregando perfis...</p>
        ) : perfis.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {perfis.map((perfil) => (
              <motion.div
                key={perfil.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSelectPerfil(perfil)}
                className="cursor-pointer flex flex-col items-center"
              >
                <img
                  src={getAvatarUrl(perfil.avatar)}
                  alt={perfil.nome}
                  className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-transparent hover:border-blue-500"
                />
                <p className="text-white text-center">{perfil.nome}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-white">Nenhum perfil encontrado.</p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
