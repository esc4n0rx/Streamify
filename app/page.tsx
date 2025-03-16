"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import {
  PlayCircle,
  Film,
  Tv2,
  Award,
  Sparkles,
  Flame,
  Star,
  ChevronRight,
  Popcorn,
  Gamepad2,
  Globe,
} from "lucide-react"
import { AuthModal } from "../components/auth-modal"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Featured content data
const featuredContent = [
  {
    id: 1,
    title: "Anora (2024)",
    category: "Drama",
    rating: 9.2,
    image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/xmFdNzbUiT5XmH6rbIVGYDQHGeo.jpg?height=600&width=400",
    trending: true,
  },
  {
    id: 2,
    title: "Moana 2",
    category: "Fantasy",
    rating: 8.7,
    image: "http://image.tmdb.org/t/p/w600_and_h900_bestv2/dnqgkKoIGf6hErzRm6VtaK1OJrD.jpg?height=600&width=400",
    new: true,
  },
  {
    id: 3,
    title: "Solo Leveling",
    category: "Anime",
    rating: 8.9,
    image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg?height=600&width=400",
    exclusive: true,
  },
  {
    id: 4,
    title: "Mickey 17 (2025)",
    category: "Fiction",
    rating: 9.5,
    image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/5eZTyuqOzK4PuKrcOX3ixafBjcd.jpg?height=600&width=400",
    trending: true,
  },
  {
    id: 5,
    title: "INVENCÍVEL (2021)",
    category: "Animação",
    rating: 8.8,
    image: "http://image.tmdb.org/t/p/w600_and_h900_bestv2/29myVHhdGoS735ZJ9hblY0pQ3K9.jpg?height=600&width=400",
    new: true,
  },
]

