import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { GoogleOAuthProvider } from '@react-oauth/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: true,
  display: "swap", // <-- Añade esto para quitar el aviso de preload
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: true,
  display: "swap", // <-- Añade esto también
});

export const metadata: Metadata = {
  title: "AuthCore - Sistema de Gestión de Usuarios",
  description: "SaaS modular de autenticación y gestión de usuarios con Next.js 15",
};

export default function RootLayout({  
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Principio de robustez: avisar si falta la configuración
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.warn("⚠️ Google Client ID no encontrado en las variables de entorno");
  }

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={clientId || ''}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}