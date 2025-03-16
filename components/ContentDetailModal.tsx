"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { toast } from "sonner";

const baseUrl = "https://api.streamhivex.icu";

interface ContentDetailModalProps {
  content: any;
  onClose: () => void;
  onPlay: (content: any) => void;
}

export function ContentDetailModal({ content, onClose, onPlay }: ContentDetailModalProps) {
  const [favorited, setFavorited] = useState(false);
  const [description, setDescription] = useState(content.sinopse || content.descricao || "");

  // Se a descrição estiver vazia ou for "Descrição Genérica", busca uma nova descrição via API de sinopse
  useEffect(() => {
    if (!description || description.trim() === "" || description === "Descrição Genérica") {
      const fetchDescription = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(
            `${baseUrl}/api/sinopse?nome=${encodeURIComponent(content.nome)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await res.json();
          // Supondo que a resposta retorne a descrição em data.descricao
          if (data.descricao) {
            setDescription(data.descricao);
          } else {
            // Caso não retorne, mantém a descrição original ou um fallback
            setDescription(content.nome);
          }
        } catch (error) {
          console.error("Erro ao buscar descrição:", error);
          setDescription(content.nome);
        }
      };
      fetchDescription();
    }
  }, [content.nome, description]);

  const handleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conteudo_id: content.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setFavorited(true);
        toast.success("Conteúdo favoritado!");
      } else {
        toast.error(data.message || "Erro ao favoritar");
      }
    } catch (error) {
      console.error("Erro ao favoritar:", error);
      toast.error("Erro na conexão com o servidor");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-background p-6 rounded-lg max-w-md w-full"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={content.poster}
            alt={content.nome}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h2 className="text-2xl font-bold text-white mb-2">{content.nome}</h2>
          <p className="text-gray-300 mb-4">{description}</p>
          {/* Mockup de estrelas */}
          <div className="flex items-center mb-4">
            <span className="text-yellow-400 mr-2">★★★★☆</span>
            <span className="text-gray-300">4.0</span>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => onPlay(content)}
              className="glow-effect bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <PlayCircle className="mr-2 h-5 w-5" /> Play
            </Button>
            <Button onClick={handleFavorite} variant="outline" className="glass">
              {favorited ? "Favoritado" : "Favoritar"}
            </Button>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            className="mt-4 text-blue-400 hover:underline w-full"
          >
            Fechar
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
