"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  PlayCircle,
  Info,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import useEmblaCarousel from "embla-carousel-react";

const TRENDING_CONTENT = [
  {
    id: 1,
    title: "The Last Journey",
    description: "An epic adventure across the galaxy",
    image: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=800&q=80",
    category: "Sci-Fi",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Nature's Secrets",
    description: "Explore the hidden wonders of Earth",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
    category: "Documentary",
    rating: 4.5,
  },
  {
    id: 3,
    title: "Urban Legends",
    description: "Mysteries that shaped our cities",
    image: "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?w=800&q=80",
    category: "Mystery",
    rating: 4.7,
  },
  {
    id: 4,
    title: "Ocean's Depths",
    description: "Journey to the bottom of the sea",
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80",
    category: "Documentary",
    rating: 4.6,
  },
  {
    id: 5,
    title: "Cyberpunk Dreams",
    description: "A future where technology rules",
    image: "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=800&q=80",
    category: "Sci-Fi",
    rating: 4.9,
  },
];

const CONTINUE_WATCHING = [
  {
    id: 1,
    title: "Lost in Time",
    progress: 45,
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    timestamp: "45:23",
  },
  {
    id: 2,
    title: "The Hidden Forest",
    progress: 75,
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    timestamp: "1:15:45",
  },
  {
    id: 3,
    title: "Sky Warriors",
    progress: 30,
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
    timestamp: "25:10",
  },
];

function ContentCarousel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
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
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          <Button variant="ghost" className="hover:bg-white/10">
            See All <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  useEffect(() => {
    toast.success("Welcome to Streamify!");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Carousel */}
      <motion.div
        ref={heroRef}
        style={{ opacity }}
        className="relative h-[85vh] overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0"
        >
          <motion.div
            style={{ scale }}
            className="absolute inset-0 bg-cover bg-center"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10 }}
            style={{
              backgroundImage: `url(${TRENDING_CONTENT[0].image})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </motion.div>
        </motion.div>
        
        <div className="relative h-full flex items-end pb-20 px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 mb-4"
            >
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-lg font-semibold">{TRENDING_CONTENT[0].rating}</span>
              <span className="text-gray-400">• {TRENDING_CONTENT[0].category}</span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {TRENDING_CONTENT[0].title}
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              {TRENDING_CONTENT[0].description}
            </p>
            <div className="flex gap-4">
              <Button className="glow-effect bg-gradient-to-r from-blue-600 to-purple-600">
                <PlayCircle className="mr-2 h-5 w-5" /> Play Now
              </Button>
              <Button variant="outline" className="glass">
                <Info className="mr-2 h-5 w-5" /> More Info
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Continue Watching */}
      <ContentCarousel title="Continue Watching" icon={<Clock className="w-6 h-6" />}>
        {CONTINUE_WATCHING.map((content) => (
          <motion.div
            key={content.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="min-w-[300px] relative rounded-lg overflow-hidden glass"
          >
            <div className="aspect-video relative">
              <img
                src={content.image}
                alt={content.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
                <div className="flex items-center justify-between text-sm">
                  <span>{content.timestamp}</span>
                  <Button size="sm" variant="ghost" className="hover:bg-white/20">
                    <PlayCircle className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${content.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </ContentCarousel>

      {/* Trending Now */}
      <ContentCarousel title="Trending Now" icon={<TrendingUp className="w-6 h-6" />}>
        {TRENDING_CONTENT.map((content) => (
          <motion.div
            key={content.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="min-w-[300px] group relative rounded-lg overflow-hidden cursor-pointer"
          >
            <div className="aspect-video relative">
              <img
                src={content.image}
                alt={content.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{content.rating}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{content.title}</h3>
                <p className="text-sm text-gray-300">{content.category}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </ContentCarousel>
    </div>
  );
}