"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const baseUrl = "https://api.streamhivex.icu";

interface PlayerModalProps {
  content: any;
  onClose: () => void;
}

export function PlayerModal({ content, onClose }: PlayerModalProps) {
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    if (!content) return;
    // Se a URL do conteúdo começar com "http:" (não seguro), usa o proxy
    if (content.url.startsWith("http://")) {
      const proxied = `${baseUrl}/api/proxy?url=${encodeURIComponent(content.url)}`;
      setVideoUrl(proxied);
    } else {
      // Se for https, usa a URL diretamente
      setVideoUrl(content.url);
    }
  }, [content]);

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
          {/* Placeholder para player customizado */}
          <div className="w-full h-0" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={videoUrl}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
