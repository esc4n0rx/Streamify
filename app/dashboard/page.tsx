"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlayCircle, Info, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import useEmblaCarousel from "embla-carousel-react";
import { ProfileSelector } from "@/components/ProfileSelector";
import { ContentDetailModal } from "@/components/ContentDetailModal";
import { PlayerModal } from "@/components/PlayerModal";

const baseUrl = "https://api.streamhivex.icu";

function ContentCarousel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
          <Button variant="ghost" className="hover:bg-white/10">
            See All
          </Button>
        </div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState<{ nome: string; url_avatar: string } | null>(null);
  const [showProfileSelector, setShowProfileSelector] = useState(true);
  const [contents, setContents] = useState<any[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedContent, setSelectedContent] = useState<any | null>(null);
  const [playingContent, setPlayingContent] = useState<any | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  // Recupera os dados do usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Busca os conteúdos reais da API e filtra pela categoria "LANÇAMENTOS"
  useEffect(() => {
    async function fetchContent() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/api/content`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("Dados retornados da API /api/content:", data);
        const lancamentos = data.data?.LANÇAMENTOS;
        if (lancamentos) {
          let merged: any[] = [];
          if (lancamentos.Filme) merged = merged.concat(lancamentos.Filme);
          if (lancamentos.Serie) merged = merged.concat(lancamentos.Serie);
          console.log("Conteúdos mesclados:", merged);
          setContents(merged);
        } else {
          toast.error("Nenhum conteúdo de LANÇAMENTOS encontrado");
          console.log("Chave 'LANÇAMENTOS' não encontrada na resposta:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar conteúdos:", error);
        toast.error("Erro na conexão com o servidor");
      }
    }
    fetchContent();
  }, []);

  // Auto-avança o hero carousel a cada 5 segundos com transição suave
  useEffect(() => {
    if (contents.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prevIndex) => (prevIndex + 1) % contents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [contents]);

  // Divide os conteúdos em três grupos de até 4 itens cada
  const novidades = contents.slice(0, 4);
  const emAlta = contents.slice(4, 8);
  const perfeitoParaVoce = contents.slice(8, 12);

  const handleContentClick = (content: any) => {
    setSelectedContent(content);
  };

  const handlePlay = (content: any) => {
    // Fecha o modal de detalhes e abre o player
    setPlayingContent(content);
    setSelectedContent(null);
    setShowPlayer(true);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {user && showProfileSelector && (
        <ProfileSelector user={user} onSelect={() => setShowProfileSelector(false)} />
      )}

      <Navbar />

      {/* Hero Carousel: ao clicar no botão Play Now, abre o modal de detalhes */}
      <motion.div
        ref={heroRef}
        style={{ opacity }}
        className="relative h-[85vh] overflow-hidden flex items-center justify-center bg-black cursor-pointer"
        onClick={() => handleContentClick(contents[heroIndex])}
      >
        <AnimatePresence mode="wait">
          {contents.length > 0 && (
            <motion.img
              key={contents[heroIndex].id}
              src={contents[heroIndex].poster}
              alt={contents[heroIndex].nome}
              className="max-w-full max-h-full object-contain"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 1.5 }}
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {contents.length > 0 && (
              <motion.div
                key={contents[heroIndex].id + "-text"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="max-w-2xl"
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                  {contents[heroIndex].nome}
                </h1>
                {contents[heroIndex].descricao && (
                  <p className="text-lg text-gray-300 mb-6">
                    {contents[heroIndex].descricao}
                  </p>
                )}
                <div className="flex gap-4">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContentClick(contents[heroIndex]);
                    }}
                    className="glow-effect bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <PlayCircle className="mr-2 h-5 w-5" /> Play Now
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContentClick(contents[heroIndex]);
                    }}
                    variant="outline"
                    className="glass"
                  >
                    <Info className="mr-2 h-5 w-5" /> More Info
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modal de detalhes do conteúdo */}
      <AnimatePresence>
        {selectedContent && (
          <ContentDetailModal
            content={selectedContent}
            onClose={() => setSelectedContent(null)}
            onPlay={handlePlay}
          />
        )}
      </AnimatePresence>

      {/* Modal do player */}
      <AnimatePresence>
        {showPlayer && playingContent && (
          <PlayerModal
            content={playingContent}
            onClose={() => {
              setShowPlayer(false);
              setPlayingContent(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Carrosséis de categorias */}
      {novidades.length > 0 && (
        <ContentCarousel title="Novidades" icon={<TrendingUp className="w-6 h-6" />}>
          {novidades.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="min-w-[300px] group relative rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleContentClick(item)}
            >
              <div className="aspect-video relative">
                <img
                  src={item.poster}
                  alt={item.nome}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-semibold mb-1 text-white">{item.nome}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </ContentCarousel>
      )}

      {emAlta.length > 0 && (
        <ContentCarousel title="Em Alta" icon={<TrendingUp className="w-6 h-6" />}>
          {emAlta.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="min-w-[300px] group relative rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleContentClick(item)}
            >
              <div className="aspect-video relative">
                <img
                  src={item.poster}
                  alt={item.nome}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-semibold mb-1 text-white">{item.nome}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </ContentCarousel>
      )}

      {perfeitoParaVoce.length > 0 && (
        <ContentCarousel title="Perfeito Para Você" icon={<TrendingUp className="w-6 h-6" />}>
          {perfeitoParaVoce.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="min-w-[300px] group relative rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleContentClick(item)}
            >
              <div className="aspect-video relative">
                <img
                  src={item.poster}
                  alt={item.nome}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-semibold mb-1 text-white">{item.nome}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </ContentCarousel>
      )}
    </div>
  );
}
