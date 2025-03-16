"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ProfileSelectorProps {
  user: {
    nome: string;
    url_avatar: string;
  };
  onSelect: () => void;
}

export function ProfileSelector({ user, onSelect }: ProfileSelectorProps) {
  // Define a URL base do backend
  const baseUrl = "https://api.streamhivex.icu";

  // Se a url_avatar não for absoluta, junta com a baseUrl
  const avatarUrl = user.url_avatar.startsWith("http")
    ? user.url_avatar
    : `${baseUrl}/${user.url_avatar.replace(/^\//, "")}`;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="glass p-8 rounded-xl cursor-pointer flex flex-col items-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onSelect}
        >
          <img
            src={avatarUrl}
            alt={user.nome}
            className="w-24 h-24 rounded-full mb-4 object-cover"
          />
          <h2 className="text-center text-2xl font-bold text-white">
            {user.nome}
          </h2>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
