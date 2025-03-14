"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Film,
  Tv,
  Trophy,
  Heart,
  Clock,
} from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 0);
    });
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-green-500">
                Streamify
              </h1>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="hover:bg-white/10">
                <Film className="w-4 h-4 mr-2" /> Movies
              </Button>
              <Button variant="ghost" className="hover:bg-white/10">
                <Tv className="w-4 h-4 mr-2" /> TV Shows
              </Button>
              <Button variant="ghost" className="hover:bg-white/10">
                <Trophy className="w-4 h-4 mr-2" /> Awards
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hover:bg-white/10">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className="hover:bg-white/10">
              <User className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Profile</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}