/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // exporta como site estático
  eslint: {
    ignoreDuringBuilds: true, // ignora erros do eslint no build
  },
  images: {
    unoptimized: true, // evita otimizações pesadas em imagens
  },
  experimental: {
    turbo: {}
  }  
};

module.exports = nextConfig;
