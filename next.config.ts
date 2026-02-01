import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${process.env.BACKEND_URL}/:path*`, 
      },
    ];
  },
  
  // --- AÑADIMOS ESTO PARA SOLUCIONAR EL ERROR DEL POPUP ---
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
  
  reactCompiler: true,
};

export default nextConfig;