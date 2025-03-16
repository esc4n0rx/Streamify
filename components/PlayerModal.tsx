"use client"

import { useEffect, useRef, useState } from "react"
import videojs from "video.js"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import "video.js/dist/video-js.css" // Importa o CSS do Video.js
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const baseUrl = "https://api.streamhivex.icu"
interface PlayerModalProps {
  content: any
  onClose: () => void
}

export function PlayerModal({ content, onClose }: PlayerModalProps) {
  const videoNode = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null)
  const [videoUrl, setVideoUrl] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Registra o watch no backend quando o vídeo começar a ser reproduzido
  const registerWatch = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${baseUrl}/api/watch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conteudo_id: content.id }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Assistido registrado com sucesso.")
      } else {
        toast.error(data.message || "Erro ao registrar conteúdo assistido.")
      }
    } catch (error) {
      console.error("Erro ao registrar watch:", error)
      toast.error("Erro na conexão com o servidor.")
    }
  }

  // Define a URL do vídeo, utilizando o proxy se necessário
  useEffect(() => {
    if (!content) return
    if (content.url.startsWith("http://")) {
      const proxied = `${baseUrl}/api/proxy?url=${encodeURIComponent(content.url)}`
      setVideoUrl(proxied)
    } else {
      setVideoUrl(content.url)
    }
  }, [content])

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
        playbackRates: [0.5, 1, 1.5, 2],
        controlBar: {
          children: [
            "playToggle",
            "progressControl",
            "volumePanel",
            "currentTimeDisplay",
            "timeDivider",
            "durationDisplay",
            "playbackRateMenuButton",
            "fullscreenToggle",
          ],
        },
      })
      playerRef.current = player

      // Customiza a aparência do player
      player.addClass("vjs-custom-theme")

      // Registra o watch ao iniciar a reprodução (apenas uma vez)
      player.one("play", () => {
        registerWatch()
      })

      // Monitora o estado de fullscreen
      player.on("fullscreenchange", () => {
        setIsFullscreen(player.isFullscreen() ?? false)
      })

      return () => {
        if (playerRef.current) {
          playerRef.current.dispose()
        }
      }
    }
  }, [videoUrl])

  // Função para lidar com o ESC para fechar o modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <motion.div
          className={cn(
            "bg-background/95 dark:bg-background/80 rounded-xl shadow-2xl w-full max-w-5xl relative overflow-hidden border border-border/50",
            isFullscreen ? "fixed inset-0 max-w-none rounded-none" : "",
          )}
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
          }}
        >
          {/* Header with title */}
          <div className="flex items-center justify-between p-4 border-b border-border/30">
            <h3 className="text-lg font-medium truncate pr-4">{content?.title || "Reproduzindo vídeo"}</h3>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-destructive/10 transition-colors"
              aria-label="Fechar player"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Video player */}
          <div className="relative">
            <div data-vjs-player className="aspect-video">
              <video ref={videoNode} className="video-js vjs-big-play-centered vjs-fluid rounded-lg shadow-md" />
            </div>
          </div>

          {/* Custom styles for video.js */}
          <style jsx global>{`
            /* Custom player theme */
            .video-js {
              font-family: system-ui, -apple-system, sans-serif;
            }
            
            /* Big play button */
            .vjs-big-play-button {
              background-color: rgba(0, 0, 0, 0.5) !important;
              border: 2px solid white !important;
              border-radius: 50% !important;
              width: 60px !important;
              height: 60px !important;
              line-height: 60px !important;
              margin-left: -30px !important;
              margin-top: -30px !important;
              transition: all 0.3s ease !important;
            }
            
            .vjs-big-play-button:hover {
              background-color: rgba(0, 0, 0, 0.7) !important;
              transform: scale(1.1);
            }
            
            /* Progress bar */
            .vjs-play-progress {
              background-color: #3b82f6 !important;
            }
            
            .vjs-progress-control:hover .vjs-progress-holder {
              height: 8px !important;
            }
            
            .vjs-progress-holder {
              height: 5px !important;
              transition: height 0.2s ease !important;
            }
            
            /* Control bar */
            .vjs-control-bar {
              background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%) !important;
              height: 48px !important;
              border-radius: 0 0 8px 8px;
              opacity: 0;
              transition: opacity 0.3s ease !important;
            }
            
            .video-js:hover .vjs-control-bar {
              opacity: 1;
            }
            
            /* Button hover effects */
            .vjs-control:hover {
              color: #3b82f6 !important;
            }
            
            /* Volume slider */
            .vjs-volume-level {
              background-color: #3b82f6 !important;
            }
            
            /* Loading spinner */
            .vjs-loading-spinner {
              border: 4px solid rgba(255, 255, 255, 0.25);
              border-top-color: #3b82f6 !important;
            }
            
            /* Time display */
            .vjs-current-time,
            .vjs-duration,
            .vjs-time-divider {
              padding: 0 4px !important;
            }
            
            /* Responsive adjustments */
            @media (max-width: 640px) {
              .vjs-time-divider,
              .vjs-duration {
                display: none !important;
              }
              
              .vjs-control-bar {
                height: 40px !important;
              }
            }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

