import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import "video.js/dist/video-js.css"; // Importa o CSS do Video.js

const baseUrl = "https://api.streamhivex.icu";
interface PlayerModalProps {
  content: any;
  onClose: () => void;
}

export function PlayerModal({ content, onClose }: PlayerModalProps) {
  const videoNode = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);
  const [videoUrl, setVideoUrl] = useState("");

  // Registra o watch no backend quando o vídeo começar a ser reproduzido
  const registerWatch = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/api/watch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conteudo_id: content.id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Assistido registrado com sucesso.");
      } else {
        toast.error(data.message || "Erro ao registrar conteúdo assistido.");
      }
    } catch (error) {
      console.error("Erro ao registrar watch:", error);
      toast.error("Erro na conexão com o servidor.");
    }
  };

  // Define a URL do vídeo, utilizando o proxy se necessário
  useEffect(() => {
    if (!content) return;
    if (content.url.startsWith("http://")) {
      const proxied = `${baseUrl}/api/proxy?url=${encodeURIComponent(content.url)}`;
      setVideoUrl(proxied);
    } else {
      setVideoUrl(content.url);
    }
  }, [content]);

  // Inicializa o Video.js player
  useEffect(() => {
    if (videoNode.current && videoUrl) {
      const player = videojs(videoNode.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
        fluid: true,
        sources: [
          {
            src: videoUrl,
            type: "video/mp4",
          },
        ],
      });
      playerRef.current = player;

      // Registra o watch ao iniciar a reprodução (apenas uma vez)
      player.one("play", () => {
        registerWatch();
      });

      return () => {
        if (playerRef.current) {
          playerRef.current.dispose();
        }
      };
    }
  }, [videoUrl]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-background p-4 rounded-lg w-full max-w-4xl relative"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={onClose}
            variant="ghost"
            className="absolute top-4 right-4 text-white"
          >
            Fechar
          </Button>
          <div data-vjs-player>
            <video
              ref={videoNode}
              className="video-js vjs-big-play-centered vjs-fluid rounded-lg"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
