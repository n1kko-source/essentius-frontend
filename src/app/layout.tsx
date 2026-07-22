import type { Metadata } from "next";
import { Source_Serif_4, IBM_Plex_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AppMotionConfig } from "@/components/motion/MotionConfig";

/** Titulares: serif editorial, formal y legible (no display “playful”). */
const display = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
});

/** Cuerpo UI: sans profesional, diseñado para productos (no Inter/system). */
const body = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Essentius | Aprendizaje con tu propio pensamiento",
  description:
    "Gestiona tu aprendizaje, escribe sin IA y compara tus ideas con la ciencia y tu biblioteca.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full light",
        "antialiased",
        display.variable,
        body.variable,
        geistMono.variable
      )}
      data-accent="cool"
      data-age="18-25"
      data-density="comfortable"
      data-type="lg"
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <AppMotionConfig>{children}</AppMotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
