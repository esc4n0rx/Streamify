"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { PlayCircle, Film, Tv2, Award } from "lucide-react";
import { AuthModal } from "../components/auth-modal";

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fundo de vídeo animado */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover z-[-2]"
      >
        <source src="/videos/fundo.mp4" type="video/mp4" />
      </video>

      {/* Overlay com blur sobre o vídeo */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md z-[-1]" />

      {/* Modal de autenticação (renderizado diretamente, pois já possui posicionamento fixo) */}
      {isAuthOpen && (
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      )}

      {/* Conteúdo principal */}
      <div className="relative z-10">
        {/* Seção Principal */}
        <motion.section
          ref={heroRef}
          initial={{ opacity: 0, y: 50 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative h-screen flex items-center justify-center text-center px-4"
        >
          <div className="ambient-light">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-green-500">
              Streamify
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              A próxima geração da experiência de streaming
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                className="glow-effect bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => setIsAuthOpen(true)}
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Começar a assistir
              </Button>
              <Button variant="outline" className="glass hover:bg-white/10">
                Saiba mais
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Seção de Funcionalidades */}
        <motion.section
          ref={featuresRef}
          initial={{ opacity: 0, y: 50 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="py-20 px-4"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">
              Experimente a Diferença
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Film className="h-8 w-8" />,
                  title: "Filmes",
                  description:
                    "Assista aos últimos lançamentos e clássicos atemporais com qualidade impressionante",
                },
                {
                  icon: <Tv2 className="h-8 w-8" />,
                  title: "Séries de TV",
                  description:
                    "Maratone suas séries favoritas com novos episódios adicionados semanalmente",
                },
                {
                  icon: <Award className="h-8 w-8" />,
                  title: "Originais",
                  description:
                    "Conteúdo exclusivo que você não encontrará em nenhum outro lugar",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="glass rounded-xl p-6 text-center"
                >
                  <div className="mb-4 inline-block p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