// Categories with icons
const categories = [
  { name: "Filmes", icon: <Film className="h-6 w-6" /> },
  { name: "Séries", icon: <Tv2 className="h-6 w-6" /> },
  { name: "Originais", icon: <Award className="h-6 w-6" /> },
  { name: "Jogos", icon: <Gamepad2 className="h-6 w-6" /> },
  { name: "Internacional", icon: <Globe className="h-6 w-6" /> },
]

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Parallax effect for hero section
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3])

  // Intersection observers for animations
  const [heroRef, heroInView] = useInView({ triggerOnce: false, threshold: 0.1 })
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [showcaseRef, showcaseInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredContent.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Scroll carousel to current slide
  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount = currentSlide * (carouselRef.current.offsetWidth / 2.5)
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }, [currentSlide])

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Video Background with Parallax */}
      <div className="fixed inset-0 z-[-2]">
        <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/fundo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black backdrop-blur-sm" />
      </div>

      {/* Animated particles overlay */}
      <div className="fixed inset-0 z-[-1] opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      </div>

      {/* Floating gradient orbs */}
      <div className="fixed top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-blue-600/10 blur-3xl animate-pulse-slow z-[-1]" />
      <div className="fixed bottom-1/3 right-1/4 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-purple-600/10 blur-3xl animate-pulse-slow animation-delay-2000 z-[-1]" />
      <div className="fixed top-2/3 left-1/3 w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-emerald-600/10 blur-3xl animate-pulse-slow animation-delay-4000 z-[-1]" />

      {/* Navbar */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-black/80 backdrop-blur-md py-2" : "bg-transparent py-4"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500">
                Streamify
              </span>
            </motion.div>

            <nav className="hidden md:flex space-x-6">
              {categories.map((category, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-medium transition-all",
                    activeCategory === index ? "text-white" : "text-gray-400 hover:text-white"
                  )}
                  onClick={() => setActiveCategory(index)}
                >
                  {category.icon}
                  <span>{category.name}</span>
                  {activeCategory === index && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute bottom-0 h-0.5 w-full bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                  )}
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-white/10">
              Entrar
            </Button>
            <Button
              onClick={() => setIsAuthOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-purple-700/20"
            >
              Começar
            </Button>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthOpen && <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section with Parallax */}
        <motion.section
          ref={heroRef}
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={heroInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium"
            >
              <Sparkles className="mr-2 h-4 w-4 text-yellow-400" />O futuro do entretenimento está aqui
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 leading-tight"
            >
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400">
                Entretenimento Ilimitado
              </span>
              <span className="block text-white">Reinventado</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl mb-10 text-gray-300 max-w-2xl mx-auto"
            >
              Experimente a próxima geração de streaming com visuais impressionantes, recomendações personalizadas e
              conteúdo exclusivo.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={() => setIsAuthOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-purple-700/20 text-lg group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Começar a Assistir
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white/20 bg-white/5 backdrop-blur-lg hover:bg-white/10 text-lg"
              >
                Explorar Planos
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              className="flex flex-col items-center"
            >
              <span className="text-sm text-gray-400 mb-2">Role para explorar</span>
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                  className="w-1.5 h-1.5 bg-white rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Featured Content Carousel */}
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-between items-end mb-8"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Conteúdo em Destaque</h2>
                <p className="text-gray-400">Descubra o que está em alta agora</p>
              </div>

              <div className="flex gap-2">
                {featuredContent.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all",
                      currentSlide === index ? "bg-white w-8" : "bg-white/30 hover:bg-white/50"
                    )}
                  />
                ))}
              </div>
            </motion.div>

            <div className="relative overflow-hidden">
              <div ref={carouselRef} className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x">
                {featuredContent.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={cn(
                      "relative flex-shrink-0 w-[250px] h-[400px] sm:w-[300px] sm:h-[450px] rounded-xl overflow-hidden group snap-center",
                      currentSlide === index ? "ring-2 ring-white/50" : ""
                    )}
                  >
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />

                    {/* Content badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {item.trending && (
                        <span className="px-2 py-1 bg-red-500/80 backdrop-blur-sm rounded-md text-xs font-medium flex items-center">
                          <Flame className="mr-1 h-3 w-3" /> Em Alta
                        </span>
                      )}
                      {item.new && (
                        <span className="px-2 py-1 bg-blue-500/80 backdrop-blur-sm rounded-md text-xs font-medium">
                          NOVO
                        </span>
                      )}
                      {item.exclusive && (
                        <span className="px-2 py-1 bg-purple-500/80 backdrop-blur-sm rounded-md text-xs font-medium flex items-center">
                          <Sparkles className="mr-1 h-3 w-3" /> Exclusivo
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-300">{item.category}</span>
                        <span className="flex items-center text-yellow-400 text-sm">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400" />
                          {item.rating}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                      <Button size="sm" className="bg-white text-black hover:bg-white/90">
                        <PlayCircle className="mr-1.5 h-4 w-4" />
                        Assistir Agora
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Gradient fades on sides */}
              <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-black to-transparent" />
              <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-black to-transparent" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <motion.section
          ref={featuresRef}
          initial={{ opacity: 0 }}
          animate={featuresInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="py-24 px-4 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black z-[-1]" />

          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Experimente a Diferença
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Tecnologia de ponta encontra conteúdo incomparável
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Film className="h-8 w-8" />,
                  title: "Experiência Cinematográfica",
                  description:
                    "Assista aos últimos blockbusters e clássicos atemporais com impressionante resolução 8K e som Dolby Atmos",
                  color: "from-blue-500 to-blue-700",
                },
                {
                  icon: <Tv2 className="h-8 w-8" />,
                  title: "Séries Maratonaveis",
                  description:
                    "Maratone suas séries favoritas com novos episódios adicionados semanalmente e recomendações personalizadas",
                  color: "from-purple-500 to-indigo-700",
                },
                {
                  icon: <Award className="h-8 w-8" />,
                  title: "Originais Premiados",
                  description:
                    "Conteúdo exclusivo criado por cineastas visionários que você não encontrará em nenhum outro lugar",
                  color: "from-emerald-500 to-teal-700",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 overflow-hidden">
                    {/* Animated gradient background */}
                    <div
                      className={`absolute -inset-1 bg-gradient-to-r ${feature.color} blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-700`}
                    />

                    <div className="relative z-10">
                      <div className="mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5">
                        {feature.icon}
                      </div>

                      <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>

                      <p className="text-gray-300 mb-6">{feature.description}</p>

                      <Button variant="ghost" className="px-0 text-white hover:text-white hover:bg-transparent group">
                        <span>Saiba mais</span>
                        <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Content Showcase */}
        <motion.section
          ref={showcaseRef}
          initial={{ opacity: 0 }}
          animate={showcaseInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="py-24 px-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/10 to-black z-[-1]" />

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={showcaseInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Seu Entretenimento, <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                    Personalizado
                  </span>
                </h2>

                <p className="text-xl text-gray-300 mb-8">
                  Nosso mecanismo de recomendação com IA aprende o que você ama e sugere novos conteúdos feitos
                  especialmente para você.
                </p>

                <ul className="space-y-4 mb-8">
                  {[
                    "Recomendações inteligentes baseadas em seus hábitos de visualização",
                    "Crie vários perfis para todos em sua casa",
                    "Alterne perfeitamente entre dispositivos sem perder onde parou",
                    "Baixe conteúdo para visualização offline em qualquer lugar",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={showcaseInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      className="flex items-start"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center mt-1">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="ml-3 text-gray-200">{item}</span>
                    </motion.li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg shadow-emerald-700/20"
                >
                  Crie sua conta Agora.
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={showcaseInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-blue-500/10">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Personalized streaming experience"
                    fill
                    className="object-cover"
                  />

                  {/* UI overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold mb-2">Continue Assistindo</h3>
                      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {[1, 2, 3, 4].map((item) => (
                          <div key={item} className="flex-shrink-0 w-40 rounded-lg overflow-hidden">
                            <div className="aspect-video bg-gray-800 relative">
                              <Image
                                src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2/viUricKwbToOJIRrKOUr0Bg9rOY.jpg?height=120&width=200`}
                                alt={`Continue watching item ${item}`}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                                <div className="h-full bg-red-500" style={{ width: `${30 + item * 15}%` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="icon"
                      className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 border border-white/30"
                    >
                      <PlayCircle className="h-8 w-8" />
                    </Button>
                  </div>
                </div>

                {/* Floating UI elements */}
                <div className="absolute -top-6 -right-6 bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-xl">
                  <div className="flex items-center gap-3">
                    <Popcorn className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm font-medium">Recomendado para você</span>
                  </div>
                </div>

                <div className="absolute -bottom-8 -left-8 bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">4K Ultra HD Disponível</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          ref={testimonialsRef}
          initial={{ opacity: 0 }}
          animate={testimonialsInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="py-24 px-4 relative"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">O Que Nossos Usuários Dizem</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">Junte-se a milhões de espectadores satisfeitos</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Johnson",
                  role: "Amante de Filmes",
                  image: "https://w7.pngwing.com/pngs/184/113/png-transparent-user-profile-computer-icons-profile-heroes-black-silhouette-thumbnail.png?height=100&width=100",
                  quote:
                    "O Streamify mudou totalmente a minha forma de assistir filmes. A qualidade em 4K é incrível e as recomendações personalizadas são muito precisas!",
                  rating: 5,
                },
                {
                  name: "Sarah Williams",
                  role: "Viciada em Séries",
                  image: "https://w7.pngwing.com/pngs/184/113/png-transparent-user-profile-computer-icons-profile-heroes-black-silhouette-thumbnail.png?height=100&width=100",
                  quote:
                    "Já testei várias plataformas de streaming, mas nenhuma se compara ao Streamify. Só o conteúdo exclusivo já vale a assinatura!",
                  rating: 5,
                },
                {
                  name: "Michael Chen",
                  role: "Especialista em Tecnologia",
                  image: "https://w7.pngwing.com/pngs/184/113/png-transparent-user-profile-computer-icons-profile-heroes-black-silhouette-thumbnail.png?height=100&width=100",
                  quote:
                    "A qualidade do streaming e a interface são excelentes. O Streamify realmente eleva o padrão do que esperamos de um serviço de streaming.",
                  rating: 4,
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6">&quot;{testimonial.quote}&quot;</p>

                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                        )}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <section className="py-24 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/10 to-black z-[-1]" />

          <div className="max-w-5xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl" />

            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Pronto para Começar a Assistir?</h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Junte-se a milhões de espectadores hoje e experimente entretenimento como nunca antes. Experimente sem
                  riscos com nossa garantia de devolução do dinheiro em 30 dias.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => setIsAuthOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-purple-700/20 text-lg"
                  >
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Inicie Seu Período Gratuito
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/20 bg-white/5 backdrop-blur-lg hover:bg-white/10 text-lg"
                  >
                    Ver Planos
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500">
                  Streamify
                </span>
              </div>
              <p className="text-gray-400 mb-6">A próxima geração de entretenimento em streaming.</p>
              <div className="flex gap-4">
              {["twitter", "facebook", "instagram", "youtube"].map((social) => {
                  const iconClass = `w-5 h-5 bg-gray-400 mask-image-[url('/icons/${social}.svg')]`;
                  return (
                    <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                      <span className="sr-only">{social}</span>
                      <div className={iconClass} />
                    </a>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Empresa</h4>
              <ul className="space-y-3">
                {["Sobre", "Carreiras", "Imprensa", "Blog"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Suporte</h4>
              <ul className="space-y-3">
                {["Central de Ajuda", "Fale Conosco", "Dispositivos", "Conta"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-3">
                {[
                  "Termos de Serviço",
                  "Política de Privacidade",
                  "Preferências de Cookies",
                  "Informações Corporativas",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Streamify. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">
                Termos
              </a>
              <a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">
                Privacidade
              </a>
              <a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
